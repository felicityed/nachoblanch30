import { useMemo } from "react";

// Subtle drifting gold confetti — pure CSS, non-tacky
export default function Confetti({ count = 40 }) {
  const pieces = useMemo(() => {
    const colors = ["#d4b572", "#c9a961", "#a88840", "#f4e4b8", "#fdfbf7", "#d6c490"];
    return Array.from({ length: count }).map((_, i) => {
      const s = Math.random() * 6 + 3;
      return {
        id: i,
        size: s,
        left: Math.random() * 100,
        topOffset: -Math.random() * 30,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.35 + 0.1,
        duration: Math.random() * 14 + 12,
        delay: Math.random() * 20,
        rounded: Math.random() > 0.55,
        sway: Math.random() * 60 + 20,
      };
    });
  }, [count]);

  return (
    <div aria-hidden className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }}>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            width: p.size,
            height: p.size * 0.55,
            left: `${p.left}vw`,
            top: `${p.topOffset}vh`,
            background: p.color,
            opacity: p.opacity,
            borderRadius: p.rounded ? "50%" : "1px",
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            "--sway": `${p.sway}px`,
          }}
        />
      ))}
      <style>{`
        .confetti-piece {
          position: absolute;
          will-change: transform, opacity;
          animation: confetti-fall linear infinite;
          filter: blur(0.3px);
          box-shadow: 0 0 4px currentColor;
        }
        @keyframes confetti-fall {
          0% {
            transform: translateY(-10vh) translateX(0) rotate(0deg);
            opacity: 0;
          }
          8% { opacity: var(--o, 0.4); }
          50% {
            transform: translateY(55vh) translateX(var(--sway)) rotate(540deg);
          }
          92% { opacity: var(--o, 0.25); }
          100% {
            transform: translateY(115vh) translateX(calc(var(--sway) * -0.3)) rotate(1080deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
