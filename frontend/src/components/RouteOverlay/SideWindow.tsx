import { Button, Window, WindowContent, WindowHeader } from "react95"
import { useState } from "react";

interface SideWindowProps {
    alerts: any;
    directions: google.maps.DirectionsRoute | null;
    emissions: any;
    units: string;
}

interface Alert {
    location: string;
    AQI_display: string;
    color: [number, number, number];
    dominant_pollutant: string;
    category: string;
}

export default function SideWindow({ alerts, directions, emissions, units }: SideWindowProps) {
    const [show, setShow] = useState(true);
    const legs: google.maps.DirectionsLeg[] = directions!.legs;
    const distances: number[] = legs.map(leg => leg.distance!.value);
    const totalDistance: number = distances.reduce((a, b) => a + b, 0);
    const unit = units === "km" ? "kilograms" : "pounds";
    const totalEmissions = units === "km" ? emissions?.data.co2e_kg : emissions?.data.co2e_lb;
    const emissionsPerLeg = distances.map(d => (d / totalDistance) * totalEmissions);

    return (
        <>
            <div style={{ position: "absolute", top: 20, right: 20, zIndex: 20, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <Button onClick={() => setShow(!show)}> {show ? "Collapse" : "Expand"} </Button>
                {show && (
                    <>
                        <Window style={{ width: 350 }}>
                            <WindowHeader>
                                Alerts
                            </WindowHeader>
                            <WindowContent>
                                {alerts ? alerts.message : "Loading..."}
                                {alerts && alerts.alerts.map((alert: Alert, index: number) => {
                                    const [r, g, b] = alert.color.map(c => Math.round(c * 255));
                                    const textColor = `rgb(${r}, ${g}, ${b})`;
                                    return (
                                        <div key={`${alert} ${index}`}>
                                            <span style={{ color: "black", fontWeight:"bold" }}>{alert.location}: </span>
                                            <span style={{ color: textColor }}>
                                                {alert.category}. AQI: {alert.AQI_display}; Pollutant: {alert.dominant_pollutant}
                                            </span>
                                        </div>
                                    );
                                })}
                            </WindowContent>

                        </Window>


                        <br></br>
                        <Window style={{ width: 350 }}>
                            <WindowHeader>
                                Emissions info
                            </WindowHeader>
                            <WindowContent>
                                {
                                    emissions ? (
                                        emissions.success ? (
                                            <>
                                                {emissionsPerLeg.map((e, i) => (
                                                    <div key={`${e}-${i}`}>
                                                        {`Segment ${i + 1}: ${e.toFixed(2)} ${unit}`}
                                                    </div>
                                                ))}

                                                <div>{`Total: ${totalEmissions} ${unit}`}</div>
                                            </>
                                        ) : (
                                            emissions.error
                                        )
                                    ) : (
                                        "Loading..."
                                    )
                                }
                            </WindowContent>

                        </Window>
                    </>)
                }
            </div>

        </>
    )
}