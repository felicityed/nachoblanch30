import { useState } from "react";
import axios from "axios";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  MapPin,
  Clock,
  CalendarDays,
  UtensilsCrossed,
  Music2,
  Camera,
  Sparkles,
  ArrowRight,
  Heart,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { EVENT, API } from "../config";
import LightOrbs from "../components/LightOrbs";
import FloatingCTA from "../components/FloatingCTA";
import Countdown from "../components/Countdown";
import { Reveal, RevealX, RevealZoom } from "../components/Reveal";
import ParallaxWord from "../components/ParallaxWord";
import Fireworks from "../components/Fireworks";
import Confetti from "../components/Confetti";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Label } from "../components/ui/label";

// ---------- HERO ----------
function Hero() {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 800], [0, 180]);
  const bgScale = useTransform(scrollY, [0, 800], [1, 1.12]);
  const titleY = useTransform(scrollY, [0, 600], [0, -80]);
  const titleOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section
      className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden px-6"
      data-testid="hero-section"
    >
      {/* Animated gradient mesh background — no photo */}
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0 -z-0"
      >
        {/* base radial */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 120% 80% at 50% 40%, #181f52 0%, #0d1334 45%, #0a0e27 75%, #060823 100%)",
          }}
        />
        {/* large drifting gold orb behind the 30 */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 820,
            height: 820,
            background:
              "radial-gradient(circle, rgba(201,169,97,0.22) 0%, rgba(201,169,97,0.08) 30%, transparent 60%)",
            filter: "blur(20px)",
          }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* purple accent orb */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 520, height: 520, left: "10%", top: "10%",
            background: "radial-gradient(circle, rgba(132,92,180,0.14) 0%, transparent 65%)",
            filter: "blur(30px)",
          }}
          animate={{ x: [0, 60, -20, 0], y: [0, -30, 20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 480, height: 480, right: "8%", bottom: "12%",
            background: "radial-gradient(circle, rgba(90,120,200,0.14) 0%, transparent 65%)",
            filter: "blur(30px)",
          }}
          animate={{ x: [0, -40, 30, 0], y: [0, 30, -20, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 50% 50%, transparent 40%, rgba(10,14,39,0.55) 85%, rgba(10,14,39,1) 100%)",
          }}
        />
      </motion.div>

      <motion.div
        style={{ y: titleY, opacity: titleOpacity }}
        className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto pt-20 pb-16"
      >
        {/* Overline */}
        <motion.p
          className="eyebrow mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
        >
          Estás invitado al cumpleaños de
        </motion.p>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          className="font-serif-display italic text-[40px] sm:text-[56px] lg:text-[68px] leading-[1] tracking-tight"
          style={{ color: "var(--ivory)" }}
          data-testid="hero-name"
        >
          {EVENT.name}
        </motion.h1>

        {/* Giant 30 with decorative rings */}
        <motion.div
          className="relative my-6 sm:my-10 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
        >
          {/* rotating outer ring */}
          <motion.div
            aria-hidden
            className="absolute rounded-full"
            style={{
              width: "min(86vw, 440px)",
              height: "min(86vw, 440px)",
              border: "1px solid rgba(201,169,97,0.18)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            <span
              className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
              style={{ background: "#d4b572", boxShadow: "0 0 14px #c9a961" }}
            />
          </motion.div>
          {/* inner ring */}
          <motion.div
            aria-hidden
            className="absolute rounded-full"
            style={{
              width: "min(70vw, 360px)",
              height: "min(70vw, 360px)",
              border: "1px solid rgba(201,169,97,0.1)",
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          />
          {/* hairlines L/R */}
          <div
            className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6 sm:gap-10"
            style={{ width: "min(96vw, 720px)" }}
          >
            <div
              className="h-px flex-1"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(201,169,97,0.75), transparent)",
              }}
            />
            <div style={{ width: "min(58vw, 280px)" }} />
            <div
              className="h-px flex-1"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(201,169,97,0.75), transparent)",
              }}
            />
          </div>
          {/* The 30 — stronger contrast, pulse glow */}
          <motion.span
            className="font-serif-display relative"
            animate={{
              textShadow: [
                "0 0 60px rgba(201,169,97,0.5), 0 0 120px rgba(201,169,97,0.25)",
                "0 0 80px rgba(201,169,97,0.7), 0 0 160px rgba(201,169,97,0.35)",
                "0 0 60px rgba(201,169,97,0.5), 0 0 120px rgba(201,169,97,0.25)",
              ],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              fontSize: "clamp(170px, 32vw, 280px)",
              lineHeight: 0.85,
              background:
                "linear-gradient(180deg, #fff4c9 0%, #f4e4b8 25%, #d4b572 55%, #c9a961 80%, #a88840 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              fontWeight: 400,
              letterSpacing: "-0.03em",
              paddingTop: "0.05em",
              paddingBottom: "0.08em",
            }}
            data-testid="hero-age"
          >
            30
          </motion.span>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.75 }}
          className="font-serif-display italic text-[20px] sm:text-[26px] max-w-xl"
          style={{ color: "var(--ivory-2)" }}
        >
          Tres décadas. Una noche para recordar.
        </motion.p>

        {/* Event pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-10"
        >
          <EventPill icon={<CalendarDays size={14} />} label="Fecha" value="5 · Sep · 2026" />
          <EventPill icon={<Clock size={14} />} label="Hora" value="20:30h" />
          <EventPill icon={<MapPin size={14} />} label="Lugar" value="Casa Madrid" />
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.05 }}
          className="mt-12 sm:mt-16"
        >
          <Countdown dateISO={EVENT.dateISO} />
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.3 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="eyebrow" style={{ fontSize: 9 }}>Descubre</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-10"
          style={{ background: "linear-gradient(180deg, var(--gold), transparent)" }}
        />
      </motion.div>
    </section>
  );
}

function EventPill({ icon, label, value }) {
  return (
    <div
      className="group flex items-center gap-3 px-5 py-3 rounded-full backdrop-blur-xl transition-all hover:-translate-y-0.5"
      style={{
        background: "rgba(201,169,97,0.05)",
        border: "1px solid rgba(201,169,97,0.18)",
      }}
    >
      <span className="text-[#c9a961]">{icon}</span>
      <span className="eyebrow" style={{ fontSize: 9 }}>{label}</span>
      <span className="w-1 h-1 rounded-full bg-[#c9a961]/60" />
      <span className="text-[13px] sm:text-[14px] tracking-wide text-[var(--ivory)]">{value}</span>
    </div>
  );
}

// ---------- ABOUT ----------
function About() {
  const cards = [
    { icon: <UtensilsCrossed size={28} strokeWidth={1.2} />, label: "Bebida & Comida", value: "Mejor imposible" },
    { icon: <Music2 size={28} strokeWidth={1.2} />, label: "Música", value: "Inmejorable" },
    { icon: <Camera size={28} strokeWidth={1.2} />, label: "Recuerdos", value: "Fotógrafo & Photocall" },
  ];
  return (
    <section className="relative py-28 sm:py-40 px-6" id="celebracion">
      <div className="max-w-3xl mx-auto text-center">
        <Reveal>
          <p className="eyebrow mb-5">La Celebración</p>
          <h2 className="font-serif-display text-[34px] sm:text-[54px] leading-[1.05] tracking-tight">
            Una noche <span className="italic" style={{ color: "#d4b572" }}>íntima</span><br className="hidden sm:block" /> que no olvidaremos
          </h2>
          <div className="hairline w-16 mx-auto my-9" />
          <p className="font-sans-body text-[15px] sm:text-[17px] leading-[1.9] max-w-xl mx-auto text-[var(--ivory-2)]">
            Treinta años no se cumplen todos los días. Quiero celebrarlo contigo; con la gente que más me importa. Y lo vamos a celebrar por todo lo alto:{" "}
            <span className="font-serif-display italic text-[17px] sm:text-[21px] text-[var(--ivory)]">
              cocktails, buena música, mejor comida y la compañía inmejorable.
            </span>
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-14">
          {cards.map((c, i) => (
            <Reveal key={c.label} delay={0.1 + i * 0.12} y={30}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 250, damping: 20 }}
                className="group relative overflow-hidden rounded-xl px-6 py-10 text-center"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(201,169,97,0.03))",
                  border: "1px solid rgba(201,169,97,0.14)",
                }}
              >
                {/* top hairline */}
                <span
                  className="absolute top-0 left-6 right-6 h-px"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(201,169,97,0.7), transparent)" }}
                />
                <div className="flex justify-center mb-5 text-[#c9a961] group-hover:text-[#d4b572] transition-colors">
                  {c.icon}
                </div>
                <p className="eyebrow mb-2" style={{ fontSize: 9 }}>{c.label}</p>
                <p className="font-serif-display italic text-[22px] text-[var(--ivory)]">{c.value}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- VENUE ----------
