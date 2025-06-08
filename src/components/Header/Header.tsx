import React from "react";
import {Link} from "react-router-dom";

const Header:React.FC = () =>{
    return(
        <div className="bg-primary w-100 p-2">
            <Link to="/">
                <button className="btn btn-secondary btn-block m-1">Strona główna</button>
            </Link>
            <Link to="/Flights">
                <button className="btn btn-secondary btn-block m-1">Dostępne Loty</button>
            </Link>
            <Link to="/CheckTicket">
                <button className="btn btn-secondary btn-block m-1">Sprawdź bilet</button>
            </Link>
        </div>
    )
}
export default Header;