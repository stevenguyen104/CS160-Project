import { Button, Window, WindowContent, WindowHeader } from "react95"
import { useState } from "react";

interface SideWindowProps {
    alerts: any;
    directions: google.maps.DirectionsRoute | null;
    emissions: any;
    units: string;
}

type Alert = {
    location: string;
    AQI_display: string;
}

export default function SideWindow({ alerts, directions, emissions, units}: SideWindowProps) {
    const [show, setShow] = useState(true);
    const legs: google.maps.DirectionsLeg[] = directions!.legs;
    const distances: number[] = legs.map(leg => leg.distance!.value);
    const totalDistance: number = distances.reduce((a, b) => a + b, 0);
    const unit = units === "km" ? "kilograms" : "pounds";
    const totalEmissions = units === "km" ? emissions?.data.co2e_kg : emissions?.data.co2e_lb;
    const emissionsPerLeg = distances.map(d => (d / totalDistance) * totalEmissions);

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
                        <div key={`${alert} ${index}`}>
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
                    {emissions && emissionsPerLeg.map((e, i) => (
                        <div key={`${e} ${i}}`}>
                            {`Segment ${i + 1}: ${e.toFixed(2)} ${unit}`}
                        </div>
                    ))}
                    {emissions ? `Total: ${totalEmissions} ${unit}` : "Loading..."}
                </WindowContent>

            </Window>
            </>)
        }
        </div>
        
        </>
    )
}