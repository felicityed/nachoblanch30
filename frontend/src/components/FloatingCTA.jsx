import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function FloatingCTA({ targetId = "rsvp", hidden = false }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // show CTA once the user has scrolled ~40vh from the top
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.4);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <AnimatePresence>
      {visible && !hidden && (
        <div className="fixed z-50 left-0 right-0 bottom-5 sm:bottom-8 flex justify-center pointer-events-none">
          <motion.a
            data-testid="floating-cta"
            href={`#${targetId}`}
            onClick={handleClick}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="group relative inline-flex items-center gap-3 px-7 sm:px-10 py-4 sm:py-[18px] rounded-full font-sans-body font-medium text-[11px] sm:text-[12px] tracking-[0.32em] uppercase pointer-events-auto"
            style={{
              color: "#0a0e27",
              background:
                "linear-gradient(135deg, #d4b572 0%, #c9a961 50%, #a88840 100%)",
              boxShadow:
                "0 10px 40px rgba(201,169,97,0.35), 0 0 0 1px rgba(201,169,97,0.5), inset 0 1px 0 rgba(255,255,255,0.35)",
            }}
          >
            {/* shimmer */}
            <span
              aria-hidden
              className="absolute inset-0 rounded-full overflow-hidden"
              style={{ WebkitMaskImage: "linear-gradient(#000,#000)" }}
            >
              <span
                className="absolute inset-0 opacity-60 group-hover:opacity-100 transition-opacity"
                style={{
                  background:
                    "linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.45) 50%, transparent 60%)",
                  transform: "translateX(-100%)",
                  animation: "cta-shimmer 3.2s ease-in-out infinite",
                }}
              />
            </span>
            <span className="relative">Confirmar Asistencia</span>
            <span
              className="relative w-2 h-2 rounded-full"
              style={{ background: "#0a0e27" }}
            />
          </motion.a>
          <style>{`
            @keyframes cta-shimmer {
              0% { transform: translateX(-100%); }
              60%,100% { transform: translateX(200%); }
            }
          `}</style>
        </div>
      )}
    </AnimatePresence>
  );
}
