import { AppBar, Button, Frame, Toolbar } from 'react95';
import "./Navbar.css"

export default function Navbar() {
  return (
    <AppBar>
        <Toolbar className="navToolbar">
            <div className="grouped">
                <Frame className='logo'>
                    Carbon Compass
                </Frame>
                
            </div>
            <div className="groupTwo">
                <Button>
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
