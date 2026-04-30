import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Lock, Users, UserCheck, UserX, Sparkles, Trash2, LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { API } from "../config";
import LightOrbs from "../components/LightOrbs";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

const TOKEN_KEY = "nacho30_admin_token";

function LoginScreen({ onAuth }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    try {
      const r = await axios.post(`${API}/admin/login`, { password });
      localStorage.setItem(TOKEN_KEY, r.data.token);
      onAuth(r.data.token);
    } catch (err) {
      toast.error("Contraseña incorrecta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative">
      <LightOrbs />
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md p-10 rounded-2xl text-center"
        style={{
          background: "linear-gradient(180deg, rgba(13,19,52,0.85), rgba(10,14,39,0.9))",
          border: "1px solid rgba(201,169,97,0.2)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
        }}
      >
        <div
          className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-6 mx-auto"
          style={{
            background: "radial-gradient(circle, rgba(201,169,97,0.2), transparent 70%)",
            border: "1px solid rgba(201,169,97,0.4)",
          }}
        >
          <Lock size={20} className="text-[#d4b572]" />
        </div>
        <p className="eyebrow mb-3">Panel privado</p>
        <h1 className="font-serif-display text-[38px] mb-2">Acceso</h1>
        <p className="font-sans-body text-[14px] text-[var(--muted)] mb-8">
          Introduce la contraseña para ver las confirmaciones.
        </p>
        <Input
          type="password"
          data-testid="admin-password"
          className="gold-field h-12 rounded-md text-center"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
        <Button
          type="submit"
          disabled={loading}
          data-testid="admin-login-btn"
          className="w-full mt-6 h-12 rounded-full font-sans-body font-medium text-[11px] tracking-[0.3em] uppercase text-[#0a0e27]"
          style={{
            background: "linear-gradient(135deg, #d4b572 0%, #c9a961 50%, #a88840 100%)",
          }}
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : "Entrar"}
        </Button>
      </motion.form>
    </div>
  );
}

function StatCard({ icon, label, value, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className="relative p-6 rounded-xl overflow-hidden"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(201,169,97,0.03))",
        border: "1px solid rgba(201,169,97,0.15)",
      }}
    >
      <span
        className="absolute top-0 left-5 right-5 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(201,169,97,0.65), transparent)" }}
      />
      <div className="flex items-center gap-3 mb-3 text-[#c9a961]">
        {icon}
        <span className="eyebrow" style={{ fontSize: 9 }}>{label}</span>
      </div>
      <p className="font-serif-display text-[42px] leading-none">{value}</p>
    </motion.div>
  );
}

