import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";

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
    directions?: google.maps.DirectionsResult | null;
}

export default function Map({ selectedPlace, directions }: MapProps) {
    const center = selectedPlace || defaultCenter;

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
            {selectedPlace && <Marker position={selectedPlace} />}

            {/* Show directions if trip is loaded*/}
            {directions && (
                <DirectionsRenderer options={{
                    directions,
                    preserveViewport: false,
                    polylineOptions: {
                        strokeColor: "#1E90FF",
                        strokeWeight: 5
                    }
                }}/>
                )}
        </GoogleMap>
    );
}