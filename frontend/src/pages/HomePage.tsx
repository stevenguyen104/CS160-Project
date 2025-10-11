import { useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import "./HomePage.css";
import Map from "../components/Map";
import SearchPanel from "../components/SearchPanel";
import StopBar from "../components/StopBar/StopBar";
import Sidebar from "../components/SideBar/SideBar";
import { Window, WindowHeader, WindowContent, Button, Frame, TextInput } from "react95";
import { Awfxex32Info, Settings, Wab321016 } from "@react95/icons";

function HomePage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [savedOpen, setSavedOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState<google.maps.LatLngLiteral | null>(null);
    const [places, setPlaces] = useState<any[]>([]);
    const [searchResults, setSearchResults] = useState<google.maps.places.PlaceResult[]>([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [showConfirmRoute, setShowConfirmRoute] = useState(false);

    // Load Google Maps API once
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
        libraries: ["places"],
    });


    if (!isLoaded) return <div>Loading Map...</div>;

    return (
    <div className="app-container">
        {/* First Column */}
        <Sidebar
        onMenuToggle={() => setMenuOpen((prev) => !prev)}
        onSavedOpen={() => setSavedOpen(true)}
        onLoginOpen={() => setLoginOpen(true)}
        />

        {/* Menu Window */}
        {menuOpen && (
        <div className="overlay-backdrop" onClick={() => setMenuOpen(false)}>
            <Window style={{ width: 250, position: "relative" }} onClick={(e) => e.stopPropagation()}>
            <WindowHeader>
                <span>Menu</span>
                <Button
                square
                size="sm"
                onClick={() => setMenuOpen(false)}
                style={{ position: "absolute", top: 5, right: 5 }}
                >
                ✕
                </Button>
            </WindowHeader>
            <WindowContent>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Button> <Settings /> </Button>
                <Button> <Awfxex32Info /> </Button>
                </div>
            </WindowContent>
            </Window>
        </div>
        )}

        {/* Saved Trips Window */}
        {savedOpen && (
        <div className="overlay-backdrop" onClick={() => setSavedOpen(false)}>
            <Window style={{ width: 300, position: "relative" }} onClick={(e) => e.stopPropagation()}>
            <WindowHeader>
                <span>Saved Trips</span>
                <Button
                square
                size="sm"
                onClick={() => setSavedOpen(false)}
                style={{ position: "absolute", top: 5, right: 5 }}
                >
                ✕
                </Button>
            </WindowHeader>
            <WindowContent>
                <p>(nothing here yet)</p>
            </WindowContent>
            </Window>
        </div>
        )}

        {/* Login Window */}
        {loginOpen && (
        <div className="overlay-backdrop" onClick={() => setLoginOpen(false)}>
            <Window style={{ width: 320, position: "relative" }} onClick={(e) => e.stopPropagation()}>
            <WindowHeader>
                <span>Login</span>
                <Button
                square
                size="sm"
                onClick={() => setLoginOpen(false)}
                style={{ position: "absolute", top: 5, right: 5 }}
                >
                ✕
                </Button>
            </WindowHeader>
            <WindowContent>
                <form
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    marginTop: "10px",
                }}
                >
                <TextInput placeholder="Username" fullWidth />
                <TextInput placeholder="Password" type="password" fullWidth />
                <Button fullWidth>
                    Login
                </Button>
                <Button fullWidth>
                    Register Account
                </Button>
                </form>
            </WindowContent>
            </Window>
        </div>
        )}

        {/* Search, Stops, Map Column */}
        <div className="main-column">
            <div className="map-wrapper">
                <Frame
                    variant="well"
                    style={{ width: "100%", height: "100%" }}
                >
                    <Map selectedPlace={selectedPlace} />
                </Frame>

                <StopBar placeLocations={places} />

                {/* Start Route button */}
                <div className="start-route-button">
                    <Button onClick={() => setShowConfirmRoute(true)}> <Wab321016 /> </Button>
                </div>

                {/* Confirm Route Window */}
                {showConfirmRoute && (
                    <div className="overlay-backdrop" onClick={() => setShowConfirmRoute(false)}>
                        <Window
                            style={{ width: 300, height: 200, position: "relative" }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <WindowHeader>
                                <span>Confirm Route</span>
                                <Button
                                    square
                                    size="sm"
                                    onClick={() => setShowConfirmRoute(false)}
                                    style={{ position: "absolute", top: 5, right: 5 }}
                                >
                                    ✕
                                </Button>
                            </WindowHeader>
                            <WindowContent>
                                <p>Do you want to confirm this route?</p>
                                <div style={{ marginTop: "25%", display: "flex", justifyContent: "space-between", width: "100%" }}>
                                    <Button
                                        onClick={() => {
                                        // route logic goes here
                                        console.log("Route confirmed!");
                                        setShowConfirmRoute(false);
                                        }}
                                    >
                                        Confirm
                                    </Button>
                                    <Button onClick={() => setShowConfirmRoute(false)}>Cancel</Button>
                                </div>
                            </WindowContent>
                        </Window>
                    </div>
                )}

                {/* Search panel overlaid on the map */}
                <div className="search-panel-overlay">
                <SearchPanel
                    google={window.google}
                    onSearch={(results) => {
                    setSearchResults(results);
                    setShowSearchResults(true);
                    }}
                    onSelectPlace={(place) => {
                    if (place.geometry?.location) {
                        const location = {
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng(),
                        };
                        setSelectedPlace(location);
                        const placeText = {
                        name: place.name,
                        adddress: place.formatted_address,
                        };
                        setPlaces((prev) => [...prev, placeText]);
                        setShowSearchResults(false);
                    }
                    }}
                />
                </div>
            </div>
        </div>
    </div>
    );
}

export default HomePage;