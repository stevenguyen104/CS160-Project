import { Button, GroupBox, TreeView} from "react95";
import type { TreeLeaf} from "react95";
interface DirectionBarProps {
    mode: boolean;   
    setMode: (value: boolean) => void 
    places: google.maps.places.PlaceResult[];
}

export default function DirectionBar({mode, setMode, places}: DirectionBarProps) {
    const adjustedPlaces: TreeLeaf<google.maps.places.PlaceResult>[] = (places || []).map((place) => {
        // const { name, ...rest } = place || {};
        return {
            // ...rest,
            id: place,
            label: place.name ?? ""
        };
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
                <TreeView tree={adjustedPlaces} />
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