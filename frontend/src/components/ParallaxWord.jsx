import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// A large parallax word that drifts horizontally as the user scrolls
export default function ParallaxWord({ text, speed = 80, direction = 1 }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [-speed * direction, speed * direction]);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden py-12 sm:py-20 select-none z-[3]"
      aria-hidden
    >
      <motion.p
        style={{ x }}
        className="font-serif-display text-center whitespace-nowrap"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
      >
        <span
          className="block"
          style={{
            fontSize: "clamp(80px, 18vw, 220px)",
            lineHeight: 0.9,
            letterSpacing: "0.06em",
            color: "transparent",
            WebkitTextStroke: "1px rgba(201,169,97,0.45)",
            fontStyle: "italic",
            fontWeight: 300,
          }}
        >
          {text}
        </span>
      </motion.p>
    </div>
  );
}
