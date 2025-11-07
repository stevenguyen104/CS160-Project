import { useState } from "react";
import { Window, WindowContent, WindowHeader, Button } from "react95"
import DefaultSave from "./DefaultSave";

interface SelectedTripSaveProps {
    setSaveTripOpen: (val: boolean) => void;
    tripName: string,
    setTripName: (name: string) => void;
    isLoading: boolean;
    handleSaveTrip: (trip: string, isNew: boolean) => void;
}

export default function SelectedTripSave({setSaveTripOpen, tripName, setTripName, isLoading, handleSaveTrip}: SelectedTripSaveProps){
    //can prolly move this state up
    const [saveNew, setSaveNew] = useState(false);

    return (
            <>
            {saveNew && (
                <DefaultSave
                    setSaveTripOpen={setSaveTripOpen}
                    tripName={tripName}
                    setTripName={setTripName}
                    isLoading={isLoading}
                    handleSaveTrip={handleSaveTrip}
                    onCancel={() => {
                        setSaveNew(false);
                        setSaveTripOpen(false);
                    }}>
                </DefaultSave>
            )}
            {!saveNew &&
            <div className="overlay-backdrop" onClick={() => setSaveTripOpen(false)}>
                                    <Window
                    style={{ width: 300, height: 200, position: "relative" }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <WindowHeader>
                        <span>Save Trip</span>
                        <Button
                            square
                            size="sm"
                            onClick={() => setSaveTripOpen(false)}
                            style={{ position: "absolute", top: 5, right: 5 }}
                        >
                            ✕
                        </Button>
                    </WindowHeader>
                        <WindowContent>
                        <br/>
                        <div style={{ display: "flex", flexDirection: "row", gap: "8px", width: "100%", marginTop: "10px" }}>
                             {/* diff function  */}
                            <Button
                                style={{ flex: 1 }}
                                onClick={() => handleSaveTrip(tripName, false)}
                            >
                                Confirm
                            </Button>
                            <Button onClick={() => setSaveNew(true)}>
                                Save as New Trip
                            </Button>
                        </div>
                    </WindowContent>
                </Window>

                </div>}
            </>
    )
}