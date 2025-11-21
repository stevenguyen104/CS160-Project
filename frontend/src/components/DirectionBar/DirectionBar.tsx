import { Button, GroupBox, TreeView} from "react95";
import type { TreeLeaf} from "react95";
interface DirectionBarProps {
    mode: boolean;   
    setMode: (value: boolean) => void 
    places: google.maps.places.PlaceResult[];
    directions: google.maps.DirectionsRoute | null
    polylinePoints?: google.maps.LatLng[];
}

export default function DirectionBar({mode, setMode, places, directions, polylinePoints}: DirectionBarProps) {

    // Functions to export gpx
    function buildGPX(polylinePoints: google.maps.LatLng[], places: google.maps.places.PlaceResult[]) {
        const header = `<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="route-app">`;
        const footer = `</gpx>`;

        const wpts = places
            .map(p =>
                `<wpt lat="${p.geometry?.location?.lat()}" lon="${p.geometry?.location?.lng()}">
                    <name>${p.name}</name>
                </wpt>`
            )
            .join("\n");

        const trkpts = polylinePoints
            .map(pt => `<trkpt lat="${pt.lat()}" lon="${pt.lng()}"></trkpt>`)
            .join("\n");

        const track = `
        <trk>
            <name>Route Export</name>
            <trkseg>
                ${trkpts}
            </trkseg>
        </trk>`;

        return `${header}\n${wpts}\n${track}\n${footer}`;
    }

    function downloadFile(filename: string, content: string) {
        const blob = new Blob([content], { type: "application/gpx+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    const combined: TreeLeaf<string>[] =
    directions?.legs.map((leg, i) => ({
        id: places[i].name!,       
        label: places[i].name!,  
        items: leg.steps.map(step => ({
        id: (step as any).html_instructions.replace(/<[^>]*>/g, ""),
        label: (step as any).html_instructions.replace(/<[^>]*>/g, ""),
        items: [] // steps are leaves, so empty children
        }))
    })) ?? [];

    combined.push({
        id: places[places.length - 1].name!,
    label: places[places.length - 1].name,
    items: []
    });

    const onClick = () => {
        if (!polylinePoints || polylinePoints.length === 0) {
            alert("No route available to export.");
            return;
        }

        const gpx = buildGPX(polylinePoints, places);
        downloadFile("route.gpx", gpx);
    }

    const endRoute = () => {
        setMode(false);
    }

    return (
        <>
        <div className="direction-bar" style={{padding: '10px', width: mode ? '300px' : '0px', height: '100%', overflowY: 'auto', transition: 'width 0.3s ease-in-out', boxSizing: 'border-box', backgroundColor: '#c3c7cb'}}>
            <Button onClick={onClick}>
                Export Route 
            </Button>

            <GroupBox>
                <TreeView tree={combined} />
                {/* {places.map((place, index) => (
                    <div key={index} style={{marginBottom: '10px'}}>
                        <strong>Step {index + 1}:</strong> {place.name} - {place.address}
                    </div>
                ))} */}
            </GroupBox>

            <Button style={{ marginTop: '5px' }} onClick={endRoute}>
                End Route
            </Button>

        </div>
        </>
    )
}