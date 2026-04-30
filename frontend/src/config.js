// Event configuration — single source of truth
export const EVENT = {
  name: "Nacho Blanch",
  age: 30,
  dateISO: "2026-09-05T20:30:00+02:00",
  dateLabel: "Sábado 5 · Septiembre · 2026",
  timeLabel: "20:30h",
  venueName: "Casa Madrid",
  venueAddress: "Paseo de la Castellana, 134",
  venueCity: "28046 Madrid",
  mapsUrl: "https://maps.google.com/?q=Paseo+de+la+Castellana+134+Madrid",
  metro: "Metro: Cuzco (L10)",
  heroImage:
    "https://images.unsplash.com/photo-1700940994953-45a022ccd8bf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA0MTJ8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwbWFuJTIwdHV4ZWRvJTIwbmlnaHR8ZW58MHx8fHwxNzc3NTUyODAxfDA&ixlib=rb-4.1.0&q=85",
  celebrationImage:
    "https://images.pexels.com/photos/15007573/pexels-photo-15007573.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  marbleImage:
    "https://images.pexels.com/photos/450055/pexels-photo-450055.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  dressImage:
    "https://images.unsplash.com/photo-1774543239879-8a09ab5ad616?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTF8MHwxfHNlYXJjaHwxfHxjb2NrdGFpbCUyMHBhcnR5JTIwbmlnaHQlMjBlbGVnYW50fGVufDB8fHx8MTc3NzU1Mjc4N3ww&ixlib=rb-4.1.0&q=85",
};

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;
