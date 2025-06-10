import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./sites/Home.tsx";
import Flights from "./sites/Flights.tsx";
import BuyTicket from "./sites/BuyTicket.tsx";
import CheckTicket from "./sites/CheckTicket.tsx";
import NotFound from "./sites/NotFound.tsx";
import ReservationComplete from "./sites/ReservationComplete.tsx";


function App() {

    return (

        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Flights" element={<Flights />} />
                <Route path="/BuyTicket/:id" element={<BuyTicket />} />
                <Route path="/CheckTicket" element={<CheckTicket />} />
                <Route path="/ReservationComplete" element={<ReservationComplete />} />
                <Route path="/*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
