import React, {useEffect, useState} from "react";
import Header from "../components/Header/Header.tsx";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import apiCalls from "../api.tsx";

type FlightType = {
    _id: string,
    createdAt: Date,
    updatedAt: Date,
    date: Date,
    time: string,
    fromCity: string,
    toCity: string,
}

const BuyTicket:React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [name, setName] = useState("")
    const [surname, setSurname] = useState("")
    const [flights, setFlights] = useState(Array<FlightType>);
    const [foundFlight, setFoundFlight] = useState<FlightType>();
    useEffect(() => {
        apiCalls.getFlights()
            .then(data => setFlights(data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        setFoundFlight(flights.find(flight => flight._id === id))
    }, [flights]);

    const getFormData = () =>{
        console.log(name, surname)
        if (!name || !surname) {
            alert("Please fill out the form!")
        }else {
            const passenger = name+" "+surname
            if (id){
                apiCalls.makeReservation(id, passenger)
                    .then((res) => (alert("Twoj numer rezerwacji to: " +  res.reservationNumber))
                    )
                    navigate("/ReservationComplete")
            }else {
                console.error("Błędne ID lotu!")
                alert("Błędne ID lotu!")
            }
            return (
                <Navigate to="/home" />
            )
        }


    }

    return(
        <>
            <Header/>

            <div className="text-center fs-5 fw-bold">
                <h1>Zamów swój bilet na lot:</h1>
                {flights.length > 0 && (
                    foundFlight
                        ? <p>{foundFlight.fromCity} → {foundFlight.toCity}</p>
                        : <p>Nie znaleziono lotu!</p>
                )}
            </div>
            <div className="text-center d-flex justify-content-center">
                <form className="">
                    <div className="mb-3">
                        <label className="form-label">Imię</label>
                        <input type="text" className="form-control mb-3" id="name"
                               onChange={(e) => setName(e.target.value)}/>
                        <label className="form-label">Nazwisko</label>
                        <input type="text" className="form-control mb-3" id="surname"
                               onChange={(e) => setSurname(e.target.value)}/>
                    </div>
                </form>
            </div>
            <div className="text-center d-flex justify-content-center">
                <button className="btn btn-success" onClick={getFormData}>Zarezerwuj</button>
            </div>
        </>

    );
}

export default BuyTicket;