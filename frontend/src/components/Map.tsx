import { GoogleMap, Marker, Polyline } from "@react-google-maps/api";

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
}

export default function Map({ selectedPlace, directions }: MapProps) {
    const center = selectedPlace || defaultCenter;

    const polylinePoints = directions ? google.maps.geometry.encoding.decodePath(
        directions.overview_polyline.points
    ) : undefined;

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
            {directions && polylinePoints && (
                <>
                    <Polyline
                        path={polylinePoints}
                        options={{ strokeColor: "#1976D2", strokeOpacity: 0.8, strokeWeight: 5 }}
                    />
                    <Marker position={directions.legs[0].start_location} label="A" />
                    <Marker position={directions.legs[directions.legs.length - 1].end_location} label="B" />
                </>
            )}
        </GoogleMap>
    );
}