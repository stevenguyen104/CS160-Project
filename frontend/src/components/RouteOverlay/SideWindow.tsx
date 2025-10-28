import { Button, Window, WindowContent, WindowHeader } from "react95"
import { useState } from "react";

export default function SideWindow() {
    const [show, setShow] = useState(true);

    return (
        <>
        <div style={{ position: "absolute", top: 20, right: 20, zIndex: 20 }}>
            <Button onClick={() => setShow(!show)}> le button </Button>
            <br></br>
            {show && (
                <>
                <Window>
                <WindowHeader>
                    Alerts
                </WindowHeader>
                <WindowContent>
                    hehe
                </WindowContent>

            </Window>
            
            
            <br></br>
            <Window>
                <WindowHeader>
                    Emissions info
                </WindowHeader>
                <WindowContent>
                    hehe
                </WindowContent>

            </Window>
            </>)
        }
        </div>
        
        </>
    )
}