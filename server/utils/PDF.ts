import PDFDocument from 'pdfkit';

interface FlightDetails {
    fromCity: string;
    toCity: string;
    date: string; // ISO string lub sformatowana data
    time: string;
}

export const createPDFBuffer = (
    passengerName: string,
    reservationNumber: string,
    flight: FlightDetails
): Promise<Buffer> => {
    return new Promise((resolve) => {
        const doc = new PDFDocument();
        const buffers: Uint8Array[] = [];

        doc.fontSize(18).text('Potwierdzenie rezerwacji', { underline: true });
        doc.moveDown();
        doc.fontSize(12).text(`Pasazer: ${passengerName}`);
        doc.text(`Numer rezerwacji: ${reservationNumber}`);
        doc.moveDown();
        doc.text(`Miasto wylotu: ${flight.fromCity}`);
        doc.text(`Miasto przylotu: ${flight.toCity}`);
        doc.text(`Data: ${flight.date}`);
        doc.text(`Godzina: ${flight.time}`);

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            resolve(Buffer.concat(buffers));
        });

        doc.end();
    });
};
