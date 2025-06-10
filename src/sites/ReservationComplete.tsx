import React from "react";
import Header from "../components/Header/Header.tsx";

const ReservationComplete:React.FC = () => {
    return (
        <>
            <Header/>
            <h1 className="text-center">

                Rezerwacja przebiegła pomyślnie!
            </h1>
        </>
    );
};
export default ReservationComplete;