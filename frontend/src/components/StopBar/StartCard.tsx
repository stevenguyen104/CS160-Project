import { useState } from "react";
import {Window, WindowHeader, WindowContent, Button } from "react95";
import "./StartCard.css";

interface StartDetails{
    id: number;
    name?: string;
    startLocation?: google.maps.places.PlaceResult | null;
    onEnterStartLocation?: () => void;
}


export default function StartCard({ id, name, startLocation, onEnterStartLocation}: StartDetails) {
    
    return (
        <div className="placeDiv" 
            style={{ flex: '0 0 auto', cursor: 'grab' }}>
            <Window style={{ width: 150, minHeight: 50 }}>
                <WindowHeader className="stopWindowHeader">Start Location:{name}</WindowHeader>
                <WindowContent className="stopWindowContent">
                    {startLocation ? 
                    (<div className="addressText"> {startLocation.formatted_address} </div>) : 
                    (<Button className="startLocButton" style={{
                        whiteSpace: "normal",
                        display: "block",
                        marginLeft: "auto", 
                        marginRight: "auto",
                        wordWrap: "break-word",
                        height: "auto",
                        maxWidth: "100%",
                        padding: "5px"
                    }}
                    onClick={onEnterStartLocation}>Enter Starting Location</Button>)}
                </WindowContent>
            </Window>
        </div>
    )
}