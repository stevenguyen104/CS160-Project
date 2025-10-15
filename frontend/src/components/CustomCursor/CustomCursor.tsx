import { useState, useEffect } from "react";
import "./CustomCursor.css";

export default function CustomCursor() {
	const [pos, setPos] = useState({ x: 0, y: 0 });
  	const [type, setType] = useState<"default" | "pointer" | "grab">("default");
  	const [draggingSlider, setDraggingSlider] = useState(false);

  	useEffect(() => {
    	const move = (e: PointerEvent) => {
      		setPos({ x: e.clientX, y: e.clientY });
    	};
		window.addEventListener("pointermove", move);

		const pointerElems = document.querySelectorAll("button, a");
		pointerElems.forEach((el) => {
			el.addEventListener("mouseenter", () => !draggingSlider && setType("pointer"));
			el.addEventListener("mouseleave", () => !draggingSlider && setType("default"));
		});

		const draggableElems = document.querySelectorAll(".draggable");
		draggableElems.forEach((el) => {
			el.addEventListener("mouseenter", () => !draggingSlider && setType("grab"));
			el.addEventListener("mouseleave", () => !draggingSlider && setType("default"));
		});

		const handleCustomDragStart = () => setType("grab");
		const handleCustomDragEnd = () => setType("default");
		window.addEventListener("custom-drag-start", handleCustomDragStart);
		window.addEventListener("custom-drag-end", handleCustomDragEnd);

		const handleSliderStart = () => {
			setDraggingSlider(true);
			setType("grab");
			document.body.style.cursor = "none";
		};

		const handleSliderEnd = () => {
			setDraggingSlider(false);
			setType("default");
			document.body.style.cursor = "none";
		};

		window.addEventListener("slider-drag-start", handleSliderStart);
		window.addEventListener("slider-drag-end", handleSliderEnd);

		return () => {
			window.removeEventListener("pointermove", move);
			window.removeEventListener("custom-drag-start", handleCustomDragStart);
			window.removeEventListener("custom-drag-end", handleCustomDragEnd);
			window.removeEventListener("slider-drag-start", handleSliderStart);
			window.removeEventListener("slider-drag-end", handleSliderEnd);
		};
  	}, [draggingSlider]);

  	return (
    <>
		{draggingSlider && (
			<div
			style={{
				position: "fixed",
				inset: 0,
				cursor: "none",
				pointerEvents: "auto",
				zIndex: 9998,
			}}
			/>
		)}

		<div
			className={`custom-cursor ${type}`}
			style={{
			left: `${pos.x}px`,
			top: `${pos.y}px`,
			transform: "translate(-50%, -50%)",
			}}
		/>
    </>
  	);
}
