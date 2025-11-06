import { useState } from "react";
import {Window, WindowHeader, WindowContent, Button } from "react95";
import "./StartCard.css";

interface StartDetails{
    placeLocations: google.maps.places.PlaceResult[];
    onEnterStartLocation?: () => void;
}


export default function StartCard({ placeLocations, onEnterStartLocation}: StartDetails) {
    
    return (
        <>
        {(placeLocations.length === 0) && 
        <div className="placeDiv" 
            style={{ flex: '0 0 auto', cursor: 'grab' }}>
            <Window style={{ width: 150, minHeight: 50 }}>
                <WindowHeader className="stopWindowHeader" style={{textAlign: "center"}}>Find your route!</WindowHeader>
                <WindowContent className="stopWindowContent">   
                    <Button className="startLocButton" style={{
                        whiteSpace: "normal",
                        display: "block",
                        marginLeft: "auto", 
                        marginRight: "auto",
                        wordWrap: "break-word",
                        height: "auto",
                        maxWidth: "100%",
                        padding: "5px",
                        paddingLeft: "10px",
                        paddingRight: "10px"
                    }}
                    onClick={onEnterStartLocation}>Start</Button>
                </WindowContent>
            </Window>
        </div>}
        </>
        
    )
}