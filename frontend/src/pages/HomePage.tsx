import { useState, useRef, useEffect } from "react";
import { useJsApiLoader, DirectionsRenderer } from "@react-google-maps/api";
import "./HomePage.css";
import Map from "../components/Map";
import SearchPanel from "../components/SearchPanel";
import StopBar from "../components/StopBar/StopBar";
import Sidebar from "../components/SideBar/SideBar";
import CustomCursor from "../components/CustomCursor/CustomCursor";
import { Window, WindowHeader, WindowContent, Button, Frame, TextInput, Tooltip , Checkbox, Select} from "react95";
import { Awfxex32Info, Settings, Wab321016, Mute, Unmute } from "@react95/icons";
import DirectionBar from "../components/DirectionBar/DirectionBar";
import SideWindow from "../components/RouteOverlay/SideWindow";
import DefaultSave from "../components/SavePopUp/DefaultSave";
import SelectedTripSave from "../components/SavePopUp/SelectedTripSave";
import NewTripButton from "../components/NewTripButton/NewTripButton";
const libraries: ("places")[] = ["places"];

function HomePage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [savedOpen, setSavedOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [volumeOpen, setVolumeOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [saveTripOpen, setSaveTripOpen] = useState(false);
    const [vehicleInfoOpen, setVehicleInfoOpen] = useState(false);
    const [infoOpen, setInfoOpen] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState<google.maps.LatLngLiteral | null>(null);
    const [places, setPlaces] = useState<google.maps.places.PlaceResult[]>([]);
    const [searchResults, setSearchResults] = useState<google.maps.places.PlaceResult[]>([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [showConfirmRoute, setShowConfirmRoute] = useState(false);
    const [savedTrips, setSavedTrips] = useState<any[]>([]);
    const [volume, setVolume] = useState(50);
    const [muted, setMuted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [startLocation, setStartLocation] = useState<google.maps.places.PlaceResult | null>(null);

    const [focusSearch, setFocusSearch] = useState(false);
    const [searchMode, setSearchMode] = useState<"add" | "start" | "edit">("add");
    const [directionsMode, setDirectionsMode] = useState(false);
    const [editingPlace, setEditingPlace] = useState<any | null>(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userID, setUserID] = useState("");
    const [tripID, setTripID] = useState(-1);
    const [vehicle_make, setMake] = useState("");
    const [vehicle_model, setModel] = useState("");

    const [directions, setDirections] = useState<google.maps.DirectionsRoute | null>(null);
    const [alerts, setAlerts] = useState(null);
    const [emissions, setEmissions] = useState(null);

    const [tripName, setTripName] = useState("");
    const [hoveredTrip, setHoveredTrip] = useState<number | null>(null);
    const [editingTripId, setEditingTripId] = useState<number | null>(null);
    const [editTripName, setEditTripName] = useState("");
    const [confirmDeleteTrip, setConfirmDeleteTrip] = useState({ open: false, tripId: null });

    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
            audioRef.current.muted = muted;
        }
    }, [volume, muted]);

    useEffect(() => {
        console.log("tripID updated:", tripID);
    }, [tripID])

    // play on action
    useEffect(() => {
      const startAudio = () => {
        audioRef.current?.play().catch(console.log);
        window.removeEventListener("click", startAudio);
      };
      window.addEventListener("click", startAudio);
      return () => window.removeEventListener("click", startAudio);
    }, []);

    useEffect(() => {
      if (savedOpen && userID) {
        const getTrips = async () => {
          try {
            const response = await fetch("http://127.0.0.1:5000/trips/", {
              method: "GET",
              mode: "cors",
              credentials: "include",
            });
            const data = await response.json();
            if (response.ok) {
              setSavedTrips(data.trips);
            } else {
              console.error("Error getting trips:", data.error);
            }
          } catch (error) {
            console.error("Error getting trips:", error);
          }
        };
        getTrips();
      }
    }, [savedOpen, userID]);


        // Get current user logged in
        /*
        try {
            const response = await fetch("http://127.0.0.1:5000/users/", {
                method: "GET",
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({})
            });

            const data = await response.json();
            if (response.ok) {
                setUserID(data.user_id);
            }
        } catch (error) {
            console.error(error);
        }
        */

    const handleLogin = async() => {

        if (password.length < 6) {
            window.alert("Password must be at least 6 characters long.");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:5000/users/login", {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    "email": email,
                    "password": password
                }),
                credentials: "include"
            });

            const data = await response.json();
            console.log(data);

            if (response.ok) {
                setUserID(data.user_id);
                alert(data.message);
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleRegister = async () => {

        if (password.length < 6) {
            window.alert("Password must be at least 6 characters long.");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:5000/users/register", {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    "email": email,
                    "password": password
                }),
                credentials: "include",
            });

            const data = await response.json();
            console.log(data);

            if (response.ok) {
                alert(data.message);
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleLogout = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/users/logout", {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}),
                credentials: "include",
            })

            const data = await response.json();
            console.log(data);

            if (response.ok) {
                alert(data.message);
                setUserID("");
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const User = async () => {
        // pass
    }

    const handleAddTrip = async (name: string) => {
        setIsLoading(true);
        try {
            const response = await fetch("http://127.0.0.1:5000/trips/", {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
                credentials: "include"
            });

            const data = await response.json();
            console.log(data);

            if (response.ok) {
                setTripID(data.trip["trip_id"]);
                console.log(tripID);
                console.log(data.message);
                return data.trip["trip_id"];
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleAddStops = async (getTripID: number) => {
        setIsLoading(true);
        try {
            const response = await fetch("http://127.0.0.1:5000/trips/" + getTripID + "/stops/add", {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  "places": places,
                }),
                credentials: "include",
            });

            const data = await response.json();
            console.log(data);

            if (response.ok) {
                console.log(data.message);
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleDeleteStops = async (getTripID: number) => {
        setIsLoading(true);
        try {
            const response = await fetch("http://127.0.0.1:5000/trips/" + getTripID + "/stops/", {
                method: "DELETE",
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}),
                credentials: "include",
            });
            // these are prolly unnecessary
            const data = await response.json();
            console.log(data);

            if (response.ok) {
                console.log(data.message);
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleSaveTrip = async (name: string, isNew: boolean) => {
        // if (!name.trim()) return;
        // No trip selected (tripID starts at 1)
        if (tripID <= 0 || isNew) {
            console.log("here");
            const newTripID: number = await handleAddTrip(name);
            await handleAddStops(newTripID);
        } else {
            console.log("saving")
            await handleDeleteStops(tripID);
            await handleAddStops(tripID);
        }
        // save trip logic goes here
        console.log("Trip saved!");
        setSaveTripOpen(false);
    };

    const handleGetDirections = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/trips/directions/", {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    places
                }),
                credentials: "include"
            });

            const data = await response.json();
            setDirections(data);
            console.log(data);

            if (response.ok) {
                console.log(data.message);
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleGetAlerts = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/stops/alerts/", {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    places
                }),
                credentials: "include"
            });

            const data = await response.json();
            setAlerts(data);
            console.log(data);

            if (response.ok) {
                console.log(data.message);
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleGetEmissions = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/trips/emissions/", {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    "vehicle_make": "Honda",  // example
                    "vehicle_model": "Accord", 
                    "place_results": places
                }),
                credentials: "include"
            });

            const data = await response.json();
            setEmissions(data);
            console.log(data);

            if (response.ok) {
                console.log(data.message);
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleLoadTrip = async (trip_id: number) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/trips/${trip_id}/stops/`, {
              method: "GET",
              mode: "cors",
              credentials: "include",
            });
            const data = await response.json();
            console.log(data);
            if (response.ok) {
                setPlaces(data.stops);
                setSavedOpen(false);
                setTripID(trip_id);
            } else {
                console.error("Error loading stops:", data.error);
            }
        } catch (error) {
            console.error("Error loading stops:", error);
        }
    };

    const handleRenameTrip = async (trip_id: number, newName: string) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/trips/${trip_id}`, {
                method: "PUT",
                mode: "cors",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({ name: newName }),
                credentials: "include",
            });
            const data = await response.json();
            console.log(data);
            if (response.ok) {
                setSavedTrips((prev) =>
                    prev.map((t) =>
                        t.trip_id === trip_id ? { ...t, name:newName} : t
                    )
                );
                setEditingTripId(null);
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteTrip = async (trip_id: number) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/trips/${trip_id}`, {
                method: "DELETE",
                mode: "cors",
                credentials: "include",
            });
            const data = await response.json();
            console.log(data);
            if (response.ok) {
                setSavedTrips((prev) => prev.filter((t) => t.trip_id !== trip_id));
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setConfirmDeleteTrip({ open: false, tripId: null });
        }
    };

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
        onSaveTripOpen={() => setSaveTripOpen(true)}
        onVehicleInfoOpen={() => setVehicleInfoOpen(true)}
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
                {/* ADD SOME CHECKED VALUE, ONCHANGE CALL SOME FUNC */}
                <Checkbox
                    value='routeType'
                    label='Prefer fastest route'
                    onChange={() => {
                    // CALL FUNC

                    }}
                />

                <br />
                <Checkbox
                    value='blank'
                    label='blank'
                    onChange={() => {
                    // CALL FUNC

                    }}
                />
                <br />
                <Checkbox
                    value='blank'
                    label='blank'
                    onChange={() => {
                    // CALL FUNC

                    }}
                />
                <br />
                <br />
                <p>Preferred units:</p>
                {/* ADD SOME UNIT VALUE, ONCHANGE CALL SOME FUNC */}
                <Select
                    defaultValue={1}
                    options={[
                        { value: 1, label: "miles" },
                        { value: 2, label: "km" },
                    ]}
                    menuMaxHeight={160}
                    width={160}
                    onChange={() => {
                    // CALL FUNC
                        
                    }}
                />
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
            <WindowContent style={{ maxHeight: "400px", overflowY: "auto" }}>
                {savedTrips.length === 0 ? (
                    <p>No saved trips yet.</p>
                ) : (
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {savedTrips.map((trip) => (
                            <li
                                key={trip.trip_id}
                                onMouseEnter={() => setHoveredTrip(trip.trip_id)}
                                onMouseLeave={() => setHoveredTrip(null)}
                                style={{ marginBottom: "10px", position: "relative" }}
                            >
                                {editingTripId === trip.trip_id ? (
                                    <div style={{ display: "flex", gap: "6px" }}>
                                        <TextInput
                                            placeholder="Enter new name"
                                            value={editTripName}
                                            onChange={(e) => setEditTripName(e.target.value)}
                                            fullWidth
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && editTripName.trim()) {
                                                    handleRenameTrip(trip.trip_id, editTripName.trim());
                                                    setEditingTripId(null);
                                                } else if (e.key === "Escape") {
                                                    setEditingTripId(null);
                                                }
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <>
                                    <div style={{position: "relative"}}>

                                    
                                    <Button
                                        fullWidth
                                        onClick={() => handleLoadTrip(trip.trip_id)}
                                        style={{
                                            textAlign: "left",
                                            whiteSpace: "normal",
                                            height: "auto",
                                            padding: "6px",
                                        }}
                                    >
                                        <b>{trip.name ? trip.name : "Untitled Trip"}</b>
                                    </Button>
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: "50%",
                                            right: 0,
                                            transform: "translateY(-50%)",
                                            display: hoveredTrip === trip.trip_id ? "flex" : "none",
                                            
                                       }}
                                    >
                                            <Button
                                                square
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingTripId(trip.trip_id);
                                                    setEditTripName(trip.name || "");
                                                }}
                                            >
                                                ✏️
                                            </Button>
                                            <Button
                                                square
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setConfirmDeleteTrip({ open: true, tripId: trip.trip_id });
                                                }}
                                            >
                                                ✕
                                            </Button>
                                        
                                    </div>
                                    </div>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </WindowContent>
            </Window>
        </div>
        )}

        {/* Confirm Delete Trip Window */}
        {confirmDeleteTrip.open && (
            <div className="overlay-backdrop" onClick={() => setConfirmDeleteTrip({ open: false, tripId: null })}>
                <Window
                    style={{ width: 350, height: 150, position: "relative" }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <WindowHeader>
                        <span>Delete Trip</span>
                        <Button
                            square
                            size="sm"
                            onClick={() => setConfirmDeleteTrip({ open: false, tripId: null })}
                            style={{ position: "absolute", top: 5, right: 5 }}
                        >
                            ✕
                        </Button>
                    </WindowHeader>
                    <WindowContent>
                        <p>Are you sure you want to delete this trip?</p>
                        <div style={{ display: "flex", flexDirection: "row", gap: "8px", width: "100%", marginTop: "15px" }}>
                            <Button
                                style={{ flex: 1 }}
                                onClick={() => handleDeleteTrip(confirmDeleteTrip.tripId!)}
                            >
                                Confirm
                            </Button>
                            <Button style={{ flex: 1}} onClick={() => setConfirmDeleteTrip({ open: false, tripId: null })}>Cancel</Button>
                        </div>
                    </WindowContent>
                </Window>
            </div>
        )}

        {/* Vehicle Info Window */}
        {vehicleInfoOpen && (
        <div className="overlay-backdrop" onClick={() => setVehicleInfoOpen(false)}>
            <Window style={{ width: 500, height: 500, position: "relative" }} onClick={(e) => e.stopPropagation()}>
            <WindowHeader>
                <span>Vehicle Info</span>
                <Button
                square
                size="sm"
                onClick={() => setVehicleInfoOpen(false)}
                style={{ position: "absolute", top: 5, right: 5 }}
                >
                ✕
                </Button>
            </WindowHeader>
            <WindowContent>
                <p>Enter your vehicle's make (brand):</p>
                <TextInput
                placeholder="Make Name"
                value={vehicle_make}
                onChange={(e) => setMake(e.target.value)}
                fullWidth
                autoFocus
                style={{ marginTop: 10, marginBottom: 20 }}
                />
                <p>Enter your vehicle's model:</p>
                <TextInput
                placeholder="Model Name"
                value={vehicle_model}
                onChange={(e) => setModel(e.target.value)}
                fullWidth
                autoFocus
                style={{ marginTop: 10, marginBottom: 20 }}
                />
                {/* PUT VEHICLE API CONFIRM HERE AND CHANGE CALL TO USE VARS*/}
                <Button
                fullWidth
                disabled={!vehicle_make.trim() || !vehicle_model.trim()}
                onClick={() => {
                    // CALL API, IF NOT FOUND, USE DEFAULTS (?)

                }}
                >
                    Confirm
                </Button>
            </WindowContent>
            </Window>
        </div>
        )}

        {/* Confirm Delete Trip Window */}
        {confirmDeleteTrip.open && (
            <div className="overlay-backdrop" onClick={() => setConfirmDeleteTrip({ open: false, tripId: null })}>
                <Window
                    style={{ width: 350, height: 150, position: "relative" }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <WindowHeader>
                        <span>Delete Trip</span>
                        <Button
                            square
                            size="sm"
                            onClick={() => setConfirmDeleteTrip({ open: false, tripId: null })}
                            style={{ position: "absolute", top: 5, right: 5 }}
                        >
                            ✕
                        </Button>
                    </WindowHeader>
                    <WindowContent>
                        <p>Are you sure you want to delete this trip?</p>
                        <div style={{ display: "flex", flexDirection: "row", gap: "8px", width: "100%", marginTop: "15px" }}>
                            <Button
                                style={{ flex: 1 }}
                                onClick={() => handleDeleteTrip(confirmDeleteTrip.tripId!)}
                            >
                                Confirm
                            </Button>
                            <Button style={{ flex: 1}} onClick={() => setConfirmDeleteTrip({ open: false, tripId: null })}>Cancel</Button>
                        </div>
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

        {/* Confirm Save Trip Window */}
        {/* check tripID if == -1 then have this code, otherwise otehr shit */}
        {saveTripOpen && (
            tripID === -1 ? (
                <DefaultSave
                    setSaveTripOpen={setSaveTripOpen}
                    tripName={tripName}
                    setTripName={setTripName}
                    isLoading={isLoading}
                    handleSaveTrip={handleSaveTrip}
                    onCancel={() => setSaveTripOpen(false)}
                >

                </DefaultSave>
            ) 
            : (
                <SelectedTripSave
                    setSaveTripOpen={setSaveTripOpen}
                    tripName={tripName}
                    setTripName={setTripName}
                    isLoading={isLoading}
                    handleSaveTrip={handleSaveTrip}>

                </SelectedTripSave>
        ))}

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
                <TextInput
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                    fullWidth />
                <TextInput
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    title="Password must be at least 6 characters"
                    fullWidth />
                <Button fullWidth onClick={handleLogin}>
                    Login
                </Button>
                <Button fullWidth onClick={handleRegister}>
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
                    <Map selectedPlace={selectedPlace} directions={directions}/>
                </Frame>

                {!directionsMode && (
                    <StopBar
                    placeLocations={places}
                    onItemsChange={(updatedItems) => setPlaces(updatedItems)}
                    onEnterClick={() => {setFocusSearch(true); }}
                    onEditPlace={(place) => {
                        console.log('editing place', place);
                        setEditingPlace(place);
                        setSearchMode("edit");
                        setFocusSearch(true);
                    }}

                    />
                )}
                

                {/* Start Route button */}
                {
                    !directionsMode && (<div className="start-route-button">
                    <Tooltip text='Start Route' style={{ zIndex: 25 }} enterDelay={100} leaveDelay={100} position="right">
                        <Button 
                            disabled = {places.length < 2 && startLocation === null}
                            style = {{
                                filter: places.length < 2 && startLocation === null ? 'grayscale(100%)' : 'none',
                                cursor: places.length < 2 && startLocation === null ? 'not-allowed' : 'pointer',
                            }}
                            onClick={() => setShowConfirmRoute(true)}
                        > 
                            <Wab321016 /> 
                        </Button>
                    </Tooltip>
                </div>)
                }
                {
                    tripID !== -1 && !directionsMode && (
                        <div className="new-trip-button">
                        <NewTripButton
                            setPlaces={setPlaces}
                            setTripID={setTripID}
                            setSaveTripOpen={setSaveTripOpen}>

                        </NewTripButton>
                        </div>
                    )
                }
                
                

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
                                        handleGetDirections();
                                        handleGetAlerts();
                                        handleGetEmissions();
                                        console.log("Route confirmed!");
                                        setShowConfirmRoute(false);
                                        setDirectionsMode(true);

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
                {directionsMode ? (
                    <DirectionBar 
                    mode={directionsMode} 
                    setMode={setDirectionsMode}
                    places={places} />
                    
                ) : (
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
                        if (searchMode === "start") {
                            setStartLocation(place);
                            setSearchMode("add");
                        }
                        else if (searchMode === "edit"){
                            setPlaces((prev) =>
                            prev.map((p) =>
                            p.place_id === editingPlace.place_id
                                ? {
                                    ...p,
                                    name: place.name,
                                    formatted_address: place.formatted_address,
                                }
                                : p
                            ));
                            setEditingPlace(null);
                            setSearchMode("add");
                        }

                        else {
                            setPlaces((prev) => [
                            ...prev,
                            place,
                            ]);
                        }
                        setSelectedPlace(location);
                        setShowSearchResults(false);
                        }
                    }}
                    searchMode={searchMode}
                    focusSearch={focusSearch}
                    setFocusSearch={setFocusSearch}
                    />
                )}
                </div>             
                {directionsMode && <SideWindow alerts={alerts} emissions={emissions} directions={directions}/>}
            </div>

        </div>
    </div>
    </>
    );
}

export default HomePage;