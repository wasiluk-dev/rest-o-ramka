import React, {useEffect, useState} from "react";
import Header from "../components/Header/Header.tsx";
import apiCalls from "../api.tsx";

const Flights:React.FC = () => {

    const [flights, setFlights] = useState([]);
    useEffect(() => {
        apiCalls.getFlights()
            .then(data => setFlights(data))
            .catch(err => console.error(err));
    }, []);

    return(
        <>
            <Header/>
            <ul>
                {flights.map((flight: any) => (
                    <li key={flight._id}>
                        {flight.fromCity} → {flight.toCity} ({flight.date})
                    </li>
                ))}
            </ul>
        </>
    );
}

export default Flights;