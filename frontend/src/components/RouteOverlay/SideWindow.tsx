import { Button, Window, WindowContent, WindowHeader } from "react95"
import { useState } from "react";

interface SideWindowProps {
    alerts: any;
    directions: any;
    emissions: any;
}

type Alert = {
    location: string;
    AQI_display: string;
}

export default function SideWindow({ alerts, directions, emissions}: SideWindowProps) {
    const [show, setShow] = useState(true);

    return (
        <>
        <div style={{ position: "absolute", top: 20, right: 20, zIndex: 20 }}>
            <Button onClick={() => setShow(!show)}> {show ? "Collapse" : "Expand"} </Button>
            <br></br>
            {show && (
                <>
                <Window>
                <WindowHeader>
                    Alerts
                </WindowHeader>
                <WindowContent>
                    {alerts ? alerts.message : "Loading..."}
                    {alerts && alerts.alerts.map((alert: Alert, index: number) => (
                        <div key={index}>
                            {alert.location}: {alert.AQI_display}
                        </div>
                    ))}
                </WindowContent>

            </Window>
            
            
            <br></br>
            <Window>
                <WindowHeader>
                    Emissions info
                </WindowHeader>
                <WindowContent>
                    {emissions ? JSON.stringify(emissions.message, null, 2) : "Loading..."}
                </WindowContent>

            </Window>
            </>)
        }
        </div>
        
        </>
    )
}