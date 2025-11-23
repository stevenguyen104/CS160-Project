import { Window, WindowHeader, Button, WindowContent } from 'react95'
import { Bookmark, Password1000, Logo, Mmsys101, FilePick, Progman14, Wab321016 } from "@react95/icons";

interface HelpProps {
    setInfoOpen: (val: boolean) => void
}

export default function HelpButton({ setInfoOpen }: HelpProps) {
    return (
        <div className="overlay-backdrop" onClick={() => setInfoOpen(false)}>
            <Window style={{ width: 500, height: 500, position: "relative" }} onClick={(e) => e.stopPropagation()}>
                <WindowHeader>
                    <span>Info</span>
                    <Button
                        square
                        size="sm"
                        onClick={() => setInfoOpen(false)}
                        style={{ position: "absolute", top: 5, right: 5 }}
                    >
                        ✕
                    </Button>
                </WindowHeader>
                <WindowContent style={{ padding: "16px", overflowY: "auto" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {[
                            { Icon: Logo, text: "Opens the menu to access settings and help." },
                            { Icon: Bookmark, text: "View and load your saved trips." },
                            { Icon: Progman14, text: "Save your current trip to access it later." },
                            { Icon: FilePick, text: "Enter your vehicle's make and model for accurate emissions calculations." },
                            { Icon: Mmsys101, text: "Adjust the volume or mute the background music." },
                            { Icon: Password1000, text: "Login or register an account to save trips." },
                            { Icon: Wab321016, text: "Start a route with the stops in the StopBar. Must have at least 2 stops and a vehicle make and model selected." },
                        ].map(({ Icon, text }, i) => (
                            <div
                                key={i}
                                style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: "12px"
                                }}
                            >
                                <Icon
                                    variant="32x32_4"
                                    style={{
                                        width: 32,
                                        height: 32,
                                        flexShrink: 0
                                    }}
                                />
                                <p style={{ margin: 0 }}>{text}</p>
                            </div>
                        ))}
                    </div>

                </WindowContent>
            </Window>
        </div>
    )
}