function Venue() {
  return (
    <section className="relative py-28 sm:py-36 px-6" id="lugar">
      <div className="max-w-5xl mx-auto text-center">
        <Reveal>
          <p className="eyebrow mb-5">El Lugar</p>
          <h2 className="font-serif-display text-[34px] sm:text-[54px] leading-[1.05] tracking-tight">
            {EVENT.venueName}
          </h2>
          <div className="hairline w-16 mx-auto my-8" />
        </Reveal>

        <RevealZoom delay={0.1}>
          <div
            className="relative w-full h-[380px] sm:h-[480px] overflow-hidden rounded-xl group"
            style={{ border: "1px solid rgba(201,169,97,0.2)", boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}
          >
            <iframe
              title="Casa Madrid"
              src="https://www.google.com/maps?q=Paseo+de+la+Castellana+134+Madrid&z=15&output=embed"
              className="w-full h-full border-0 transition-all duration-700 group-hover:opacity-100"
              style={{
                filter: "invert(0.92) hue-rotate(180deg) saturate(0.6) brightness(0.95) contrast(1.05)",
                opacity: 0.85,
              }}
              loading="lazy"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, transparent 60%, rgba(10,14,39,0.75) 100%)",
              }}
            />
          </div>
        </RevealZoom>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12 max-w-3xl mx-auto">
          <RevealX dir="left" delay={0.1}>
            <div className="p-8 text-center">
              <p className="eyebrow mb-3">Dirección</p>
              <p className="font-serif-display text-[22px] text-[var(--ivory)] leading-snug">
                {EVENT.venueAddress}
                <br />
                <span className="text-[var(--ivory-2)]">{EVENT.venueCity}</span>
              </p>
            </div>
          </RevealX>
          <RevealX dir="right" delay={0.2}>
            <div className="p-8 text-center">
              <p className="eyebrow mb-3">Cómo llegar</p>
              <p className="font-sans-body text-[14px] leading-[1.9] text-[var(--ivory-2)]">
                {EVENT.metro}
                <br />
                Parking en la zona
                <br />
                <a
                  href={EVENT.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="maps-link"
                  className="inline-flex items-center gap-1 mt-2 text-[#c9a961] hover:text-[#d4b572] transition-colors border-b border-[#c9a961]/30 hover:border-[#d4b572]"
                >
                  Abrir en Maps <ArrowRight size={14} />
                </a>
              </p>
            </div>
          </RevealX>
        </div>
      </div>
    </section>
  );
}

