import React from "react";
import Header from "../components/Header/Header.tsx";

const NotFound:React.FC = () => {
    return (
        <>
            <Header/>
            <h1>404</h1>
            <h2>Nie znaleziono strony!</h2>
        </>
    );
};

export default NotFound;