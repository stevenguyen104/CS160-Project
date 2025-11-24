import { GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import { useEffect, useState } from "react";
const containerStyle = {
    width: "100%",
    height: "100%"
};
const defaultCenter = {
    lat: 40.7128,
    lng: -74.006
};

interface MapProps {
    selectedPlace?: { lat: number; lng: number } | null;
    directions?: google.maps.DirectionsRoute | null;
    polylinePoints: google.maps.LatLng[] | undefined;
}

export default function Map({ selectedPlace, directions, polylinePoints }: MapProps) {
    const [center, setCenter] = useState<google.maps.LatLngLiteral>(defaultCenter);

    useEffect (() => {
        if (selectedPlace) {
            setCenter(selectedPlace);

        }
    }, [selectedPlace])

    // const center = selectedPlace || defaultCenter;

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
            options={{
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
                zoomControl: false
            }}
        >

            {/* Show directions if trip is loaded*/}
            <Polyline
                path={polylinePoints}
                options={{ strokeColor: "#1976D2", strokeOpacity: 0.8, strokeWeight: 5 }}
            > 
            </Polyline>
            {directions?.legs.map((leg, i) => (
                <Marker position={leg.start_location} label={String.fromCharCode(65 + i)}/>
            ))}
            
            {selectedPlace && <Marker position={selectedPlace} />}
            {directions?.legs && <Marker position={directions.legs[directions.legs.length - 1].end_location}/>}
        </GoogleMap>
    );
}