// ---------- DRESS CODE ----------
function DressCode() {
  return (
    <section className="relative py-28 sm:py-36 px-6" id="dress-code">
      <div className="max-w-3xl mx-auto text-center">
        <Reveal>
          <p className="eyebrow mb-5">Dress Code</p>
          <h2 className="font-serif-display text-[34px] sm:text-[54px] leading-[1.05] tracking-tight">
            Elegante <span className="italic text-[#c9a961]">/</span> Cocktail
          </h2>
          <div className="hairline w-16 mx-auto my-8" />
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">
          <RevealX dir="left" delay={0.1}>
            <DressCard
              tag="Ellos"
              title="Caballeros"
              body="Traje o blazer con pantalón de vestir. Zapato de vestir."
            />
          </RevealX>
          <RevealX dir="right" delay={0.2}>
            <DressCard
              tag="Ellas"
              title="Damas"
              body="Vestido cocktail, midi o largo. Conjunto de fiesta. Tacones o sandalia elegante."
            />
          </RevealX>
        </div>

        <Reveal delay={0.3}>
          <p className="font-serif-display italic text-[17px] text-[var(--muted)] mt-10">
            La idea es sencilla: que nos veamos guapos.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function DressCard({ tag, title, body }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 250, damping: 22 }}
      className="relative overflow-hidden rounded-xl px-8 py-10"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(201,169,97,0.035))",
        border: "1px solid rgba(201,169,97,0.14)",
      }}
    >
      <span
        className="absolute top-0 left-6 right-6 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(201,169,97,0.7), transparent)" }}
      />
      <span
        className="inline-block eyebrow px-4 py-1 mb-5 rounded-full"
        style={{ border: "1px solid rgba(201,169,97,0.45)", fontSize: 9 }}
      >
        {tag}
      </span>
      <h4 className="font-serif-display text-[26px] mb-3 text-[var(--ivory)]">{title}</h4>
      <p className="font-sans-body text-[14px] leading-[1.9] text-[var(--ivory-2)]">{body}</p>
    </motion.div>
  );
}

