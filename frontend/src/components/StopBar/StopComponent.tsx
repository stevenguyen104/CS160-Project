import "./StopCard.css"

interface StopDetails{
    name: string;
    address: string;
    onPointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
}



export default function StopComponent({ name, address, onPointerDown }: StopDetails) {
    return (
        <>
            <div className="placeDiv" onPointerDown={onPointerDown}>
                    <h3 id="placeName">
                    {name}
                    </h3>
            </div>
        </>
    )
}