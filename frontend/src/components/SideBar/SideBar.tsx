import { Frame, Button } from "react95";
import { Bookmark, Password1000, Logo } from "@react95/icons";
import "./SideBar.css";

type SideBarProps = {
    onMenuToggle: () => void;
    onSavedOpen: () => void;
    onLoginOpen: () => void;
};

export default function SideBar({
    onMenuToggle,
    onSavedOpen,
    onLoginOpen,
}: SideBarProps) {
    return (
    <aside className="sidebar-react95">
        <Frame className="sidebar-panel">
            <div className="sidebar-buttons">
                <Button style={{ width: "80%" }} onClick={onMenuToggle}>
                    <Logo />
                </Button>

                <Button style={{ width: "80%" }} onClick={onSavedOpen}>
                    <Bookmark />
                </Button>

                <div className="sidebar-spacer" />

                <Button style={{ width: "80%" }} onClick={onLoginOpen}>
                    <Password1000 />
                </Button>
            </div>
        </Frame>
    </aside>
    );
}
