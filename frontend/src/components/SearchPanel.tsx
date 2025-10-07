import { useState } from "react";

interface SearchPanelProps {
    onSelectPlace?: (place: google.maps.places.PlaceResult) => void;
    google: typeof window.google;
}

export default function SearchPanel({ onSelectPlace, google }: SearchPanelProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<google.maps.places.PlaceResult[]>([]);

    const handleSearch = () => {
        if (!searchQuery.trim() || !google) return;

        const service = new google.maps.places.PlacesService(document.createElement("div"));
        const request: google.maps.places.TextSearchRequest = {
            query: searchQuery,
        };

        service.textSearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                setSearchResults(results);
            } else {
                setSearchResults([]);
            }
        });
    };

    const handleSelect = (place: google.maps.places.PlaceResult) => {
        if (onSelectPlace) onSelectPlace(place);
    };

    return (
        <div className="left-column">
            <form className="search-bar" onSubmit={(e) => {e.preventDefault(); handleSearch();}}>
                <input type="text"
                placeholder="Search for a place..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit">🔍</button>
            </form>

            <div className="search-results">
                {searchResults.length > 0 ? (
                <ul>
                    {searchResults.map((r, i) => (
                    <li key={i} onClick={() => handleSelect(r)}>
                        <strong>{r.name}</strong>
                        {r.formatted_address && (
                        <div style={{ fontSize: "0.8em", color: "#616161ff" }}>
                            {r.formatted_address}
                        </div>
                        )}
                    </li>
                    ))}
                </ul>
                ) : (
                <p style={{ color: "#888888ff" }}>No results yet</p>
                )}
            </div>

            <div className="alerts">Alerts</div>
        </div>
    );
}