# PRD — Nacho Blanch · 30 Cumpleaños Landing

## Original Problem Statement
Elegant RSVP landing page for Nacho Blanch's 30th birthday. Spanish. Midnight blue + gold, editorial serif. Must feel luxurious, not gaudy. Emphasis on transitions, parallax, reveal and scroll animations. Floating "Confirmar Asistencia" CTA must follow the user throughout the page.

## Architecture
- **Frontend**: React 19 + React Router + Tailwind + Shadcn UI + Framer Motion 12 + Lucide icons + Sonner toasts
- **Backend**: FastAPI + Motor (Mongo async) + Pydantic v2
- **DB**: MongoDB (collection `rsvps`)
- **Auth**: Shared admin password (`ADMIN_PASSWORD` env var) sent via `X-Admin-Token` header

## Event Data (single source: `/app/frontend/src/config.js`)
- Nacho Blanch · 30 · Sábado 5 Septiembre 2026 · 20:30h · Casa Madrid (Paseo de la Castellana, 134)

## Implemented (Dec 2025 / MVP)
- [x] Hero with parallax tuxedo image, giant gold "30", animated pills, live countdown (ddhhmmss)
- [x] Subtle drifting light-orb background (replaces tacky fireworks/confetti)
- [x] Grain overlay, gold hairlines, Cormorant Garamond + Outfit
- [x] Parallax word banners between sections (Celebra · Treinta · Madrid · Confirma)
- [x] About / Celebración with 3 cards (Cocktails / Música / Photocall) using Lucide icons
- [x] Venue with dark-themed embedded Google Map + address + metro + maps link
- [x] Dress code (Caballeros / Damas)
- [x] Atomic RSVP — yes/no branching, plus-one toggle, dietary select, song, message
- [x] Success states
- [x] Floating gold pill CTA (appears after 40vh scroll, hides when RSVP in view)
- [x] Admin `/admin` route — password gate, stats cards (total / coming / declined / headcount), shadcn Table, delete action, logout
- [x] Sonner toasts in dark theme
- [x] All interactive elements have `data-testid`
- [x] Mobile responsive

## Endpoints
- `GET /api/` — health
- `POST /api/rsvp` — create RSVP (public)
- `POST /api/admin/login` — {password} → {token}
- `GET /api/admin/rsvps` — returns {items, stats} (requires `X-Admin-Token`)
- `DELETE /api/admin/rsvps/{id}` — delete (requires `X-Admin-Token`)

## Test Results
- Backend: 13/13 ✅ · Frontend: all flows ✅ (iteration 1)

## Prioritized Backlog
- **P1** Email notifications (Resend/SendGrid) to host when someone confirms
- **P1** Upload real host photo (user will provide) → replace hero image
- **P2** Export RSVPs to CSV from admin
- **P2** Share card (OG image with name + date + venue) for WhatsApp/IG
- **P2** Optional ambient music toggle (muted by default)
- **P3** QR code that deep-links to RSVP section (for physical save-the-date)
- **P3** Calendar invite (.ics download) in success screen
