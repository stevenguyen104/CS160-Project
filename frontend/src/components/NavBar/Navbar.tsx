import { AppBar, Button, Toolbar } from 'react95';
import "./Navbar.css"

type NavbarProps = {
  onAboutClick?: () => void;
};

export default function Navbar({ onAboutClick }: NavbarProps) {
  return (
    <AppBar>
        <Toolbar className="navToolbar">
            <div className="grouped">

            </div>
            <div className="groupTwo">
                <Button onClick={onAboutClick}>
                    About
                </Button>
                <Button>
                    Login
                </Button>
            </div>
        </Toolbar>
    </AppBar>

  );
}
