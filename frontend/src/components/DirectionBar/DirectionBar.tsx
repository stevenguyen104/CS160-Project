import { Button, GroupBox, TreeView } from "react95";
import type { TreeLeaf } from "react95";

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
        const latPlace: any = (p: google.maps.places.PlaceResult) => typeof p.geometry?.location?.lat === "function" ? p.geometry?.location?.lat() : p.geometry?.location?.lat;
        const lonPlace: any = (p: google.maps.places.PlaceResult) => typeof p.geometry?.location?.lng === "function" ? p.geometry?.location?.lng() : p.geometry?.location?.lng;
        const latPoint: any = (p: google.maps.LatLng) => typeof p.lat === "function" ? p.lat() : p.lat;
        const lonPoint: any = (p: google.maps.LatLng) => typeof p.lng === "function" ? p.lng() : p.lng;

        const wpts = places
            .map(p =>
                `<wpt lat="${latPlace(p)}" lon="${lonPlace(p)}">
                    <name>${p.name}</name>
                </wpt>`
            )
            .join("\n");

        const trkpts = polylinePoints
            .map(pt => `<trkpt lat="${latPoint(pt)}" lon="${lonPoint(pt)}"></trkpt>`)
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
                items: []
            }))
        })) ?? [];

    combined.push({
        id: places[places.length - 1].name!,
        label: places[places.length - 1].name,
        items: []
    });

    const exportRoute = () => {
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
        <style>
            {`
                .direction-bar .tree-view,
                .direction-bar .tree-view * {
                    white-space: normal;
                    word-break: break-word;
                    overflow-wrap: break-word;
                }
                .direction-bar .tree-view,
                .direction-bar .tree-view * {
                    text-align: left;
                    justify-content: flex-start;
                    align-items: flex-start;
                }
            `}
        </style>
        <div className="direction-bar" style={{padding: '10px', width: mode ? '300px' : '0px', height: 'auto', overflowX: 'hidden', transition: 'width 0.3s ease-in-out', boxSizing: 'border-box', backgroundColor: '#c3c7cb'}}
        >
            <Button onClick={exportRoute}>Export Route</Button>

            <GroupBox style={{ overflowWrap: "break-word", whiteSpace: "normal" }}>
                <TreeView
                    tree={combined}
                    className="tree-view"
                />
            </GroupBox>

            <Button style={{ marginTop: '5px' }} onClick={endRoute}>
                End Route
            </Button>

        </div>
        </>
    )
}
