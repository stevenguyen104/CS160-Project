import { Button, Tooltip } from "react95";
import { Circle } from "@react95/icons"
import React from "react";

interface NewTripProps{
    setPlaces: React.Dispatch<React.SetStateAction<google.maps.places.PlaceResult[]>>;
    setTripID: (val: number) => void;
    setSaveTripOpen: (val: boolean) => void;
    setDirectionsMode: (val: boolean) => void;
}

export default function NewTripButton({setPlaces, setTripID, setSaveTripOpen, setDirectionsMode}: NewTripProps){
    return (
        <>
        <Tooltip text='Plan a new route' style={{ zIndex: 20 }} enterDelay={100} leaveDelay={100} position="right">

            <Button onClick={() => {
                setPlaces([]);
                setTripID(-1);
                setSaveTripOpen(false);
                setDirectionsMode(false);
            }}>
                <Circle/>
            </Button>
        </Tooltip>
        </>
    )
}