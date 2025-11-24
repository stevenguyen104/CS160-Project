import { useState, useRef, useEffect, useCallback } from "react";
import { TextInput, Button, Frame } from "react95";
import { Mshtml32528 } from "@react95/icons";

interface SearchPanelProps {
    google: typeof window.google;
    onSearch?: (results: google.maps.places.PlaceResult[]) => void;
    onSelectPlace?: (place: google.maps.places.PlaceResult) => void;
    focusSearch?: boolean;
    setFocusSearch?: (focused: boolean) => void;
}

export default function SearchPanel({ google, onSearch, onSelectPlace, focusSearch, setFocusSearch }: SearchPanelProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<google.maps.places.PlaceResult[]>([]);
    const [showResults, setShowResults] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const serviceRef = useRef<google.maps.places.PlacesService | null>(null);

    useEffect(() => {
        if (google && !serviceRef.current) {
            serviceRef.current = new google.maps.places.PlacesService(document.createElement("div"));
        }
    }, [google]);

    useEffect(() => {
        if (focusSearch && inputRef.current) {
            inputRef.current.focus();
            setFocusSearch?.(false);
        }
    }, [focusSearch, setFocusSearch]);

    const handleSearch = useCallback(() => {
        if (!searchQuery.trim() || !google) return;

        const service = new google.maps.places.PlacesService(document.createElement("div"));
        const request: google.maps.places.TextSearchRequest = { query: searchQuery };

        service.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            setSearchResults(results);
            setShowResults(true);
            onSearch?.(results);
        } else {
            setSearchResults([]);
            setShowResults(false);
            onSearch?.([]);
        }
        });
    }, [google, searchQuery, onSearch]);

    const handleSelect = (place: google.maps.places.PlaceResult) => {
        onSelectPlace?.(place);
        setShowResults(false);
    };

    // close results if clicked outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
    <div ref={containerRef} style={{ position: "absolute", top: 20, left: 20, width: 300, zIndex: 20 }}>
        {/* Search bar */}
        <Frame>
            <form
                style={{ display: "flex" }}
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch();
                }}
            >
                <TextInput
                    ref={inputRef}
                    placeholder="Search for a place..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    fullWidth
                />
                <Button type="submit">
                    <Mshtml32528 style={{ width: 16, height: 16 }} />
                </Button>
            </form>
        </Frame>

        {/* Search results overlay */}
        {showResults && searchResults.length > 0 && (
        <Frame
            style={{
                marginTop: 4,
                maxHeight: 400,
                overflowY: "auto",
                background: "white",
                width: "100%",
                padding: "6px",
            }}
        >
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {searchResults.map((r) => (
                    <li
                    key={r.place_id}
                    onClick={() => handleSelect(r)}
                    style={{
                        padding: "6px 4px",
                        borderRadius: 4,
                        cursor: "pointer",
                        transition: "background 0.2s",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = "#e0e0e0")}
                    onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                        <strong>{r.name}</strong>
                        {r.formatted_address && (
                            <div style={{ fontSize: "0.8em", color: "#555" }}>{r.formatted_address}</div>
                        )}
                    </li>
                ))}
            </ul>
        </Frame>
        )}
    </div>
    );
}