import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

function diff(target) {
  const now = new Date().getTime();
  const d = Math.max(0, target - now);
  const days = Math.floor(d / (1000 * 60 * 60 * 24));
  const hours = Math.floor((d / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((d / (1000 * 60)) % 60);
  const secs = Math.floor((d / 1000) % 60);
  return { days, hours, mins, secs };
}

function Cell({ value, label }) {
  const v = String(value).padStart(2, "0");
  return (
    <div
      className="flex flex-col items-center gap-2"
      data-testid={`countdown-${label.toLowerCase()}`}
    >
      <div className="relative min-w-[64px] sm:min-w-[86px] h-[78px] sm:h-[104px] px-3 sm:px-5 rounded-md overflow-hidden flex items-center justify-center"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(201,169,97,0.04))",
          border: "1px solid rgba(201,169,97,0.18)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={v}
            initial={{ y: -26, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 26, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif-display tabular-nums"
            style={{
              fontSize: "clamp(34px, 6vw, 56px)",
              color: "#f2e6c2",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            {v}
          </motion.span>
        </AnimatePresence>
        {/* top hairline */}
        <div className="absolute left-2 right-2 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(201,169,97,0.55), transparent)" }} />
      </div>
      <span className="eyebrow" style={{ fontSize: 9, letterSpacing: "0.4em" }}>
        {label}
      </span>
    </div>
  );
}

export default function Countdown({ dateISO }) {
  const target = useMemo(() => new Date(dateISO).getTime(), [dateISO]);
  const [t, setT] = useState(diff(target));
  useEffect(() => {
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <div className="flex items-end justify-center gap-2 sm:gap-4" data-testid="countdown">
      <Cell value={t.days} label="Días" />
      <span className="pb-8 text-[#c9a961]/50 font-serif-display text-3xl">·</span>
      <Cell value={t.hours} label="Horas" />
      <span className="pb-8 text-[#c9a961]/50 font-serif-display text-3xl">·</span>
      <Cell value={t.mins} label="Minutos" />
      <span className="pb-8 text-[#c9a961]/50 font-serif-display text-3xl">·</span>
      <Cell value={t.secs} label="Segundos" />
    </div>
  );
}
