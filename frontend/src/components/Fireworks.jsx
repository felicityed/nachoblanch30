import { useEffect, useRef } from "react";

// Elegant gold fireworks — sparse, slow, champagne palette. Not tacky.
export default function Fireworks({ density = 1 }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const rocketsRef = useRef([]);
  const particlesRef = useRef([]);
  const lastFireRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const PALETTE = [
      [244, 228, 184],   // champagne
      [212, 181, 114],   // gold light
      [201, 169, 97],    // gold
      [168, 136, 64],    // gold dark
      [253, 251, 247],   // ivory
    ];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const spawnRocket = (tx, ty) => {
      const startX = canvas.width * 0.15 + Math.random() * canvas.width * 0.7;
      const startY = canvas.height + 10;
      const targetX = tx ?? Math.random() * canvas.width;
      const targetY = ty ?? Math.random() * canvas.height * 0.35 + canvas.height * 0.12;
      const angle = Math.atan2(targetY - startY, targetX - startX);
      const speed = 9 + Math.random() * 4;
      const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      rocketsRef.current.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        tx: targetX,
        ty: targetY,
        trail: [],
        color,
        alive: true,
        distLeft: Math.hypot(targetX - startX, targetY - startY),
      });
    };

    const explode = (r) => {
      const count = 70 + Math.floor(Math.random() * 40);
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = Math.random() * 5.5 + 1.2;
        const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        particlesRef.current.push({
          x: r.x, y: r.y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          r: color[0], g: color[1], b: color[2],
          life: 1,
          decay: 0.008 + Math.random() * 0.012,
          size: Math.random() * 2.2 + 0.4,
        });
      }
      // extra ring sparkle
      for (let i = 0; i < 26; i++) {
        const a = (i / 26) * Math.PI * 2;
        const sp = Math.random() * 1.8 + 0.5;
        particlesRef.current.push({
          x: r.x, y: r.y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          r: 253, g: 251, b: 247,
          life: 1,
          decay: 0.005 + Math.random() * 0.005,
          size: Math.random() * 1.1 + 0.3,
        });
      }
    };

    const loop = (t) => {
      // fade trails for smooth motion blur effect
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(10,14,39,0.18)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";

      // launch rockets periodically
      const gap = 1400 + Math.random() * 1800; // elegant pacing
      if (t - lastFireRef.current > gap / density) {
        spawnRocket();
        lastFireRef.current = t;
      }

      // update rockets
      for (let i = rocketsRef.current.length - 1; i >= 0; i--) {
        const r = rocketsRef.current[i];
        r.trail.push({ x: r.x, y: r.y, a: 1 });
        if (r.trail.length > 16) r.trail.shift();
        r.trail.forEach((p) => (p.a *= 0.8));
        r.x += r.vx;
        r.y += r.vy;
        // check reached target
        const dist = Math.hypot(r.tx - r.x, r.ty - r.y);
        if (dist < 6 || r.y < r.ty) {
          explode(r);
          rocketsRef.current.splice(i, 1);
          continue;
        }
        // draw trail
        r.trail.forEach((p) => {
          ctx.globalAlpha = p.a * 0.45;
          ctx.fillStyle = `rgb(${r.color[0]},${r.color[1]},${r.color[2]})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
        ctx.fillStyle = `rgb(${r.color[0]},${r.color[1]},${r.color[2]})`;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }

      // update particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.03;
        p.vx *= 0.992;
        p.vy *= 0.992;
        p.life -= p.decay;
        if (p.life <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = p.life;
        ctx.fillStyle = `rgb(${p.r},${p.g},${p.b})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        // glow halo
        ctx.globalAlpha = p.life * 0.25;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(loop);
    };

    // initial salvo to welcome the user
    setTimeout(() => {
      for (let i = 0; i < 4; i++) {
        setTimeout(() => spawnRocket(), i * 280);
      }
    }, 500);

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
