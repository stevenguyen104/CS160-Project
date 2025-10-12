import { Window, WindowContent, WindowHeader } from "react95"

interface Card{
    image: string,
    name: string,
    desc: string,
}

export default function FeatureCard({image, name, desc}:Card){
    return (
        <>
        <div>
            <Window>
                <WindowHeader>
                    {name}
                </WindowHeader>
                <WindowContent>
                    <div className="img">
                        <img src={image} />
                    </div>

                    <p>
                        {desc}
                    </p>
                </WindowContent>
            </Window>


            </div>
        </>
    )

}