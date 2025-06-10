import React, {useEffect, useState} from "react";
import Header from "../components/Header/Header.tsx";
import apiCalls from "../api.tsx";
import {Link} from "react-router-dom";

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
            <table className="table table-striped table-dark table-bordered text-center fw-bold fs-5">
                <thead>
                <tr>
                    <th scope="col">
                        Miasto Wylotu
                    </th>
                    <th scope="col">
                        Miasto Przylotu
                    </th>
                    <th scope="col">
                        Data wylotu
                    </th>
                    <th scope="col">
                        Godzina wylotu
                    </th>
                    <th>
                        Kup Bilet
                    </th>
                </tr>
                </thead>
                <tbody>
                    {flights.map((flight: any) => (
                        <tr key={flight._id}>
                            <td>
                                {flight.fromCity}
                            </td>
                            <td>
                                {flight.toCity}
                            </td>
                            <td>
                                {flight.date.slice(0, 10)}
                            </td>
                            <td>
                                {flight.time}
                            </td>
                            <td>
                                <Link to={`/BuyTicket/${flight._id}`}>
                                    <button className="btn btn-primary fw-bold">Kub Bilet</button>
                                </Link>
                            </td>
                        </tr>

                    ))}
                </tbody>

            </table>
        </>
    );
}

export default Flights;