import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api"

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const center = {
  lat: 40.7128,
  lng: -74.006,
};

export default function Map(){

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;
    return (
        <>

            <LoadScript googleMapsApiKey={apiKey}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={12}>
                        <Marker position={center} />
                    </GoogleMap>
            </LoadScript>
        </>
    )
}