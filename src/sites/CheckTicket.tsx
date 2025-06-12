import React, {useState} from "react";
import Header from "../components/Header/Header.tsx";
import apiCalls from "../api.tsx";

type Ticket = {
    confirmationPdf?: any,
    createdAt: string,
    flight: {
        createdAt: string;
        date: Date;
        fromCity: string;
        time: string;
        toCity: string;
        updatedAt: Date;
        _id: string
    },
    passengerName: string,
    reservationNumber: string,
    updatedAt: string,
    _id: string,
}

const CheckTicket:React.FC = () => {
    const [ticket, setTicket] = useState("")
    const [ticketInfo, setTicketInfo] = useState<Ticket>()
    const checkTicket = () => {
        if (ticket){
            apiCalls.getReservation(ticket).then((data)=> (
                setTicketInfo(data)
            ))
            console.log(ticketInfo)
        }else {
            alert("Uzupełnij pole!")
        }
    }

    return(
        <>
            <Header/>
           <div className="d-flex flex-column justify-content-center align-items-center p-4">
               <p className="fw-bold mt-2 fs-4">Wpisz swój numer biletu:</p>
               <input type="text" id="ticket" className="mb-3 form-control w-25" placeholder="XXX-YYYYYY"  onChange={(e) => setTicket(e.target.value)}/>
               <button className="btn btn-light" onClick={checkTicket}>Sprawdź szczegóły biletu</button>
               {ticketInfo ? (
                   <>
                       <b className="fs-5">Pasażer: </b>{ticketInfo.passengerName}
                       <b className="fs-5">Podróż z: </b>{ticketInfo.flight.fromCity}
                       <b className="fs-5">Podróż do: </b>{ticketInfo.flight.toCity}
                       <b className="fs-5">Data wylotu: </b>{ticketInfo.flight.date.slice(0, 10)}
                       <b className="fs-5">Godzina wylotu: </b>{ticketInfo.flight.time}
                   </>
               ) : ("")}
           </div>
        </>
    );
}

export default CheckTicket;