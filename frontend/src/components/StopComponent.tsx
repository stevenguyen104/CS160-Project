interface StopDetails{
    name: string;
    address: string;
}

export default function StopComponent({name, address}: StopDetails){
    return (
        <>
            <div>
                <p>
                    {name}
                </p>
                <p>
                    {address}
                </p>

            </div>
        </>
    )
}