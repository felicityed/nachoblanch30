import { motion } from "framer-motion";

const eases = [0.16, 1, 0.3, 1];

export function Reveal({ children, delay = 0, y = 40, className = "", once = true }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 1, ease: eases, delay }}
    >
      {children}
    </motion.div>
  );
}

export function RevealX({ children, dir = "left", delay = 0, className = "" }) {
  const x = dir === "left" ? -60 : 60;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, rotate: dir === "left" ? -1.5 : 1.5 }}
      whileInView={{ opacity: 1, x: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, ease: eases, delay }}
    >
      {children}
    </motion.div>
  );
}

export function RevealZoom({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: eases, delay }}
    >
      {children}
    </motion.div>
  );
}
