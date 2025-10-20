import { useState } from "react";
import {Window, WindowHeader, WindowContent, Button } from "react95";
import "./StartCard.css";

interface StartDetails{
    id: number;
    name?: string;
    address?: string;
}


export default function StartCard({ id, name, address}: StartDetails) {
    
    return (
        <div className="placeDiv" 
            style={{ flex: '0 0 auto', cursor: 'grab' }}>
            <Window style={{ width: 150, minHeight: 50 }}>
                <WindowHeader className="stopWindowHeader">Start Location:{name}</WindowHeader>
                <WindowContent className="stopWindowContent">
                    {address || <Button className="startLocButton"> Enter Starting Location</Button>}
                </WindowContent>
            </Window>
        </div>
    )
}