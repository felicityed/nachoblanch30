import { motion } from "framer-motion";

// Four slow-drifting radial gradient orbs — extremely subtle, no confetti, no fireworks
export default function LightOrbs() {
  const orbs = [
    { size: 520, x: "-10%", y: "-5%", c: "rgba(201,169,97,0.16)", dur: 22, delay: 0 },
    { size: 640, x: "70%", y: "10%", c: "rgba(90,120,200,0.10)", dur: 26, delay: 2 },
    { size: 420, x: "20%", y: "65%", c: "rgba(201,169,97,0.09)", dur: 30, delay: 4 },
    { size: 560, x: "75%", y: "75%", c: "rgba(132,92,180,0.08)", dur: 28, delay: 1 },
  ];
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
      {/* base vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(18,26,66,0.9) 0%, rgba(10,14,39,1) 70%)",
        }}
      />
      {orbs.map((o, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: o.size,
            height: o.size,
            left: o.x,
            top: o.y,
            background: `radial-gradient(circle, ${o.c} 0%, transparent 65%)`,
            filter: "blur(40px)",
          }}
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: o.dur,
            repeat: Infinity,
            ease: "easeInOut",
            delay: o.delay,
          }}
        />
      ))}
    </div>
  );
}
