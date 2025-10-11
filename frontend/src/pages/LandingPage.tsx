import Navbar from "../components/NavBar/Navbar";
import "./LandingPage.css";
 

export default function LandingPage(){
    return (
        <>
            <div className="page">
                
                <div className= "navbar">
                    <Navbar/>
                </div>
                <div className="main">
                    <div id="title">
                        <h1>
                            CARBON COMPASS
                        </h1> 
                        <br/>
                    </div>
                    <div id="desc">
                        <p>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book
                        </p>
                    </div>
                </div>

                <div className="cards">
                    <div>

                    </div>
                </div>



            </div>
        </>
    )
}