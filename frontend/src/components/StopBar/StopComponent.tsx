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
            <Window style={{ width: 150, minHeight: 50}}>
                <WindowHeader className="stopWindowHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>                    
                    <span style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>
                        {name}
                    </span>
                    <div style={{
                            flexShrink: 0,
                            paddingLeft: '4px', 
                            visibility: hovered ? 'visible' : 'hidden',
                            display: hovered ? 'block' : 'none'}}>                        
                        <Button
                            square
                            size="sm"
                            style={{marginRight: '4px'}}
                            onPointerDown={(e) => { e.stopPropagation(); }}
                            onPointerUp={(e) => { e.stopPropagation(); }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit?.(id);
                        }}>
                            ✍️
                        </Button>

                        <Button
                            square
                            size="sm"
                            style={{}}
                            onPointerDown={(e) => { e.stopPropagation(); }}
                            onPointerUp={(e) => { e.stopPropagation(); }}
                            onClick={(e) => {
                                onDelete?.(id);
                        }}>
                            ✕
                        </Button>
                    </div>
                    
                    </WindowHeader>
                <WindowContent className="stopWindowContent">
                    {address || "No address"}
                </WindowContent>
            </Window>
        </div>
    )
}