// ---------- RSVP ----------
function RSVP() {
  const [step, setStep] = useState("choose"); // choose | yes | no | doneYes | doneNo
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    plusOne: "no", plusOneName: "", plusOneDiet: "",
    dietary: "none", song: "", message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (attendance) => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error("Necesito tu nombre y apellidos.");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${API}/rsvp`, { attendance, ...form });
      setStep(attendance === "yes" ? "doneYes" : "doneNo");
      // Scroll to success within the rsvp card
      setTimeout(() => {
        const el = document.getElementById("rsvp");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    } catch (e) {
      toast.error("Algo ha fallado al enviar. Prueba otra vez.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="rsvp"
      data-testid="rsvp-section"
      className="relative py-28 sm:py-40 px-6 scroll-mt-12"
    >
      <div className="max-w-2xl mx-auto text-center">
        <Reveal>
          <p className="eyebrow mb-5">Confirma Asistencia</p>
          <h2 className="font-serif-display text-[34px] sm:text-[54px] leading-[1.05] tracking-tight">
            ¿Vienes?
          </h2>
          <div className="hairline w-16 mx-auto my-8" />
        </Reveal>

        {step === "choose" && (
          <RevealZoom>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-md mx-auto mt-6">
              <ChoiceButton
                testid="choose-yes"
                onClick={() => setStep("yes")}
                icon={<Sparkles size={30} strokeWidth={1.1} />}
                label="¡Allí estaré!"
              />
              <ChoiceButton
                testid="choose-no"
                onClick={() => setStep("no")}
                icon={<Heart size={30} strokeWidth={1.1} />}
                label="No puedo"
              />
            </div>
          </RevealZoom>
        )}

        {step === "yes" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-left"
          >
            <FormYes
              form={form}
              update={update}
              submitting={submitting}
              onSubmit={() => submit("yes")}
              onBack={() => setStep("choose")}
            />
          </motion.div>
        )}

        {step === "no" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-left"
          >
            <FormNo
              form={form}
              update={update}
              submitting={submitting}
              onSubmit={() => submit("no")}
              onBack={() => setStep("choose")}
            />
          </motion.div>
        )}

        {step === "doneYes" && <SuccessYes />}
        {step === "doneNo" && <SuccessNo />}
      </div>
    </section>
  );
}

function ChoiceButton({ icon, label, onClick, testid }) {
  return (
    <motion.button
      data-testid={testid}
      onClick={onClick}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="group relative overflow-hidden rounded-xl px-6 py-10 flex flex-col items-center gap-4"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(201,169,97,0.04))",
        border: "1px solid rgba(201,169,97,0.2)",
      }}
    >
      <span
        className="absolute top-0 left-6 right-6 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(201,169,97,0.75), transparent)" }}
      />
      <span className="text-[#c9a961] group-hover:text-[#d4b572] transition-colors">{icon}</span>
      <span className="eyebrow" style={{ fontSize: 11, letterSpacing: "0.28em" }}>
        {label}
      </span>
    </motion.button>
  );
}

function FieldLabel({ children }) {
  return (
    <Label className="eyebrow block mb-2" style={{ fontSize: 10 }}>
      {children}
    </Label>
  );
}

function FormYes({ form, update, submitting, onSubmit, onBack }) {
  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      autoComplete="off"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <FieldLabel>Nombre</FieldLabel>
          <Input
            required
            data-testid="input-firstName"
            className="gold-field h-12 rounded-md"
            placeholder="Tu nombre"
            value={form.firstName}
            onChange={(e) => update("firstName", e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>Apellidos</FieldLabel>
          <Input
            required
            data-testid="input-lastName"
            className="gold-field h-12 rounded-md"
            placeholder="Tus apellidos"
            value={form.lastName}
            onChange={(e) => update("lastName", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <FieldLabel>Email</FieldLabel>
          <Input
            type="email"
            data-testid="input-email"
            className="gold-field h-12 rounded-md"
            placeholder="tu@email.com"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>Teléfono</FieldLabel>
          <Input
            type="tel"
            data-testid="input-phone"
            className="gold-field h-12 rounded-md"
            placeholder="+34 600 000 000"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
        </div>
      </div>

      <div>
        <FieldLabel>¿Vienes con acompañante?</FieldLabel>
        <Select value={form.plusOne} onValueChange={(v) => update("plusOne", v)}>
          <SelectTrigger data-testid="select-plusOne" className="gold-field h-12 rounded-md">
            <SelectValue placeholder="Elige una opción" />
          </SelectTrigger>
          <SelectContent className="bg-[#0d1334] border-[#c9a961]/25">
            <SelectItem value="no">No, voy solo/a</SelectItem>
            <SelectItem value="yes">Sí, vengo con +1</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {form.plusOne === "yes" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-5 p-6 rounded-lg"
          style={{
            background: "rgba(201,169,97,0.03)",
            border: "1px solid rgba(201,169,97,0.12)",
          }}
        >
          <div>
            <FieldLabel>Nombre del acompañante</FieldLabel>
            <Input
              data-testid="input-plusOneName"
              className="gold-field h-12 rounded-md"
              placeholder="Nombre y apellidos"
              value={form.plusOneName}
              onChange={(e) => update("plusOneName", e.target.value)}
            />
          </div>
          <div>
            <FieldLabel>Restricciones alimentarias del +1</FieldLabel>
            <Input
              data-testid="input-plusOneDiet"
              className="gold-field h-12 rounded-md"
              placeholder="Ej: sin gluten, vegetariano…"
              value={form.plusOneDiet}
              onChange={(e) => update("plusOneDiet", e.target.value)}
            />
          </div>
        </motion.div>
      )}

      <div>
        <FieldLabel>Alergias o restricciones alimentarias</FieldLabel>
        <Select value={form.dietary} onValueChange={(v) => update("dietary", v)}>
          <SelectTrigger data-testid="select-dietary" className="gold-field h-12 rounded-md">
            <SelectValue placeholder="Elige una opción" />
          </SelectTrigger>
          <SelectContent className="bg-[#0d1334] border-[#c9a961]/25">
            <SelectItem value="none">Sin restricciones</SelectItem>
            <SelectItem value="vegetarian">Vegetariano/a</SelectItem>
            <SelectItem value="vegan">Vegano/a</SelectItem>
            <SelectItem value="gluten-free">Sin gluten</SelectItem>
            <SelectItem value="other">Otra (especificar en mensaje)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <FieldLabel>Canción que no puede faltar</FieldLabel>
        <Input
          data-testid="input-song"
          className="gold-field h-12 rounded-md"
          placeholder="Artista — Canción"
          value={form.song}
          onChange={(e) => update("song", e.target.value)}
        />
      </div>

      <div>
        <FieldLabel>¿Algo que quieras decirme?</FieldLabel>
        <Textarea
          data-testid="input-message"
          className="gold-field rounded-md min-h-[110px]"
          placeholder="Un mensaje, una broma, o lo que quieras…"
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          data-testid="btn-back"
          className="text-[11px] tracking-[0.3em] uppercase text-[var(--muted)] hover:text-[var(--ivory-2)] transition-colors"
        >
          ← Volver
        </button>
        <Button
          type="submit"
          disabled={submitting}
          data-testid="btn-submit-yes"
          className="flex-1 h-14 rounded-full font-sans-body font-medium text-[12px] tracking-[0.32em] uppercase text-[#0a0e27] hover:shadow-[0_10px_40px_rgba(201,169,97,0.4)] transition-all hover:-translate-y-0.5"
          style={{
            background: "linear-gradient(135deg, #d4b572 0%, #c9a961 50%, #a88840 100%)",
            boxShadow: "0 6px 25px rgba(201,169,97,0.28)",
          }}
        >
          {submitting ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Enviando
            </>
          ) : (
            "Confirmar Asistencia"
          )}
        </Button>
      </div>
    </form>
  );
}

function FormNo({ form, update, submitting, onSubmit, onBack }) {
  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      autoComplete="off"
    >
      <p className="font-serif-display italic text-[17px] text-[var(--muted)] text-center">
        Qué pena. Al menos déjame tu nombre para apuntarte.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <FieldLabel>Nombre</FieldLabel>
          <Input
            required
            data-testid="input-firstName-no"
            className="gold-field h-12 rounded-md"
            placeholder="Tu nombre"
            value={form.firstName}
            onChange={(e) => update("firstName", e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>Apellidos</FieldLabel>
          <Input
            required
            data-testid="input-lastName-no"
            className="gold-field h-12 rounded-md"
            placeholder="Tus apellidos"
            value={form.lastName}
            onChange={(e) => update("lastName", e.target.value)}
          />
        </div>
      </div>
      <div>
        <FieldLabel>¿Algo que quieras decirme?</FieldLabel>
        <Textarea
          data-testid="input-message-no"
          className="gold-field rounded-md min-h-[90px]"
          placeholder="Opcional"
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
        />
      </div>
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          data-testid="btn-back-no"
          className="text-[11px] tracking-[0.3em] uppercase text-[var(--muted)] hover:text-[var(--ivory-2)] transition-colors"
        >
          ← Volver
        </button>
        <Button
          type="submit"
          disabled={submitting}
          data-testid="btn-submit-no"
          variant="outline"
          className="flex-1 h-14 rounded-full border-[#c9a961]/50 hover:border-[#c9a961] bg-transparent hover:bg-[#c9a961]/10 text-[var(--ivory-2)] hover:text-[var(--ivory)] font-sans-body text-[11px] tracking-[0.32em] uppercase"
        >
          {submitting ? <Loader2 size={14} className="animate-spin" /> : "Enviar"}
        </Button>
      </div>
    </form>
  );
}

function SuccessYes() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="py-12 text-center"
      data-testid="success-yes"
    >
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
        style={{
          background: "radial-gradient(circle, rgba(201,169,97,0.25), transparent 70%)",
          border: "1px solid rgba(201,169,97,0.5)",
        }}
      >
        <Sparkles size={32} className="text-[#d4b572]" />
      </div>
      <h3 className="font-serif-display text-[36px] sm:text-[46px] mb-4">¡Confirmado!</h3>
      <p className="font-sans-body text-[16px] text-[var(--ivory-2)] leading-[1.9]">
        Nos vemos el <span className="text-[#d4b572]">5 de Septiembre</span>,<br className="hidden sm:block" />
        en Casa Madrid. Va a ser una noche increíble.
      </p>
    </motion.div>
  );
}

function SuccessNo() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="py-12 text-center"
      data-testid="success-no"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
        style={{ border: "1px solid rgba(201,169,97,0.35)" }}
      >
        <Heart size={24} className="text-[#c9a961]" />
      </div>
      <h3 className="font-serif-display text-[30px] sm:text-[36px] mb-3">Te echaremos de menos</h3>
      <p className="font-sans-body text-[15px] text-[var(--muted)] leading-[1.8]">
        Ojalá puedas estar en la próxima. Un abrazo.
      </p>
    </motion.div>
  );
}

// ---------- FOOTER ----------
function Footer() {
  return (
    <footer className="relative py-16 text-center px-6">
      <div className="hairline w-16 mx-auto mb-6" />
      <p className="eyebrow" style={{ fontSize: 10 }}>
        Nacho Blanch · 30 · Madrid MMXXVI
      </p>
    </footer>
  );
}

// ---------- PAGE ----------
export default function Landing() {
  return (
    <div className="relative grain min-h-screen">
      <LightOrbs />
      <Fireworks density={1} />
      <Confetti count={38} />
      <FloatingCTA targetId="rsvp" />
      <Hero />
      <ParallaxWord text="Celebra" speed={120} direction={1} />
      <About />
      <ParallaxWord text="Treinta" speed={150} direction={-1} />
      <Venue />
      <ParallaxWord text="Madrid" speed={120} direction={1} />
      <DressCode />
      <ParallaxWord text="Confirma" speed={150} direction={-1} />
      <RSVP />
      <Footer />
    </div>
  );
}
