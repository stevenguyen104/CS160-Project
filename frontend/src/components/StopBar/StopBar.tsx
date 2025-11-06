import React from "react";
import StopComponent from "./StopComponent";
import "./StopBar.css"
import { ScrollView } from "react95";
import { useRef, useState, useEffect } from "react";
import StartCard from "./StartCard";

interface Places{
    placeLocations: google.maps.places.PlaceResult[];
    onItemsChange?: (updatedItems: any[]) => void;
    onEnterClick?: () => void;
    onEditPlace?: (place: any) => void;

}


export default function StopBar({placeLocations, onItemsChange, onEnterClick, onEditPlace}: Places){

    const [items, setItems] = useState<any[]>(placeLocations || []);


    useEffect(() => {
        setItems(placeLocations || []);
    }, [placeLocations]);

    useEffect(() => {
        onItemsChange?.(items);
        console.log(items);
    }, [items]);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const placeholderIndexRef = useRef<number | null>(null);
    const setPlaceholderIndex = (i: number | null) => {
        placeholderIndexRef.current = i;
    };
    const draggedRectRef = useRef<DOMRect | null>(null);

    const draggingIndexRef = useRef<number | null>(null);
    const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const draggedElemRef = useRef<HTMLElement | null>(null);

    const onPointerMove = (e: PointerEvent) => {
        if (draggingIndexRef.current == null) return;
        const elem = draggedElemRef.current;
        if (!elem) return;

        const newLeft = e.clientX - dragOffsetRef.current.x;
        const newTop = e.clientY - dragOffsetRef.current.y;


        elem.style.position = "fixed";
        elem.style.left = `${newLeft}px`;
        elem.style.top = `${newTop}px`;
        elem.style.zIndex = "1000";
        elem.style.pointerEvents = "none";

        const container = containerRef.current;
        if (!container) 
            return;

        const children = Array.from(container.querySelectorAll<HTMLDivElement>(".placeDiv:not(.dragging)") );

        const pointerX = e.clientX;
        let hoverIndex: number | null = null;
        for (let i = 0; i < children.length; i++) {
            const r = children[i].getBoundingClientRect();
            const mid = r.left + r.width / 2;
            if (pointerX < mid) {
                hoverIndex = i;
                break;
            }
        }
        if (hoverIndex === null) hoverIndex = children.length;


        const mapping: number[] = [];
        items.forEach((_, idx) => {
            if (idx !== draggingIndexRef.current) mapping.push(idx);
        });
        const mappedIndex = mapping[hoverIndex] ?? items.length;

        if (placeholderIndexRef.current !== mappedIndex) {
            placeholderIndexRef.current = mappedIndex;
            setPlaceholderIndex(mappedIndex);
        }
    };

    const onPointerUp = (ev: PointerEvent) => {

        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);

        const elem = draggedElemRef.current;
        if (elem) {
            try {
                elem.releasePointerCapture(ev.pointerId);
            } catch (err) {
            }
            elem.style.pointerEvents = "";
            elem.style.position = "";
            elem.style.left = "";
            elem.style.top = "";
            elem.style.zIndex = "";
            try { elem.classList.remove("dragging"); } catch {}
        }

        const originalIndex = draggingIndexRef.current;
        dragOffsetRef.current = { x: 0, y: 0 };
        draggedElemRef.current = null;
        const placeIdx = placeholderIndexRef.current;
        if (originalIndex != null && placeIdx != null && originalIndex !== placeIdx) {
            const newItems = [...items];
            const [moved] = newItems.splice(originalIndex, 1);
            let insertAt = placeIdx;
            if (originalIndex < placeIdx) insertAt = placeIdx - 1;
            newItems.splice(insertAt, 0, moved);
            setItems(newItems);
            onItemsChange?.(newItems);
        }
        draggingIndexRef.current = null;
        placeholderIndexRef.current = null;
        setPlaceholderIndex(null);
        window.dispatchEvent(new Event("custom-drag-end"));
    };

    const handlePointerDown = (
        e: React.PointerEvent<HTMLDivElement>,
        index: number) => {
        e.preventDefault();

        const target = e.currentTarget as HTMLElement;
        target.setPointerCapture(e.pointerId);

        const rect = target.getBoundingClientRect();

        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        draggingIndexRef.current = index;

        dragOffsetRef.current = { x: offsetX, y: offsetY };

        draggedRectRef.current = rect;
        draggedElemRef.current = target;
        target.classList.add("dragging");
        placeholderIndexRef.current = index;
        setPlaceholderIndex(index);
        
        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", onPointerUp);
        requestAnimationFrame(() => {
            window.dispatchEvent(new Event("custom-drag-start"));
        });
    };

    const onDelete = (id: number) => {
        setItems(prevItems => prevItems.filter(item => item.place_id !== id)
        );
    }

    const onEdit = (id: number) => {
        console.log(id);
        console.log(items);
        const itemEdited = items.find((item) => item.place_id === id);
        if (itemEdited){
            console.log("found");
            onEditPlace?.(itemEdited);
        }
    }


    return(
        <>
        <div className="stopbar">
            <ScrollView
            style={{
            width: "100%",
            height: "100%",
            overflowX: "auto",
            overflowY: "hidden",
            whiteSpace: "nowrap",
            }}>
                <div className="stopbarScrollContainer" ref={containerRef}>
                <StartCard 
                    placeLocations = {placeLocations}
                    // startLocation={startLocation}
                    onEnterStartLocation={onEnterClick}
                    />
                {items
                // .filter((place) => place.name !== startLocation?.name) // exclude startlocation from being mdae into stopcompoentn
                .map((place, index) => (
                    <React.Fragment key={place.id}>
                    {placeholderIndexRef.current === index && (
                        <div
                        className="placeholder"
                        style={{
                            width: draggedRectRef.current?.width || 150,
                            height: draggedRectRef.current?.height || 50,
                        }}
                        />
                    )}
                    <StopComponent
                        id={place.place_id}
                        name={place.name}
                        address={place.formatted_address}
                        onPointerDown={(e) => handlePointerDown(e, index)}
                        onDelete={onDelete}
                        onEdit={onEdit}
                    />
                    </React.Fragment>
                ))}

                {placeholderIndexRef.current === items.length && (
                    <div
                    className="placeholder"
                    style={{
                        width: draggedRectRef.current?.width || 150,
                        height: draggedRectRef.current?.height || 50,
                    }}
                    />
                )}
                </div>
            </ScrollView>
        </div>
        </>
    )
}