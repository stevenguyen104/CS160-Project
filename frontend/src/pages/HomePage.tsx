import { useState, useRef, useEffect } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import "./HomePage.css";
import Map from "../components/Map";
import SearchPanel from "../components/SearchPanel";
import StopBar from "../components/StopBar/StopBar";
import Sidebar from "../components/SideBar/SideBar";
import CustomCursor from "../components/CustomCursor/CustomCursor";
import { Window, WindowHeader, WindowContent, Button, Frame, TextInput, Tooltip } from "react95";
import { Awfxex32Info, Settings, Wab321016, Mute, Unmute } from "@react95/icons";
const libraries: ("places")[] = ["places"];

function HomePage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [savedOpen, setSavedOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [volumeOpen, setVolumeOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [infoOpen, setInfoOpen] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState<google.maps.LatLngLiteral | null>(null);
    const [places, setPlaces] = useState<any[]>([]);
    const [searchResults, setSearchResults] = useState<google.maps.places.PlaceResult[]>([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [showConfirmRoute, setShowConfirmRoute] = useState(false);
    const [volume, setVolume] = useState(50);
    const [muted, setMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
            audioRef.current.muted = muted;
        }
    }, [volume, muted]);

    // play on action
    useEffect(() => {
        const startAudio = () => {
            audioRef.current?.play().catch(console.log);
            window.removeEventListener("click", startAudio);
        };

        window.addEventListener("click", startAudio);
        return () => window.removeEventListener("click", startAudio);
    }, []);

    // Load Google Maps API once
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
        libraries,
    });


    if (!isLoaded) return <div>Loading Map...</div>;

    return (
    <>

    <CustomCursor />

    <audio ref={audioRef} src="/soundtrack.mp3" autoPlay loop />

    <div className="animated-bg" >
        <div className="bg-layer" />
        <div className="bg-layer mirrored" />
        <div className="bg-layer" />
        <div className="bg-layer mirrored" />
    </div>

    <div className="app-container">
        {/* First Column */}
        <Sidebar
        onMenuToggle={() => setMenuOpen((prev) => !prev)}
        onSavedOpen={() => setSavedOpen(true)}
        onLoginOpen={() => setLoginOpen(true)}
        onVolumeOpen={() => setVolumeOpen(true)}
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
                <div style={{ alignItems: "center", display: "flex", flexDirection: "column", gap: 10 }}>
                <Tooltip text='Settings' style={{ zIndex: 20 }} enterDelay={100} leaveDelay={100} position="right">
                    <Button style={{ width: 150 }} onClick={() => setSettingsOpen(true)}>
                        <Settings />
                    </Button>
                </Tooltip>

                <Tooltip text='Help' style={{ zIndex: 20 }} enterDelay={100} leaveDelay={100} position="right">
                    <Button style={{ width: 150 }} onClick={() => setInfoOpen(true)}>
                        <Awfxex32Info />
                    </Button>
                </Tooltip>
                </div>
            </WindowContent>
            </Window>
        </div>
        )}

        {/* Settings Window */}
        {settingsOpen && (
        <div className="overlay-backdrop" onClick={() => setSettingsOpen(false)}>
            <Window style={{ width: 500, height: 500, position: "relative" }} onClick={(e) => e.stopPropagation()}>
            <WindowHeader>
                <span>Settings</span>
                <Button
                square
                size="sm"
                onClick={() => setSettingsOpen(false)}
                style={{ position: "absolute", top: 5, right: 5 }}
                >
                ✕
                </Button>
            </WindowHeader>
            <WindowContent>
                {/* todo */}
            </WindowContent>
            </Window>
        </div>
        )}

        {/* Info Window */}
        {infoOpen && (
        <div className="overlay-backdrop" onClick={() => setInfoOpen(false)}>
            <Window style={{ width: 500, height: 500, position: "relative" }} onClick={(e) => e.stopPropagation()}>
            <WindowHeader>
                <span>Info</span>
                <Button
                square
                size="sm"
                onClick={() => setInfoOpen(false)}
                style={{ position: "absolute", top: 5, right: 5 }}
                >
                ✕
                </Button>
            </WindowHeader>
            <WindowContent>
                {/* todo */}
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

        {/* Volume Window */}
        {volumeOpen && (
            <div className="overlay-backdrop" onClick={() => setVolumeOpen(false)}>
                <Window
                    style={{ width: 400, position: "relative" }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <WindowHeader>
                        <span>Volume</span>
                        <Button
                            square
                            size="sm"
                            onClick={() => setVolumeOpen(false)}
                            style={{ position: "absolute", top: 5, right: 5 }}
                        >
                            ✕
                        </Button>
                    </WindowHeader>
                    <WindowContent style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Button onClick={() => setMuted(prev => !prev)}>
                            {muted ? <Mute /> : <Unmute />}
                        </Button>
                        <input
                            type="range"
                            min={0}
                            max={100}
                            value={muted ? 0 : volume}
                            onChange={(e) => setVolume(Number(e.target.value))}
                            onMouseDown={() => window.dispatchEvent(new Event("slider-drag-start"))}
                            onMouseUp={() => window.dispatchEvent(new Event("slider-drag-end"))}
                            style={{ flex: 1 }}
                            className="volume-slider"
                        />
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

                <StopBar 
                    placeLocations={places}
                    onItemsChange={(updatedItems) => setPlaces(updatedItems)}
                />

                {/* Start Route button */}
                <div className="start-route-button">
                    <Tooltip text='Start Route' style={{ zIndex: 20 }} enterDelay={100} leaveDelay={100} position="right">
                        <Button onClick={() => setShowConfirmRoute(true)}> <Wab321016 /> </Button>
                    </Tooltip>
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
                        setPlaces((prev) => [
                            ...prev, 
                            {
                                id: Date.now() + Math.random(), // unique id
                                name: place.name,
                                adddress: place.formatted_address, // fixed typo
                            }
                        ]);                        
                        setShowSearchResults(false);
                    }
                    }}
                />
                </div>
            </div>
        </div>
    </div>
    </>
    );
}

export default HomePage;