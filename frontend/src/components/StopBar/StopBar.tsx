import StopComponent from "./StopComponent";
import "./StopBar.css"

interface Places{
    placeLocations: any[];
}

export default function StopBar({placeLocations}: Places){
    return(
        <>
        <div className="stopbar">
            Stops 
            <div className="stopbarCards">
                <br/>
                {placeLocations.map((place, index) => (
                    <StopComponent key={index} name={place.name} address={place.adddress}/>
                ))}
            </div>
        </div>
           
        </>
    )
}