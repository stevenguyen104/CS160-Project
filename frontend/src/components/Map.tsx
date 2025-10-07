import { GoogleMap, Marker } from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "75vh"
};
const defaultCenter = {
    lat: 40.7128,
    lng: -74.006
};

interface MapProps {
    selectedPlace?: { lat: number; lng: number } | null;
}

export default function Map({ selectedPlace }: MapProps) {
    const center = selectedPlace || defaultCenter;

    return (
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
            {selectedPlace && <Marker position={selectedPlace} />}
        </GoogleMap>
    );
}