import {Window, WindowHeader, Button, WindowContent} from 'react95'
import { Bookmark, Password1000, Logo, Mmsys101, FilePick, Progman14, Wab321016 } from "@react95/icons";

interface HelpProps{
    setInfoOpen: (val: boolean) => void
}

export default function HelpButton({setInfoOpen}: HelpProps) {
    return(
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
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <Logo variant="32x32_4" style={{ fontSize: "32px" }}/>
                        <p style={{ margin: 0 }}>Opens the menu to access settings and help.</p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <Bookmark style={{ fontSize: "32px" }}/>
                        <p style={{ margin: 0 }}>View and load your saved trips.</p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <Progman14 style={{ fontSize: "32px" }}/>
                        <p style={{ margin: 0 }}>Save your current trip to access it later.</p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <FilePick style={{ fontSize: "32px" }}/>
                        <p style={{ margin: 0 }}>Enter your vehicle's make and model for accurate emissions calculations.</p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <Mmsys101 style={{ fontSize: "32px" }}/>
                        <p style={{ margin: 0 }}>Adjust the volume or mute the background music.</p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <Password1000 style={{ fontSize: "32px" }}/>
                        <p style={{ margin: 0 }}>Login or register an account to save trips.</p>
                    </div>

                    <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                        <Wab321016 style={{ fontSize: "32px", flexShrink: 0 }}/>
                        <p style={{ margin: 0 }}>Start a route with the stops in the StopBar. Must have at lesat 2 stops and a vehicle make and model selected. </p>
                    </div>
                </div>
            </WindowContent>
            </Window>
        </div>
    )
}