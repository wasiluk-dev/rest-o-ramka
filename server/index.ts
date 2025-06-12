import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Flight } from './models/Flight';
import { Reservation } from './models/Reservation';
import bodyParser from 'body-parser';
import { createPDFBuffer } from './utils/PDF';
import { createFlightLinks, createReservationLinks } from "./utils/HATEOAS";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(`mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_IP}:27017/restoramka?authSource=admin`).then(() => {
    app.get('/flights', async (_req, res) => {
        const flights = await Flight.find();

        const result = flights.map(f => ({
            ...f.toObject(),
            _links: createFlightLinks(f)
        }));

        res.json(result);
    });

    app.post('/flights', async (req, res) => {
        const flight = new Flight(req.body);
        await flight.save();
        res.status(201).json(flight);
    });


    // 2. Wyszukiwanie lotów z dynamicznymi parametrami
    app.get('/flights/search', async (req, res) => {
        const { fromCity, toCity, date } = req.query as Record<string,string>;
        const filter: any = {};
        if (fromCity) filter.fromCity = fromCity;
        if (toCity)   filter.toCity = toCity;
        if (date)     filter.date = new Date(date);

        const flights = await Flight.find(filter);

        const result = flights.map(f => ({
            ...f.toObject(),
            _links: createFlightLinks(f, { fromCity, toCity, date })
        }));

        res.json(result);
    });

    app.get('/flights/:id', async (req, res) => {
        const flight = await Flight.findById(req.params.id);
        if (!flight) return res.status(404).json({ error: 'Not found' });

        const flightWithLinks = {
            ...flight.toObject(),
            _links: createFlightLinks(flight)
        };

        res.json(flightWithLinks);
    });

    // 3. Kupno biletu
    app.post('/reservations', async (req, res) => {
        const { flightId, passengerName } = req.body;
        const reservationNumber = `RES-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        const flight = await Flight.findById(flightId);
        if (!flight) {
            return res.status(404).json({ error: 'Flight not found' });
        }

        const pdfBuffer = await createPDFBuffer(passengerName, reservationNumber, {
            fromCity: flight.fromCity,
            toCity: flight.toCity,
            date: flight.date.toISOString().split('T')[0], // yyyy-mm-dd
            time: flight.time,
        });

        const reservation = new Reservation({
            reservationNumber,
            flight: flightId,
            passengerName,
            confirmationPdf: pdfBuffer
        });

        await reservation.save();
        res.status(201).json({
            reservationNumber,
            _links: createReservationLinks({ reservationNumber, flight: flightId })
        });
    });

    // 4. Odbiór potwierdzenia w PDF
    app.get('/reservations/:reservationNumber/pdf', async (req, res) => {
        const { reservationNumber } = req.params;
        const reservation = await Reservation.findOne({ reservationNumber });
        if (!reservation || !reservation.confirmationPdf) {
            return res.status(404).json({ error: 'Not found' });
        }

        res.set('Content-Type', 'application/pdf');
        res.send(reservation.confirmationPdf);
    });

    // 5. Sprawdzenie rezerwacji po numerze
    app.get('/reservations/:reservationNumber', async (req, res) => {
        const reservation = await Reservation.findOne({ reservationNumber: req.params.reservationNumber }).populate('flight');
        if (!reservation) {
            return res.status(404).json({ error: 'Not found' });
        }

        res.json({
            ...reservation.toObject(),
            _links: createReservationLinks(reservation)
        });
    });

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch(err => console.error(err));
