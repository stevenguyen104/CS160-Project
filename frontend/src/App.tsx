import './App.css';
import Map from './components/Map';

function App() {
    return (
    <div className="app-container">
        {/* Sidebar */}
        <div className="sidebar">
            <button className="icon-button">Menu</button>
            <button className="icon-button">Saved</button>
            <div className="spacer"/>
            <button className="icon-button">Settings</button>
        </div>

        {/* Search/Alerts Column */}
        <div className="left-column">
            <div className="search-bar">Search Bar</div>
            <div className="search-results">Search Results</div>
            <div className="alerts">Alerts</div>
        </div>

        {/* Stops, Map, Directions, Emissions Column */}
        <div className="main-column">
            <div className="stops">Stops</div>
            <div className="map-section">
                <div className="map">
                    <Map/>
                </div>
                <div className="directions">Directions</div>
            </div>
            <div className="emissions-info">Emissions Info</div>
        </div>
    </div>
    );
}

export default App;