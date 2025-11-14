import { Button, GroupBox, TreeView} from "react95";
import type { TreeLeaf} from "react95";
interface DirectionBarProps {
    mode: boolean;   
    setMode: (value: boolean) => void 
    places: google.maps.places.PlaceResult[];
    directions: google.maps.DirectionsRoute | null;
}

export default function DirectionBar({mode, setMode, places, directions}: DirectionBarProps) {

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
        // FUTURE EXPORT ROUTE TO .WHATEVER FILE
        console.log(places);
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