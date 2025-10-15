import { Window, WindowHeader, WindowContent } from "react95";
import "./StopCard.css";

interface StopDetails{
    name: string;
    address: string;
    onPointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
}

export default function StopComponent({ name, address, onPointerDown }: StopDetails) {
    return (
        <div className="placeDiv" onPointerDown={onPointerDown} style={{ flex: '0 0 auto', cursor: 'grab' }}>
            <Window style={{ width: 150, minHeight: 50 }}>
                <WindowHeader className="stopWindowHeader">{name}</WindowHeader>
                <WindowContent className="stopWindowContent">
                    {address || "No address"}
                </WindowContent>
            </Window>
        </div>
    )
}
