import { Button, GroupBox, TreeView} from "react95";
interface DirectionBarProps {
    mode: boolean;   
    places: any[];
}

export default function DirectionBar({mode, places}: DirectionBarProps) {
    const adjustedPlaces = (places || []).map((place) => {
        const { name, label, ...rest } = place || {};
        return {
            ...rest,
            label: label ?? name ?? "",
        };
    });
    const onClick = () => {
        console.log(places);
    }

    return (
        <>
        <div className="direction-bar" style={{padding: '10px', width: mode ? '300px' : '0px', height: '100%', overflowY: 'auto', transition: 'width 0.3s ease-in-out', boxSizing: 'border-box', backgroundColor: '#c3c7cb'}}>
            <Button onClick={onClick}>
                Expand all  
            </Button>

            <GroupBox>
                <TreeView tree={adjustedPlaces} />
                {/* {places.map((place, index) => (
                    <div key={index} style={{marginBottom: '10px'}}>
                        <strong>Step {index + 1}:</strong> {place.name} - {place.address}
                    </div>
                ))} */}
            </GroupBox>

        </div>
        </>
    )
}