import { useState, useEffect } from "react";
import { Window, WindowContent, WindowHeader, Button } from "react95"
import DefaultSave from "./DefaultSave";
type Success = [string, string];

interface SelectedTripSaveProps {
    setSaveTripOpen: (val: boolean) => void;
    tripName: string,
    setTripName: (name: string) => void;
    isLoading: boolean;
    handleSaveTrip: (trip: string, isNew: boolean) => void;
    successMessage: Success;
    setSuccessMessage: React.Dispatch<React.SetStateAction<Success>>;
}

export default function SelectedTripSave({setSaveTripOpen, tripName, setTripName, isLoading, handleSaveTrip, successMessage, setSuccessMessage}: SelectedTripSaveProps){
    //can prolly move this state up
    const [saveNew, setSaveNew] = useState(false);

    useEffect(() => {
        if (saveNew) {
            setSuccessMessage(["", "black"]);
        }
    }, [saveNew]);

    return (
            <>
            {saveNew && (
                <DefaultSave
                    successMessage={successMessage}
                    setSuccessMessage={setSuccessMessage}
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
                        <p style={{ marginTop: "-8px", marginBottom: "8px", fontWeight: "bold", color: successMessage[1] }}>
                            {successMessage[0]}
                        </p>
                        <p style={{ marginTop: "-8px", marginBottom: "8px", fontWeight: "bold", color: "black" }}>
                            Trip name: {tripName}
                        </p>
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