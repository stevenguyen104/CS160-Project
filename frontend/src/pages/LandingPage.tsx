import FeatureCard from "../components/FeatureCard";
import Navbar from "../components/NavBar/Navbar";
import "./LandingPage.css";
import placeHolder from '../../public/placeholder.png'

export default function LandingPage(){
    return (
        <>
            <div className="page">
                
                <div className= "navbar">
                    <Navbar/>
                </div>
                <div className="main">
                    <div className="window">
                        <h1>
                            Travel towards a cleaner future.
                        </h1>
                    </div>
                </div>

                <div className="cards">
                    <FeatureCard 
                        name="Card1"
                        image={placeHolder}
                        desc="Hehe"
                    />
                    <FeatureCard 
                        name="Card2"
                        image={placeHolder}
                        desc="Hehe"
                    />
                    <FeatureCard 
                        name="Card3"
                        image={placeHolder}
                        desc="Hehe"
                    />
                </div>



            </div>
        </>
    )
}