function Dashboard({ token, onLogout }) {
  const [data, setData] = useState({ items: [], stats: null });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const r = await axios.get(`${API}/admin/rsvps`, {
        headers: { "X-Admin-Token": token },
      });
      setData(r.data);
    } catch (err) {
      if (err?.response?.status === 401) {
        onLogout();
      } else {
        toast.error("Error al cargar");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [token]);

  const remove = async (id) => {
    if (!window.confirm("¿Eliminar esta respuesta?")) return;
    try {
      await axios.delete(`${API}/admin/rsvps/${id}`, {
        headers: { "X-Admin-Token": token },
      });
      toast.success("Eliminada");
      load();
    } catch {
      toast.error("No se pudo eliminar");
    }
  };

  return (
    <div className="relative min-h-screen px-6 py-16">
      <LightOrbs />
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="eyebrow mb-2">Panel privado</p>
            <h1 className="font-serif-display text-[38px] sm:text-[54px] leading-none">Confirmaciones</h1>
          </div>
          <Button
            onClick={onLogout}
            data-testid="admin-logout"
            variant="outline"
            className="rounded-full border-[#c9a961]/40 hover:border-[#c9a961] bg-transparent hover:bg-[#c9a961]/10 text-[var(--ivory-2)]"
          >
            <LogOut size={14} /> Salir
          </Button>
        </div>

        {data.stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            <StatCard icon={<Users size={18} />} label="Total respuestas" value={data.stats.total} delay={0} />
            <StatCard icon={<UserCheck size={18} />} label="Vienen" value={data.stats.coming} delay={0.05} />
            <StatCard icon={<UserX size={18} />} label="No pueden" value={data.stats.declined} delay={0.1} />
            <StatCard icon={<Sparkles size={18} />} label="Total invitados" value={data.stats.headcount} delay={0.15} />
          </div>
        )}

        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: "rgba(13,19,52,0.6)",
            border: "1px solid rgba(201,169,97,0.15)",
          }}
          data-testid="admin-table"
        >
          {loading ? (
            <div className="py-20 flex items-center justify-center">
              <Loader2 className="animate-spin text-[#c9a961]" />
            </div>
          ) : data.items.length === 0 ? (
            <div className="py-20 text-center text-[var(--muted)]">Sin respuestas todavía.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#c9a961]/15 hover:bg-transparent">
                  <TableHead className="eyebrow">Estado</TableHead>
                  <TableHead className="eyebrow">Nombre</TableHead>
                  <TableHead className="eyebrow">Contacto</TableHead>
                  <TableHead className="eyebrow">+1</TableHead>
                  <TableHead className="eyebrow">Dieta</TableHead>
                  <TableHead className="eyebrow">Canción</TableHead>
                  <TableHead className="eyebrow">Mensaje</TableHead>
                  <TableHead className="eyebrow text-right">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((it) => (
                  <TableRow
                    key={it.id}
                    className="border-b border-white/5 hover:bg-[#c9a961]/[0.03]"
                  >
                    <TableCell>
                      <span
                        className="inline-flex items-center px-3 py-1 rounded-full text-[10px] tracking-[0.2em] uppercase"
                        style={
                          it.attendance === "yes"
                            ? {
                                background: "rgba(201,169,97,0.12)",
                                color: "#d4b572",
                                border: "1px solid rgba(201,169,97,0.4)",
                              }
                            : {
                                background: "rgba(138,148,166,0.08)",
                                color: "var(--muted)",
                                border: "1px solid rgba(138,148,166,0.25)",
                              }
                        }
                      >
                        {it.attendance === "yes" ? "Viene" : "No"}
                      </span>
                    </TableCell>
                    <TableCell className="font-serif-display text-[16px] text-[var(--ivory)]">
                      {it.firstName} {it.lastName}
                    </TableCell>
                    <TableCell className="text-[13px] text-[var(--ivory-2)]">
                      <div>{it.email || "—"}</div>
                      <div className="text-[var(--muted)]">{it.phone || ""}</div>
                    </TableCell>
                    <TableCell className="text-[13px]">
                      {it.plusOne === "yes" ? (
                        <div>
                          <div className="text-[var(--ivory)]">{it.plusOneName || "Sí"}</div>
                          {it.plusOneDiet && (
                            <div className="text-[var(--muted)] text-[11px]">{it.plusOneDiet}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-[var(--muted)]">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-[13px] text-[var(--ivory-2)]">
                      {labelDiet(it.dietary)}
                    </TableCell>
                    <TableCell className="text-[13px] text-[var(--ivory-2)] max-w-[160px] truncate">
                      {it.song || "—"}
                    </TableCell>
                    <TableCell className="text-[13px] text-[var(--ivory-2)] max-w-[200px] truncate">
                      {it.message || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        data-testid={`delete-${it.id}`}
                        onClick={() => remove(it.id)}
                        className="inline-flex items-center p-2 rounded-md text-[var(--muted)] hover:text-red-400 hover:bg-red-400/10 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}

function labelDiet(d) {
  switch (d) {
    case "vegetarian": return "Vegetariano";
    case "vegan": return "Vegano";
    case "gluten-free": return "Sin gluten";
    case "other": return "Otra";
    default: return "—";
  }
}

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
  };

  if (!token) return <LoginScreen onAuth={setToken} />;
  return <Dashboard token={token} onLogout={logout} />;
}
