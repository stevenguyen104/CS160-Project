import { Frame, Button, Tooltip } from "react95";
import { Bookmark, Password1000, Logo, Mmsys101, FilePick, Progman14 } from "@react95/icons";
import "./SideBar.css";

type SideBarProps = {
    onMenuToggle: () => void;
    onSavedOpen: () => void;
    onLoginOpen: () => void;
    onVolumeOpen: () => void;
    onSaveTripOpen: () => void;
    onVehicleInfoOpen: () => void;
};

export default function SideBar({
    onMenuToggle,
    onSavedOpen,
    onLoginOpen,
    onVolumeOpen,
    onSaveTripOpen,
    onVehicleInfoOpen,
}: SideBarProps) {
    return (
    <aside className="sidebar-react95">
        <Frame className="sidebar-panel">
            <div className="sidebar-buttons">
                <Tooltip text='Menu‍' style={{ zIndex: 25 }} enterDelay={100} leaveDelay={100} position="right">
                    <Button style={{ width: "100%" }} onClick={onMenuToggle}>
                        <Logo variant="32x32_4"/>
                    </Button>
                </Tooltip>

                <Tooltip text='Saved' style={{ zIndex: 25 }} enterDelay={100} leaveDelay={100} position="right">
                    <Button style={{ width: "100%" }} onClick={onSavedOpen}>
                        <Bookmark />
                    </Button>
                </Tooltip>

                <div className="sidebar-spacer" />

                <Tooltip text='Save Trip' style={{ zIndex: 25 }} enterDelay={100} leaveDelay={100} position="right">
                    <Button style={{ width: "100%" }} onClick={onSaveTripOpen}>
                        <Progman14 />
                    </Button>
                </Tooltip>

                <Tooltip text='Make and Model' style={{ zIndex: 25 }} enterDelay={100} leaveDelay={100} position="right">
                    <Button style={{ width: "100%" }} onClick={onVehicleInfoOpen}>
                        <FilePick />
                    </Button>
                </Tooltip>

                <Tooltip text='Volume' style={{ zIndex: 25 }} enterDelay={100} leaveDelay={100} position="right">
                    <Button style={{ width: "100%" }} onClick={onVolumeOpen}>
                        <Mmsys101 />
                    </Button>
                </Tooltip>

                <Tooltip text='Login' style={{ zIndex: 25 }} enterDelay={100} leaveDelay={100} position="right">
                    <Button style={{ width: "100%" }} onClick={onLoginOpen}>
                        <Password1000 />
                    </Button>
                </Tooltip>
            </div>
        </Frame>
    </aside>
    );
}
