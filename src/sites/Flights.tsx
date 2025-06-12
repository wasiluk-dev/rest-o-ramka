import React, {useEffect, useState} from "react";
import Header from "../components/Header/Header.tsx";
import apiCalls from "../api.tsx";
import {Link} from "react-router-dom";

const Flights:React.FC = () => {

    const [flights, setFlights] = useState([]);
    const [filteredFlights, setFilteredFlights] = useState([]);
    const [fromCityFilter, setFromCityFilter] = useState('');
    const [toCityFilter, setToCityFilter] = useState('');
    const [sortByDate, setSortByDate] = useState<'asc' | 'desc' | null>(null);

    useEffect(() => {
        apiCalls.getFlights()
            .then(data => {
                setFlights(data);
                setFilteredFlights(data); // startowo bez filtrów
            })
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        let filtered = flights;

        if (fromCityFilter) {
            filtered = filtered.filter(flight => flight.fromCity.toLowerCase().includes(fromCityFilter.toLowerCase()));
        }

        if (toCityFilter) {
            filtered = filtered.filter(flight => flight.toCity.toLowerCase().includes(toCityFilter.toLowerCase()));
        }

        if (sortByDate) {
            filtered = [...filtered].sort((a, b) => {
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();
                return sortByDate === 'asc' ? dateA - dateB : dateB - dateA;
            });
        }

        setFilteredFlights(filtered);
    }, [fromCityFilter, toCityFilter, sortByDate, flights]);



    return(
        <>
            <Header/>
            <div className="d-flex fw-bold gap-3 my-3 justify-content-center">
                <input
                    type="text"
                    placeholder="Wpisz miasto wylotu"
                    value={fromCityFilter}
                    onChange={(e) => setFromCityFilter(e.target.value)}
                    className="form-control w-25"
                />
                <input
                    type="text"
                    placeholder="Wpisz miasto przylotu"
                    value={toCityFilter}
                    onChange={(e) => setToCityFilter(e.target.value)}
                    className="form-control w-25"
                />
                <button
                    className="btn btn-secondary"
                    onClick={() =>
                        setSortByDate(prev => prev === 'asc' ? 'desc' : 'asc')
                    }
                >
                    Sortuj po dacie: {sortByDate === 'asc' ? 'Rosnąco' : sortByDate === 'desc' ? 'Malejąco' : 'Brak'}
                </button>

                <button className="btn btn-danger" onClick={() => {
                    setFromCityFilter('');
                    setToCityFilter('');
                    setSortByDate(null);
                }}>
                    Resetuj filtry
                </button>
            </div>


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
                {filteredFlights.map((flight: any) => (
                    <tr key={flight._id}>
                        <td>{flight.fromCity}</td>
                        <td>{flight.toCity}</td>
                        <td>{flight.date.slice(0, 10)}</td>
                        <td>{flight.time}</td>
                        <td>
                            <Link to={`/BuyTicket/${flight._id}`}>
                                <button className="btn btn-primary fw-bold">Kup Bilet</button>
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