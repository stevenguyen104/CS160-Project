import { Button, Window, WindowContent, WindowHeader } from "react95"
import { useState } from "react";

interface SideWindowProps {
    alerts: any;
    directions: google.maps.DirectionsRoute;
    emissions: any;
    units: string;
}

type Alert = {
    location: string;
    AQI_display: string;
}

export default function SideWindow({ alerts, directions, emissions, units}: SideWindowProps) {
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
                    {emissions ? (units == "km" ? `${emissions.data.co2e_kg} kilograms` : `${emissions.data.co2e_lb} pounds`) : "Loading..."}
                </WindowContent>

            </Window>
            </>)
        }
        </div>
        
        </>
    )
}