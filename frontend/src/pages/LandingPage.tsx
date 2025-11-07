import Navbar from "../components/NavBar/Navbar";
import TypingEffect from "../components/TypingEffect";
import "./LandingPage.css";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import CustomCursor from "../components/CustomCursor/CustomCursor";
import { Monitor, Avatar, Window, WindowHeader, WindowContent, Button, ScrollView } from "react95";

export default function LandingPage(){
const navigate = useNavigate();
const [scale, setScale] = useState(1);
const baseSize = 540;
const [showAbout, setShowAbout] = useState(false);

useEffect(() => {
    function handleResize() {
        const baseSizeAt1920 = 3;
        const vw40 = window.innerWidth * 0.4;
        const vh40 = window.innerHeight * 0.4;

        const refWidth = 768;
        const refHeight = 432;

        const scaleX = vw40 / refWidth;
        const scaleY = vh40 / refHeight;

        const scale = baseSizeAt1920 * Math.min(scaleX, scaleY);

        setScale(scale);
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
}, []);

    return (
        <>
            <CustomCursor />
            <div className="page">
                
                <div className= "navbar">
                    <Navbar onAboutClick={() => setShowAbout((prev) => !prev)} />
                </div>

                <div className="main">
                    <div className="content-wrapper">
                        <div className="monitor-scale-wrapper">
                            <div className="monitor-visual-scaler"
                            style={{
                                width: baseSize,
                                height: baseSize,
                                transformOrigin: 'top left',
                                transform: `scale(${scale})`,
                            }}
                            >
                                <Monitor>
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: '0px',
                                            left: '0px',
                                            right: '0px',
                                            bottom: '0px',
                                            backgroundImage: 'url(/Summer2.png)',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            pointerEvents: 'none',
                                            zIndex: 0,
                                        }}
                                    />
                                    <span
                                        onClick={() => navigate('/home')}
                                        style={{
                                            position: 'absolute',
                                            top: '10px',
                                            left: '10px',
                                        }}
                                    >
                                        <Avatar square size={50} style={{ backgroundColor: '#d8f8f3' }}>
                                            <span role="img">
                                                <img 
                                                    src="/Carbon Compass Logo.png" 
                                                    style={{ width: '100%', height: '100%', verticalAlign: 'middle' }} 
                                                />
                                            </span>
                                        </Avatar>
                                    </span>
                                </Monitor>
                            </div>
                        </div>

                        <Window>
                            <div className="window">
                                <TypingEffect />
                            </div>
                        </Window>

                        {showAbout && (
                            <div
                                className="overlay-backdrop"
                                onClick={() => setShowAbout(false)}
                            >
                                <Window
                                    style={{
                                        height: '30vh',
                                        width: '30vw',
                                        position: "relative",
                                        overflowY: 'auto',
                                        zIndex: 100,
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <WindowHeader>
                                        <span>About Carbon Compass</span>
                                        <Button
                                            square
                                            size="sm"
                                            style={{ position: "absolute", top: 5, right: 5 }}
                                            onClick={() => setShowAbout(false)}
                                        >
                                        ✕
                                        </Button>
                                    </WindowHeader>

                                    <WindowContent>
                                        <div style={{ padding: 10 }}>
                                            <p style={{ lineHeight: 1.5, fontSize: '14px' }}>
                                                FOR environmentally conscious travelers, commuters, and individuals WHO need a simple
                                                way to understand and reduce the environmental impact of their trips, THE Carbon
                                                Compass is an intuitive web-based trip planner THAT tracks carbon emissions, visualizes
                                                historical environmental data, and provides suggestions to encourage eco-friendly travel
                                                decisions. UNLIKE popular mapping services that mainly prioritize speed and convenience,
                                                such as Google Maps, OUR product aims to rank routes based on the estimated carbon
                                                emissions and allows for the consideration of other environmental impacts.
                                            </p>
                                        </div>
                                    </WindowContent>
                                </Window>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </>
    )
}