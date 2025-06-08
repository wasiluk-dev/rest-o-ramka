import { Schema, model, Types } from 'mongoose';

const reservationSchema = new Schema({
    reservationNumber: { type: String, required: true },
    flight: { type: Types.ObjectId, ref: 'Flight', required: true },
    passengerName: { type: String, required: true },
    confirmationPdf: { type: Buffer }, // byte[] => Buffer
}, {
    timestamps: true
});

export const Reservation = model('Reservation', reservationSchema);
