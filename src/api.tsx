const dbUrl: string = `http://localhost:3000`; // upewnij się, że to jest HTTP

class ApiCalls {
    headers = {
        'Content-Type': 'application/json',
    };

    // 1. Pobierz wszystkie loty
    async getFlights() {
        const res = await fetch(`${dbUrl}/flights`);
        if (!res.ok) throw new Error('Błąd przy pobieraniu lotów');
        return res.json();
    }

    // 2. Szukaj lotów
    async searchFlights(fromCity?: string, toCity?: string, date?: string) {
        const params = new URLSearchParams();
        if (fromCity) params.append('fromCity', fromCity);
        if (toCity) params.append('toCity', toCity);
        if (date) params.append('date', date);

        const res = await fetch(`${dbUrl}/flights/search?${params.toString()}`);
        if (!res.ok) throw new Error('Błąd przy wyszukiwaniu lotów');
        return res.json();
    }

    // 3. Rezerwuj lot
    async makeReservation(flightId: string, passengerName: string) {
        const body = JSON.stringify({ flightId, passengerName });
        const res = await fetch(`${dbUrl}/reservations`, {
            method: 'POST',
            headers: this.headers,
            body,
        });
        if (!res.ok) throw new Error('Błąd przy rezerwacji');
        return res.json();
    }

    // 4. Pobierz PDF z potwierdzeniem
    async getReservationPdf(reservationNumber: string) {
        const res = await fetch(`${dbUrl}/reservations/${reservationNumber}/pdf`);
        if (!res.ok) throw new Error('Nie znaleziono PDF-a');
        const blob = await res.blob();
        return URL.createObjectURL(blob); // można podpiąć np. do <a href="..." download />
    }

    // 5. Sprawdź dane rezerwacji
    async getReservation(reservationNumber: string) {
        const res = await fetch(`${dbUrl}/reservations/${reservationNumber}`);
        if (!res.ok) throw new Error('Rezerwacja nie znaleziona');
        return res.json();
    }
}

const apiCalls = new ApiCalls();
export default apiCalls;
