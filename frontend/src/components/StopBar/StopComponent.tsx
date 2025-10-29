import { Window, WindowHeader, WindowContent, Button } from "react95";
import "./StopCard.css";
import { useState } from "react";

interface StopDetails{
    id: number;
    name: string;
    address: string;
    onPointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
    onDelete?:  (id: number) => void;
    onEdit?: (id: number) => void;
}

export default function StopComponent({ id, name, address, onPointerDown, onDelete, onEdit }: StopDetails) {
    const [hovered, setHovered] = useState(false);

    
    return (
        <div className="placeDiv" 
            onPointerDown={onPointerDown} 
            style={{ flex: '0 0 auto', cursor: 'grab' }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}>
            <Window style={{ width: 150, minHeight: 50 }}>
                <Button
                square
                size="sm"
                style={{ position: "absolute", top: 5, right: 20, display: hovered? 'flex' : 'none' }}
                onPointerDown={(e) => { e.stopPropagation(); }}
                onPointerUp={(e) => { e.stopPropagation(); }}
                onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(id);
                }}>
                    ✏️
                </Button>

                <Button
                square
                size="sm"
                style={{ position: "absolute", top: 5, right: 5, display: hovered? 'flex' : 'none' }}
                onPointerDown={(e) => { e.stopPropagation(); }}
                onPointerUp={(e) => { e.stopPropagation(); }}
                onClick={(e) => {
                    onDelete?.(id);
                }}>
                ✕
                </Button>
                <WindowHeader className="stopWindowHeader">{name}</WindowHeader>
                <WindowContent className="stopWindowContent">
                    {address || "No address"}
                </WindowContent>
            </Window>
        </div>
    )
}
