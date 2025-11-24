import { Window, WindowContent, WindowHeader, Button, TextInput } from "react95"
interface DefaultSaveProps {
    setSaveTripOpen: (val: boolean) => void;
    tripName: string,
    setTripName: (name: string) => void;
    isLoading: boolean;
    handleSaveTrip: (trip: string, isNew: boolean) => void;
    onCancel: () => void;
    successMessage: [string, string];
}

export default function DefaultSave({setSaveTripOpen, tripName, setTripName, isLoading, handleSaveTrip, onCancel, successMessage}: DefaultSaveProps){
    return (
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
                            onClick={() => {setSaveTripOpen(false);
                                            onCancel();
                            }}
                            style={{ position: "absolute", top: 5, right: 5 }}
                        >
                            ✕
                        </Button>
                    </WindowHeader>
                    <WindowContent>
                        <p style={{ marginTop: "-8px", fontWeight: "bold", color: successMessage[1] }}>
                            {successMessage[0]}
                        </p>
                        <p>Enter a name for your trip:</p>
                        <TextInput
                            placeholder="Trip Name"
                            value={tripName}
                            onChange={(e) => setTripName(e.target.value)}
                            fullWidth
                            autoFocus
                            style={{ marginTop: 8, marginBottom: 8 }}
                        />
                        <div style={{ display: "flex", flexDirection: "row", gap: "8px", width: "100%", marginTop: "8px" }}>
                            <Button
                                style={{ flex: 1 }}
                                onClick={() => handleSaveTrip(tripName, true)}
                                disabled={isLoading || !tripName.trim()}
                            >
                                Confirm
                            </Button>
                            <Button style={{ flex: 1}} 
                                    onClick={() => {
                                        setSaveTripOpen(false);
                                        onCancel();}}>
                                        Cancel
                                        </Button>
                        </div>
                    </WindowContent>
                </Window>
            </div>
    )
}