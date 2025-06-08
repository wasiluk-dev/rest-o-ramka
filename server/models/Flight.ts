import { Schema, model } from 'mongoose';

const flightSchema = new Schema({
    fromCity: { type: String, required: true },
    toCity: { type: String, required: true },
    date: { type: Date, required: true },       // LocalDate => Date
    time: { type: String, required: true },      // LocalTime jako string (HH:mm)
}, {
    timestamps: true // opcjonalnie: createdAt / updatedAt
});

export const Flight = model('Flight', flightSchema);
