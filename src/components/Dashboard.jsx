"use client";
import { useState, useEffect } from "react";

const STATES = [
  { id: "recibido", label: "Recibido", color: "#3B8BD4", bg: "#E6F1FB" },
  { id: "diagnostico", label: "Diagnóstico", color: "#7F77DD", bg: "#EEEDFE" },
  { id: "repuestos", label: "Esperando repuestos", color: "#BA7517", bg: "#FAEEDA" },
  { id: "reparado", label: "Reparado", color: "#1D9E75", bg: "#E1F5EE" },
  { id: "entregado", label: "Entregado", color: "#5F5E5A", bg: "#F1EFE8" },
];

const TECNICOS = [
  { id: 1, name: "Carlos Méndez", specialty: "HVAC", avatar: "CM" },
  { id: 2, name: "Roberto García", specialty: "Eléctrico", avatar: "RG" },
  { id: 3, name: "Ana Martínez", specialty: "Redes", avatar: "AM" },
  { id: 4, name: "Luis Portillo", specialty: "Hardware", avatar: "LP" },
];

const CLIENTES = ["Banco Agrícola", "Grupo Calleja", "AES El Salvador", "Digicel", "Laboratorios Vijosa"];

const TIPOS = ["Visita en sitio", "Reparación en taller"];

const generateOrders = () => {
  const orders = [];
  const descriptions = [
    "Mantenimiento preventivo servidor principal",
    "Reparación UPS Data Center",
    "Instalación cableado estructurado piso 3",
    "Diagnóstico switch de red caído",
    "Reemplazo fuente de poder desktop",
    "Mantenimiento aire acondicionado rack",
    "Configuración VLAN corporativa",
    "Reparación laptop ejecutiva - pantalla",
    "Actualización firmware routers",
    "Revisión sistema de respaldo eléctrico",
    "Cambio de disco duro servidor NAS",
    "Instalación access point nuevo piso 2",
  ];
  const now = new Date(2026, 3, 16);
  for (let i = 0; i < 12; i++) {
    const dayOffset = Math.floor(Math.random() * 14) - 3;
    const date = new Date(now);
    date.setDate(date.getDate() + dayOffset);
    const hour = 8 + Math.floor(Math.random() * 8);
    orders.push({
      id: `OT-${String(2026).slice(2)}${String(i + 1).padStart(4, "0")}`,
      description: descriptions[i],
      client: CLIENTES[Math.floor(Math.random() * CLIENTES.length)],
      type: TIPOS[Math.floor(Math.random() * 2)],
      state: STATES[Math.min(Math.floor(Math.random() * 5), 4)].id,
      technician: TECNICOS[Math.floor(Math.random() * TECNICOS.length)],
      date: date.toISOString().split("T")[0],
      time: `${String(hour).padStart(2, "0")}:00`,
      priority: ["Alta", "Media", "Baja"][Math.floor(Math.random() * 3)],
    });
  }
  return orders;
};

const getNextState = (current) => {
  const idx = STATES.findIndex((s) => s.id === current);
  return idx < STATES.length - 1 ? STATES[idx + 1].id : null;
};

const getPrevState = (current) => {
  const idx = STATES.findIndex((s) => s.id === current);
  return idx > 0 ? STATES[idx - 1].id : null;
};

const StateChip = ({ stateId, small }) => {
  const state = STATES.find((s) => s.id === stateId);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: small ? "2px 8px" : "3px 10px",
      borderRadius: 20,
      background: state.bg,
      color: state.color,
      fontSize: small ? 11 : 12,
      fontWeight: 600,
      letterSpacing: 0.2,
      whiteSpace: "nowrap",
    }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: state.color }} />
      {state.label}
    </span>
  );
};

const Avatar = ({ initials, size = 32, color = "#3B8BD4" }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    background: `${color}18`, color: color,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: size * 0.38, fontWeight: 700, flexShrink: 0,
  }}>{initials}</div>
);

const PriorityDot = ({ priority }) => {
  const colors = { Alta: "#E24B4A", Media: "#BA7517", Baja: "#1D9E75" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      fontSize: 11, color: colors[priority], fontWeight: 600,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: colors[priority] }} />
      {priority}
    </span>
  );
};

const VIEWS = ["dashboard", "ordenes", "calendario", "tecnicos"];

