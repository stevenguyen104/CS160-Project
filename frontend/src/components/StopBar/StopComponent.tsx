import "./StopCard.css"

interface StopDetails{
    name: string;
    address: string;
}

export default function StopComponent({name, address}: StopDetails){
    return (
        <>
            <div className="placeDiv">
                <h3 id="placeName">
                    {name}
                </h3>

            </div>
        </>
    )
}