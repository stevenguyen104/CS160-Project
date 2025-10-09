import { useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import "./HomePage.css";
import Map from "../components/Map";
import SearchPanel from "../components/SearchPanel";
import StopBar from "../components/StopBar/StopBar";

const libraries: ("places")[] = ["places"];

function HomePage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [savedOpen, setSavedOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState<google.maps.LatLngLiteral | null>(null);
    const [places, setPlaces] = useState<any[]>([]);

    // Load Google Maps API once
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
        libraries,
    });


    if (!isLoaded) return <div>Loading Map...</div>;

    return (
    <div className="app-container">
        {/* First Column */}
        {/* Sidebar */}
        <div className="sidebar">
            <button className="icon-button" onClick={() => setMenuOpen((prev) => !prev)}>
                Menu
            </button>
            <button className="icon-button" onClick={() => setSavedOpen(true)}>
                Saved
            </button>
            <div className="spacer" />
            <button className="icon-button" onClick={() => setLoginOpen(true)}>
                Login
            </button>
        </div>

        {/* Menu Overlay */}
        {menuOpen && (
            <div className="sidebar-overlay">
                <button className="close-button" onClick={() => setMenuOpen(false)}>
                    X
                </button>
                <div className="sidebar-overlay-buttons">
                    <button className="icon-button">Preferences</button>
                    <button className="icon-button">Help</button>
                </div>
            </div>
        )}

        {/* Saved Trips Overlay */}
        {savedOpen && (
            <div className="overlay-backdrop" onClick={() => setSavedOpen(false)}>
                {/* prevents closing when clicking inside */}
                <div className="saved-window" onClick={(e) => e.stopPropagation()}>
                    <button className="close-button" onClick={() => setSavedOpen(false)}>
                        X
                    </button>
                    <h2>Saved Trips</h2>
                    <p>(nothing here yet)</p>
                </div>
            </div>
        )}

        {/* Login Overlay */}
        {loginOpen && (
            <div className="overlay-backdrop" onClick={() => setLoginOpen(false)}>
                {/* prevents closing when clicking inside */}
                <div className="login-window" onClick={(e) => e.stopPropagation()}>
                    <button className="close-button" onClick={() => setLoginOpen(false)}>
                        X
                    </button>
                    <h2>Login</h2>
                    <form className="login-form">
                        <input type="text" placeholder="Username" />
                        <input type="password" placeholder="Password" />
                        <button type="submit" className="login-button">Login</button>
                    </form>
                    <button className="register-button">
                        Register Account
                    </button>
                </div>
            </div>
        )}

        {/* Second Column */}
        {/* Search/Alerts Panel */}
        <SearchPanel
            google={window.google}
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
                    }
                    setPlaces(prev => [...prev, placeText]);
                }
            }}
        />


        {/* Third Column */}
        {/* Stops, Map, Directions, Emissions Column */}
        <div className="main-column">
            {/* <div className="stops">
                Stops


            </div> */}
            <StopBar 
                placeLocations={places}
                onItemsChange={(updatedItems) => setPlaces(updatedItems)}
            />
            <div className="map-section">
            <div className="map">
                <Map selectedPlace={selectedPlace} />
            </div>
            <div className="directions">Directions</div>
            </div>
            <div className="emissions-info">Emissions Info</div>
        </div>
    </div>
    );
}

export default HomePage;