export default function SGSDashboard() {
  const [orders, setOrders] = useState(generateOrders);
  const [view, setView] = useState("dashboard");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterState, setFilterState] = useState("all");
  const [calendarWeekOffset, setCalendarWeekOffset] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [winW, setWinW] = useState(1200);

  useEffect(() => {
    const update = () => setWinW(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const updateOrderState = (orderId, newState) => {
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, state: newState } : o));
    if (selectedOrder?.id === orderId) setSelectedOrder((prev) => ({ ...prev, state: newState }));
  };

  const filteredOrders = filterState === "all" ? orders : orders.filter((o) => o.state === filterState);

  const stateCounts = STATES.map((s) => ({
    ...s,
    count: orders.filter((o) => o.state === s.id).length,
  }));

  const today = new Date(2026, 3, 16);
  const getWeekDays = (offset) => {
    const start = new Date(today);
    start.setDate(start.getDate() - start.getDay() + 1 + offset * 7);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });
  };

  const weekDays = getWeekDays(calendarWeekOffset);
  const dayNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "⊞" },
    { id: "ordenes", label: "Órdenes", icon: "☰" },
    { id: "calendario", label: "Calendario", icon: "◫" },
    { id: "tecnicos", label: "Técnicos", icon: "◉" },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#f5f4f0", color: "#2c2c2a", overflow: "hidden" }}>
      
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 90 }} />}
      
      <aside style={{
        width: 220, background: "#1a1a1f", color: "#b0afa8", display: "flex", flexDirection: "column",
        padding: "20px 0", flexShrink: 0, zIndex: 100,
        position: winW < 768 ? "fixed" : "relative",
        left: winW < 768 ? (sidebarOpen ? 0 : -240) : 0,
        height: "100vh", transition: "left 0.3s",
      }}>
        <div style={{ padding: "0 20px 24px", borderBottom: "1px solid #2a2a30" }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>SGS</div>
          <div style={{ fontSize: 11, color: "#6a6a6f", marginTop: 2, letterSpacing: 1 }}>DTS EL SALVADOR</div>
        </div>
        <nav style={{ flex: 1, padding: "16px 10px" }}>
          {navItems.map((item) => (
            <button key={item.id} onClick={() => { setView(item.id); setSidebarOpen(false); setSelectedOrder(null); }}
              style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%",
                padding: "10px 14px", border: "none", borderRadius: 8, cursor: "pointer",
                background: view === item.id ? "#2a2a32" : "transparent",
                color: view === item.id ? "#fff" : "#8a8a8f",
                fontSize: 14, fontWeight: view === item.id ? 600 : 400,
                marginBottom: 4, transition: "all 0.15s",
              }}>
              <span style={{ fontSize: 16, width: 22, textAlign: "center" }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: "16px 20px", borderTop: "1px solid #2a2a30" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar initials="KL" size={28} color="#7F77DD" />
            <div>
              <div style={{ fontSize: 12, color: "#ddd", fontWeight: 600 }}>Kevin Landos</div>
              <div style={{ fontSize: 10, color: "#6a6a6f" }}>Administrador</div>
            </div>
          </div>
        </div>
      </aside>

      <main style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        <header style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 24px", background: "#fff", borderBottom: "1px solid #e8e7e3",
          position: "sticky", top: 0, zIndex: 50,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ display: winW < 768 ? "block" : "none", background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>☰</button>
            <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#1a1a1f" }}>
              {navItems.find((n) => n.id === view)?.label}
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12, color: "#888", background: "#f0efeb", padding: "4px 12px", borderRadius: 6 }}>
              {today.toLocaleDateString("es-SV", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>
        </header>

        <div style={{ padding: 24, flex: 1 }}>

          {/* ============ DASHBOARD ============ */}
          {view === "dashboard" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 24 }}>
                {stateCounts.map((s) => (
                  <div key={s.id} onClick={() => { setView("ordenes"); setFilterState(s.id); }}
                    style={{
                      background: "#fff", borderRadius: 12, padding: "16px 18px", cursor: "pointer",
                      borderLeft: `3px solid ${s.color}`, transition: "transform 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.count}</div>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ background: "#fff", borderRadius: 12, padding: 20, gridColumn: winW < 900 ? "1 / -1" : "auto" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Órdenes recientes</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {orders.slice(0, 5).map((o) => (
                      <div key={o.id} onClick={() => { setSelectedOrder(o); setView("ordenes"); }}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "10px 12px", borderRadius: 8, background: "#fafaf8", cursor: "pointer",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#f0efeb")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "#fafaf8")}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{o.id}</div>
                          <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{o.description.slice(0, 35)}...</div>
                        </div>
                        <StateChip stateId={o.state} small />
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: "#fff", borderRadius: 12, padding: 20, gridColumn: winW < 900 ? "1 / -1" : "auto" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Técnicos disponibles</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {TECNICOS.map((t) => {
                      const assigned = orders.filter((o) => o.technician.id === t.id && o.state !== "entregado").length;
                      const colors = ["#3B8BD4", "#7F77DD", "#1D9E75", "#D85A30"];
                      return (
                        <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0" }}>
                          <Avatar initials={t.avatar} size={36} color={colors[t.id - 1]} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div>
                            <div style={{ fontSize: 11, color: "#888" }}>{t.specialty}</div>
                          </div>
                          <div style={{
                            fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 12,
                            background: assigned >= 3 ? "#FCEBEB" : "#E1F5EE",
                            color: assigned >= 3 ? "#A32D2D" : "#0F6E56",
                          }}>
                            {assigned} activas
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div style={{ background: "#fff", borderRadius: 12, padding: 20, marginTop: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Flujo de estados</div>
                <div style={{ display: "flex", alignItems: "center", gap: 0, overflow: "auto", padding: "8px 0" }}>
                  {STATES.map((s, i) => (
                    <div key={s.id} style={{ display: "flex", alignItems: "center" }}>
                      <div style={{
                        textAlign: "center", padding: "12px 16px", borderRadius: 10,
                        background: s.bg, minWidth: 90,
                      }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>
                          {orders.filter((o) => o.state === s.id).length}
                        </div>
                        <div style={{ fontSize: 10, color: s.color, fontWeight: 600, marginTop: 2 }}>{s.label}</div>
                      </div>
                      {i < STATES.length - 1 && (
                        <svg width="28" height="20" viewBox="0 0 28 20" style={{ flexShrink: 0 }}>
                          <path d="M4 10 L20 10 M16 5 L22 10 L16 15" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============ ÓRDENES ============ */}
          {view === "ordenes" && !selectedOrder && (
            <div>
              <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
                <button onClick={() => setFilterState("all")}
                  style={{
                    padding: "6px 14px", borderRadius: 20, border: "1px solid #ddd", cursor: "pointer",
                    background: filterState === "all" ? "#1a1a1f" : "#fff",
                    color: filterState === "all" ? "#fff" : "#555",
                    fontSize: 12, fontWeight: 600, transition: "all 0.15s",
                  }}>Todas ({orders.length})</button>
                {STATES.map((s) => (
                  <button key={s.id} onClick={() => setFilterState(s.id)}
                    style={{
                      padding: "6px 14px", borderRadius: 20, cursor: "pointer",
                      border: `1px solid ${filterState === s.id ? s.color : "#ddd"}`,
                      background: filterState === s.id ? s.bg : "#fff",
                      color: filterState === s.id ? s.color : "#555",
                      fontSize: 12, fontWeight: 600, transition: "all 0.15s",
                    }}>
                    {s.label} ({orders.filter((o) => o.state === s.id).length})
                  </button>
                ))}
              </div>

              <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden" }}>
                <div style={{
                  display: "grid", gridTemplateColumns: "90px 1fr 130px 100px 110px 70px 80px",
                  padding: "10px 16px", background: "#fafaf8", borderBottom: "1px solid #eee",
                  fontSize: 11, fontWeight: 600, color: "#888", letterSpacing: 0.3,
                }}>
                  <span>ID</span><span>Descripción</span><span>Cliente</span><span>Tipo</span>
                  <span>Estado</span><span>Prior.</span><span>Técnico</span>
                </div>
                {filteredOrders.map((o) => (
                  <div key={o.id} onClick={() => setSelectedOrder(o)}
                    style={{
                      display: "grid", gridTemplateColumns: "90px 1fr 130px 100px 110px 70px 80px",
                      padding: "12px 16px", borderBottom: "1px solid #f5f4f0", cursor: "pointer",
                      alignItems: "center", fontSize: 13, transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#fafaf8")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}>
                    <span style={{ fontWeight: 700, fontSize: 12, color: "#3B8BD4" }}>{o.id}</span>
                    <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingRight: 8 }}>{o.description}</span>
                    <span style={{ fontSize: 12, color: "#666" }}>{o.client}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4,
                      background: o.type === "Visita en sitio" ? "#E6F1FB" : "#EEEDFE",
                      color: o.type === "Visita en sitio" ? "#185FA5" : "#534AB7",
                      whiteSpace: "nowrap",
                    }}>{o.type === "Visita en sitio" ? "Sitio" : "Taller"}</span>
                    <StateChip stateId={o.state} small />
                    <PriorityDot priority={o.priority} />
                    <Avatar initials={o.technician.avatar} size={26} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============ DETALLE ORDEN ============ */}
          {view === "ordenes" && selectedOrder && (
            <div>
              <button onClick={() => setSelectedOrder(null)}
                style={{
                  display: "flex", alignItems: "center", gap: 6, background: "none", border: "none",
                  color: "#888", fontSize: 13, cursor: "pointer", marginBottom: 16, padding: 0,
                }}>
                ← Volver a órdenes
              </button>

              <div style={{ background: "#fff", borderRadius: 12, padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#1a1a1f" }}>{selectedOrder.id}</div>
                    <div style={{ fontSize: 14, color: "#666", marginTop: 4 }}>{selectedOrder.description}</div>
                  </div>
                  <StateChip stateId={selectedOrder.state} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
                  {[
                    { label: "Cliente", value: selectedOrder.client },
                    { label: "Tipo", value: selectedOrder.type },
                    { label: "Fecha", value: selectedOrder.date },
                    { label: "Hora", value: selectedOrder.time },
                    { label: "Prioridad", value: selectedOrder.priority },
                    { label: "Técnico", value: selectedOrder.technician.name },
                  ].map((f) => (
                    <div key={f.label} style={{ padding: "12px 16px", background: "#fafaf8", borderRadius: 8 }}>
                      <div style={{ fontSize: 10, color: "#999", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" }}>{f.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4, color: "#333" }}>{f.value}</div>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Progreso</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                    {STATES.map((s, i) => {
                      const currentIdx = STATES.findIndex((st) => st.id === selectedOrder.state);
                      const isPast = i < currentIdx;
                      const isCurrent = i === currentIdx;
                      return (
                        <div key={s.id} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                          <div style={{ textAlign: "center", flex: 1 }}>
                            <div style={{
                              width: 28, height: 28, borderRadius: "50%", margin: "0 auto",
                              background: isPast ? "#1D9E75" : isCurrent ? s.color : "#e8e7e3",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              color: "#fff", fontSize: 12, fontWeight: 700,
                            }}>
                              {isPast ? "✓" : i + 1}
                            </div>
                            <div style={{
                              fontSize: 9, marginTop: 4, fontWeight: isCurrent ? 700 : 400,
                              color: isCurrent ? s.color : "#aaa",
                            }}>{s.label}</div>
                          </div>
                          {i < STATES.length - 1 && (
                            <div style={{
                              height: 2, flex: 1, minWidth: 16,
                              background: isPast ? "#1D9E75" : "#e8e7e3",
                              borderRadius: 1,
                            }} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {getPrevState(selectedOrder.state) && (
                    <button onClick={() => updateOrderState(selectedOrder.id, getPrevState(selectedOrder.state))}
                      style={{
                        padding: "8px 20px", borderRadius: 8, border: "1px solid #ddd",
                        background: "#fff", color: "#666", fontSize: 13, fontWeight: 600,
                        cursor: "pointer", transition: "all 0.15s",
                      }}>
                      ← Regresar a {STATES.find((s) => s.id === getPrevState(selectedOrder.state))?.label}
                    </button>
                  )}
                  {getNextState(selectedOrder.state) && (
                    <button onClick={() => updateOrderState(selectedOrder.id, getNextState(selectedOrder.state))}
                      style={{
                        padding: "8px 20px", borderRadius: 8, border: "none",
                        background: STATES.find((s) => s.id === getNextState(selectedOrder.state))?.color,
                        color: "#fff", fontSize: 13, fontWeight: 600,
                        cursor: "pointer", transition: "all 0.15s",
                      }}>
                      Avanzar a {STATES.find((s) => s.id === getNextState(selectedOrder.state))?.label} →
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============ CALENDARIO ============ */}
          {view === "calendario" && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <button onClick={() => setCalendarWeekOffset((p) => p - 1)}
                  style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #ddd", background: "#fff", cursor: "pointer", fontSize: 13 }}>← Anterior</button>
                <div style={{ fontSize: 15, fontWeight: 700 }}>
                  {monthNames[weekDays[0].getMonth()]} {weekDays[0].getDate()} — {monthNames[weekDays[6].getMonth()]} {weekDays[6].getDate()}, {weekDays[0].getFullYear()}
                </div>
                <button onClick={() => setCalendarWeekOffset((p) => p + 1)}
                  style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #ddd", background: "#fff", cursor: "pointer", fontSize: 13 }}>Siguiente →</button>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#666" }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: "#E6F1FB", border: "1px solid #85B7EB" }} />
                  Visita en sitio
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#666" }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: "#EEEDFE", border: "1px solid #AFA9EC" }} />
                  Reparación en taller
                </div>
              </div>

              <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
                  {weekDays.map((d, i) => {
                    const dateStr = d.toISOString().split("T")[0];
                    const dayOrders = orders.filter((o) => o.date === dateStr);
                    const isToday = dateStr === today.toISOString().split("T")[0];
                    return (
                      <div key={i} style={{
                        borderRight: i < 6 ? "1px solid #f0efeb" : "none",
                        minHeight: 160, padding: 0,
                      }}>
                        <div style={{
                          textAlign: "center", padding: "10px 6px",
                          background: isToday ? "#1a1a1f" : "#fafaf8",
                          borderBottom: "1px solid #f0efeb",
                        }}>
                          <div style={{ fontSize: 10, color: isToday ? "#999" : "#aaa", fontWeight: 600 }}>{dayNames[i]}</div>
                          <div style={{
                            fontSize: 18, fontWeight: 800,
                            color: isToday ? "#fff" : "#333",
                          }}>{d.getDate()}</div>
                        </div>
                        <div style={{ padding: 4 }}>
                          {dayOrders.map((o) => (
                            <div key={o.id} onClick={() => { setSelectedOrder(o); setView("ordenes"); }}
                              style={{
                                padding: "5px 6px", marginBottom: 3, borderRadius: 5,
                                background: o.type === "Visita en sitio" ? "#E6F1FB" : "#EEEDFE",
                                borderLeft: `3px solid ${o.type === "Visita en sitio" ? "#3B8BD4" : "#7F77DD"}`,
                                cursor: "pointer", fontSize: 10, lineHeight: 1.3,
                              }}>
                              <div style={{ fontWeight: 700, color: "#333" }}>{o.time} — {o.id}</div>
                              <div style={{ color: "#666", marginTop: 1 }}>{o.description.slice(0, 22)}...</div>
                              <div style={{ color: "#999", marginTop: 1 }}>{o.technician.avatar}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ============ TÉCNICOS ============ */}
          {view === "tecnicos" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
              {TECNICOS.map((t) => {
                const techOrders = orders.filter((o) => o.technician.id === t.id);
                const active = techOrders.filter((o) => o.state !== "entregado");
                const completed = techOrders.filter((o) => o.state === "entregado");
                const colors = ["#3B8BD4", "#7F77DD", "#1D9E75", "#D85A30"];
                const color = colors[t.id - 1];
                return (
                  <div key={t.id} style={{ background: "#fff", borderRadius: 12, overflow: "hidden" }}>
                    <div style={{
                      padding: "20px 20px 16px", borderBottom: "1px solid #f0efeb",
                      display: "flex", alignItems: "center", gap: 14,
                    }}>
                      <Avatar initials={t.avatar} size={44} color={color} />
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700 }}>{t.name}</div>
                        <div style={{
                          fontSize: 11, fontWeight: 600, color: color,
                          background: `${color}15`, padding: "2px 8px", borderRadius: 4, marginTop: 3,
                          display: "inline-block",
                        }}>{t.specialty}</div>
                      </div>
                    </div>
                    <div style={{ padding: "12px 20px", display: "flex", gap: 16, borderBottom: "1px solid #f0efeb" }}>
                      <div>
                        <div style={{ fontSize: 22, fontWeight: 800, color }}>{active.length}</div>
                        <div style={{ fontSize: 10, color: "#999" }}>Activas</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: "#5F5E5A" }}>{completed.length}</div>
                        <div style={{ fontSize: 10, color: "#999" }}>Completadas</div>
                      </div>
                    </div>
                    <div style={{ padding: "8px 12px" }}>
                      {active.length === 0 && <div style={{ fontSize: 12, color: "#bbb", padding: 8, textAlign: "center" }}>Sin órdenes activas</div>}
                      {active.map((o) => (
                        <div key={o.id} onClick={() => { setSelectedOrder(o); setView("ordenes"); }}
                          style={{
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            padding: "8px 10px", borderRadius: 6, cursor: "pointer", marginBottom: 2,
                            transition: "background 0.1s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#fafaf8")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                          <div>
                            <span style={{ fontSize: 12, fontWeight: 700, color: "#3B8BD4" }}>{o.id}</span>
                            <span style={{ fontSize: 12, color: "#888", marginLeft: 8 }}>{o.date}</span>
                          </div>
                          <StateChip stateId={o.state} small />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
