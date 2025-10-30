import { Button, Window, WindowContent, WindowHeader } from "react95"
import { useState } from "react";

interface SideWindowProps {
    alerts: any;
    directions: any;
    emissions: any;
}

export default function SideWindow({ alerts, directions, emissions}: SideWindowProps) {
    const [show, setShow] = useState(true);

    return (
        <>
        <div style={{ position: "absolute", top: 20, right: 20, zIndex: 20 }}>
            <Button onClick={() => setShow(!show)}> le button </Button>
            <br></br>
            {show && (
                <>
                <Window>
                <WindowHeader>
                    Alerts
                </WindowHeader>
                <WindowContent>
                    {alerts ? JSON.stringify(alerts, null, 2) : "Loading..."}
                </WindowContent>

            </Window>
            
            
            <br></br>
            <Window>
                <WindowHeader>
                    Emissions info
                </WindowHeader>
                <WindowContent>
                    {emissions ? JSON.stringify(emissions, null, 2) : "Loading..."}
                </WindowContent>

            </Window>
            </>)
        }
        </div>
        
        </>
    )
}