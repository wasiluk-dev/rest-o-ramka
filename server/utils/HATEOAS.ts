function buildSearchHref(params: Record<string,string>) {
    const entries = Object.entries(params)
        .filter(([, v]) => v)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
    return entries.length
        ? `/flights/search?${entries.join('&')}`
        : '/flights/search';
}

export const createFlightLinks = (
    flight: any,
    contextParams?: { fromCity?: string; toCity?: string; date?: string }
) => ({
    self:   { href: `/flights/${flight._id}` },
    book:   { href: `/reservations`, method: 'POST' },
    search: { href: buildSearchHref(contextParams ?? {}) }
});


export const createReservationLinks = (reservation: any) => ({
    self: { href: `/reservations/${reservation._id}` },
    confirmation: { href: `/reservations/${reservation._id}/pdf` },
    flight: { href: `/flights/${reservation.flight}` }
});
