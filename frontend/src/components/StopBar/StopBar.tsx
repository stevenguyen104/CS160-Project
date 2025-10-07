interface Places{
    placeLocations: any[];
}

export default function StopBar({placeLocations}: Places){
    return(
        <>
            <div>
                Stops
                {placeLocations.map((place, index) => (
                    <p key={index}>
                        {place.name}
                    </p>
                ))}
            </div>
        </>
    )
}