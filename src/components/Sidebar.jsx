"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/dashboard",      label: "Dashboard",       icon: "⊞", group: "Operaciones" },
  { href: "/ordenes",        label: "Órdenes",         icon: "☰", group: "Operaciones" },
  { href: "/calendario",     label: "Calendario",      icon: "◫", group: "Operaciones" },
  { href: "/ingreso",        label: "Nueva orden",     icon: "+", group: "Operaciones" },
  { href: "/tecnicos",       label: "Técnicos",        icon: "◉", group: "Recursos" },
  { href: "/inventario",     label: "Inventario",      icon: "📦", group: "Recursos" },
  { href: "/estadisticas",   label: "Estadísticas",    icon: "📊", group: "Análisis" },
  { href: "/notificaciones", label: "Notificaciones",  icon: "🔔", group: "Sistema" },
  { href: "/configuracion",  label: "Configuración",   icon: "⚙", group: "Sistema" },
];

export default function Sidebar({ children, title }) {
  const pathname = usePathname();
  const [mobile, setMobile] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const groups = NAV.reduce((acc, item) => {
    acc[item.group] = acc[item.group] || [];
    acc[item.group].push(item);
    return acc;
  }, {});

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#f5f4f0", color: "#2c2c2a" }}>

      {mobile && open && (
        <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 90 }} />
      )}

      <aside style={{
        width: 230, background: "#1a1a1f", color: "#b0afa8", display: "flex", flexDirection: "column",
        padding: "20px 0", flexShrink: 0, zIndex: 100,
        position: mobile ? "fixed" : "relative",
        left: mobile ? (open ? 0 : -250) : 0,
        height: "100vh", transition: "left 0.3s",
      }}>
        <Link href="/dashboard" style={{ textDecoration: "none" }}>
          <div style={{ padding: "0 20px 20px", borderBottom: "1px solid #2a2a30" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>
              DTS <span style={{ fontWeight: 300, color: "#3B8BD4" }}>SGS</span>
            </div>
            <div style={{ fontSize: 10, color: "#6a6a6f", marginTop: 4, letterSpacing: 1 }}>EL SALVADOR · 2026</div>
          </div>
        </Link>

        <nav style={{ flex: 1, padding: "10px 8px", overflow: "auto" }}>
          {Object.entries(groups).map(([group, items]) => (
            <div key={group} style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: "#555", letterSpacing: 1.2, padding: "10px 12px 4px" }}>
                {group.toUpperCase()}
              </div>
              {items.map((item) => {
                const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <Link key={item.href} href={item.href} onClick={() => setOpen(false)} style={{ textDecoration: "none" }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
                      borderRadius: 7, marginBottom: 1, cursor: "pointer",
                      background: active ? "#2a2a32" : "transparent",
                      color: active ? "#fff" : "#8a8a8f",
                      fontSize: 13, fontWeight: active ? 600 : 400,
                      transition: "all 0.15s",
                    }}>
                      <span style={{ fontSize: 14, width: 20, textAlign: "center" }}>{item.icon}</span>
                      {item.label}
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div style={{ padding: "12px 16px", borderTop: "1px solid #2a2a30", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(127,119,221,0.18)", color: "#7F77DD", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800 }}>KL</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: "#ddd", fontWeight: 600 }}>Kevin Landos</div>
            <div style={{ fontSize: 10, color: "#666" }}>Administrador</div>
          </div>
          <Link href="/" style={{ fontSize: 14, color: "#666", textDecoration: "none" }}>↗</Link>
        </div>
      </aside>

      <main style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        <header style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 24px", background: "#fff", borderBottom: "1px solid #e8e7e3",
          position: "sticky", top: 0, zIndex: 50,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {mobile && (
              <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#555" }}>☰</button>
            )}
            <h1 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: "#1a1a1f" }}>{title}</h1>
          </div>
          <div style={{ fontSize: 11, color: "#888", background: "#f0efeb", padding: "5px 12px", borderRadius: 6 }}>
            {new Date().toLocaleDateString("es-SV", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </div>
        </header>
        <div style={{ flex: 1, overflow: "auto" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
