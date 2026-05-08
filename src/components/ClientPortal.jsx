"use client";
import { useState, useEffect } from "react";

const STATES = [
  { id: "recibido", label: "Recibido", desc: "Su equipo ha sido recibido en nuestras instalaciones", color: "#3B8BD4", bg: "#E6F1FB", icon: "📥" },
  { id: "diagnostico", label: "En diagnóstico", desc: "Nuestro equipo técnico está evaluando su equipo", color: "#7F77DD", bg: "#EEEDFE", icon: "🔍" },
  { id: "repuestos", label: "Esperando repuestos", desc: "Se han solicitado los repuestos necesarios para la reparación", color: "#BA7517", bg: "#FAEEDA", icon: "⏳" },
  { id: "reparado", label: "Reparado", desc: "Su equipo ha sido reparado exitosamente y está listo", color: "#1D9E75", bg: "#E1F5EE", icon: "✅" },
  { id: "entregado", label: "Entregado", desc: "El servicio ha sido completado y entregado", color: "#5F5E5A", bg: "#F1EFE8", icon: "📦" },
];

const SAMPLE_ORDERS = [
  { id: "OT-260001", email: "jperez@bancoagricola.com", client: "Banco Agrícola", contact: "Juan Pérez", description: "Mantenimiento preventivo servidor principal", type: "Visita en sitio", state: "diagnostico", technician: "Carlos Méndez", date: "2026-04-14", lastUpdate: "2026-04-16 09:30", notes: "Se detectó desgaste en ventiladores del servidor. Evaluando reemplazo.", equipment: "Servidor Dell PowerEdge R740" },
  { id: "OT-260002", email: "mrodriguez@grupocalleja.com", client: "Grupo Calleja", contact: "María Rodríguez", description: "Reparación UPS Data Center", type: "Reparación en taller", state: "repuestos", technician: "Roberto García", date: "2026-04-10", lastUpdate: "2026-04-15 14:15", notes: "Se requiere módulo de baterías. Proveedor confirma entrega para el 18 de abril.", equipment: "UPS APC Smart-UPS 3000VA" },
  { id: "OT-260003", email: "lmartinez@aes.com.sv", client: "AES El Salvador", contact: "Luis Martínez", description: "Instalación cableado estructurado piso 3", type: "Visita en sitio", state: "reparado", technician: "Ana Martínez", date: "2026-04-08", lastUpdate: "2026-04-16 11:00", notes: "Instalación completada. 24 puntos de red Cat6A certificados. Pendiente entrega de documentación.", equipment: "Cableado Cat6A - 24 puntos" },
  { id: "OT-260004", email: "jperez@bancoagricola.com", client: "Banco Agrícola", contact: "Juan Pérez", description: "Diagnóstico switch de red caído", type: "Reparación en taller", state: "recibido", technician: "Luis Portillo", date: "2026-04-16", lastUpdate: "2026-04-16 08:00", notes: "Equipo recibido. Se programará diagnóstico para hoy.", equipment: "Switch Cisco Catalyst 9300" },
  { id: "OT-260005", email: "mrodriguez@grupocalleja.com", client: "Grupo Calleja", contact: "María Rodríguez", description: "Reemplazo fuente de poder desktop", type: "Reparación en taller", state: "entregado", technician: "Carlos Méndez", date: "2026-04-01", lastUpdate: "2026-04-05 16:30", notes: "Equipo entregado con fuente de poder nueva. Garantía de 6 meses.", equipment: "Desktop HP ProDesk 400 G7" },
];

const formatDate = (str) => {
  if (!str) return "";
  const d = new Date(str + (str.length === 10 ? "T00:00:00" : ""));
  return d.toLocaleDateString("es-SV", { day: "numeric", month: "long", year: "numeric" });
};

const formatDateTime = (str) => {
  if (!str) return "";
  const parts = str.split(" ");
  const d = new Date(parts[0] + "T" + (parts[1] || "00:00"));
  return d.toLocaleDateString("es-SV", { day: "numeric", month: "long", year: "numeric" }) + ", " + (parts[1] || "");
};

export default function ClientPortal() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (!orderId.trim() && !email.trim()) {
      setError("Ingrese al menos un criterio de búsqueda");
      return;
    }
    setError("");
    setLoading(true);
    setSearched(true);
    setTimeout(() => {
      let found = SAMPLE_ORDERS;
      if (orderId.trim()) {
        found = found.filter((o) => o.id.toLowerCase() === orderId.trim().toUpperCase().toLowerCase());
      }
      if (email.trim()) {
        found = found.filter((o) => o.email.toLowerCase() === email.trim().toLowerCase());
      }
      setResults(found.length > 0 ? found : []);
      setLoading(false);
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const [expandedOrder, setExpandedOrder] = useState(null);

  return (
    <div style={{ minHeight: "100vh", background: "#f5f4f0", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

      {/* Header */}
      <header style={{
        background: "#1a1a1f", color: "#fff", padding: "0",
        borderBottom: "3px solid #3B8BD4",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div>
              <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>DTS</span>
              <span style={{ fontSize: 22, fontWeight: 300, marginLeft: 6, color: "#3B8BD4" }}>SGS</span>
            </div>
            <div style={{ width: 1, height: 28, background: "#333", margin: "0 4px" }} />
            <span style={{ fontSize: 12, color: "#888", letterSpacing: 0.5 }}>Portal de cliente</span>
          </div>
          <div style={{ fontSize: 11, color: "#666" }}>El Salvador</div>
        </div>
      </header>

      {/* Hero / Search Section */}
      <div style={{
        background: "linear-gradient(135deg, #1a1a1f 0%, #2a2a32 100%)",
        padding: "48px 24px 56px",
      }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 800, margin: "0 0 8px", letterSpacing: -0.5 }}>
            Consulte el estado de su servicio
          </h1>
          <p style={{ color: "#888", fontSize: 14, margin: "0 0 32px", lineHeight: 1.5 }}>
            Ingrese su número de orden y correo electrónico para ver el progreso en tiempo real.
          </p>

          <div style={{
            background: "#fff", borderRadius: 16, padding: 24, textAlign: "left",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#999", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 6 }}>
                Número de orden
              </label>
              <input
                type="text"
                placeholder="Ej: OT-260001"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{
                  width: "100%", padding: "12px 14px", borderRadius: 10,
                  border: "2px solid #e8e7e3", fontSize: 15, fontWeight: 600,
                  outline: "none", transition: "border 0.2s", boxSizing: "border-box",
                  color: "#1a1a1f", background: "#fafaf8",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#3B8BD4")}
                onBlur={(e) => (e.target.style.borderColor = "#e8e7e3")}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#999", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 6 }}>
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="su.correo@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{
                  width: "100%", padding: "12px 14px", borderRadius: 10,
                  border: "2px solid #e8e7e3", fontSize: 15,
                  outline: "none", transition: "border 0.2s", boxSizing: "border-box",
                  color: "#1a1a1f", background: "#fafaf8",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#3B8BD4")}
                onBlur={(e) => (e.target.style.borderColor = "#e8e7e3")}
              />
            </div>

            {error && (
              <div style={{ fontSize: 13, color: "#E24B4A", marginBottom: 12, fontWeight: 500 }}>{error}</div>
            )}

            <button onClick={handleSearch}
              style={{
                width: "100%", padding: "14px", borderRadius: 10, border: "none",
                background: "#3B8BD4", color: "#fff", fontSize: 15, fontWeight: 700,
                cursor: "pointer", transition: "all 0.2s", letterSpacing: 0.3,
              }}
              onMouseEnter={(e) => (e.target.style.background = "#2a6fb0")}
              onMouseLeave={(e) => (e.target.style.background = "#3B8BD4")}
            >
              {loading ? "Consultando..." : "Consultar estado"}
            </button>

            <div style={{ marginTop: 14, textAlign: "center" }}>
              <p style={{ fontSize: 11, color: "#bbb", margin: 0 }}>
                Datos de prueba: OT-260001 / jperez@bancoagricola.com
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 24px 60px" }}>

        {loading && (
          <div style={{ textAlign: "center", padding: 40 }}>
            <div style={{
              width: 36, height: 36, border: "3px solid #e8e7e3", borderTopColor: "#3B8BD4",
              borderRadius: "50%", margin: "0 auto 16px",
              animation: "spin 0.8s linear infinite",
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <div style={{ fontSize: 14, color: "#888" }}>Buscando su orden...</div>
          </div>
        )}

        {!loading && searched && results?.length === 0 && (
          <div style={{
            background: "#fff", borderRadius: 14, padding: "40px 24px",
            textAlign: "center", border: "1px solid #eee",
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#333", marginBottom: 6 }}>No se encontraron resultados</div>
            <div style={{ fontSize: 13, color: "#999", lineHeight: 1.5 }}>
              Verifique que el número de orden y el correo electrónico sean correctos.<br />
              Si necesita ayuda, contáctenos al (503) 2222-0000.
            </div>
          </div>
        )}

        {!loading && results?.length > 0 && (
          <div>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>
              {results.length} {results.length === 1 ? "orden encontrada" : "órdenes encontradas"}
            </div>

            {results.map((order) => {
              const stateObj = STATES.find((s) => s.id === order.state);
              const stateIdx = STATES.findIndex((s) => s.id === order.state);
              const isExpanded = expandedOrder === order.id;

              return (
                <div key={order.id} style={{
                  background: "#fff", borderRadius: 14, marginBottom: 16,
                  border: "1px solid #eee", overflow: "hidden",
                  transition: "box-shadow 0.2s",
                  boxShadow: isExpanded ? "0 8px 30px rgba(0,0,0,0.08)" : "none",
                }}>

                  {/* Order Header - always visible */}
                  <div
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    style={{
                      padding: "20px 24px", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      gap: 16,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 18, fontWeight: 800, color: "#1a1a1f" }}>{order.id}</span>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          padding: "4px 12px", borderRadius: 20,
                          background: stateObj.bg, color: stateObj.color,
                          fontSize: 12, fontWeight: 700,
                        }}>
                          <span style={{ width: 7, height: 7, borderRadius: "50%", background: stateObj.color }} />
                          {stateObj.label}
                        </span>
                      </div>
                      <div style={{ fontSize: 13, color: "#666" }}>{order.description}</div>
                      <div style={{ fontSize: 11, color: "#bbb", marginTop: 4 }}>{order.equipment}</div>
                    </div>
                    <div style={{
                      fontSize: 18, color: "#ccc", transition: "transform 0.2s",
                      transform: isExpanded ? "rotate(180deg)" : "none",
                    }}>▼</div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div style={{ borderTop: "1px solid #f0efeb" }}>

                      {/* Progress Bar */}
                      <div style={{ padding: "24px 24px 20px" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", position: "relative" }}>
                          {STATES.map((s, i) => {
                            const isPast = i < stateIdx;
                            const isCurrent = i === stateIdx;
                            const isFuture = i > stateIdx;
                            return (
                              <div key={s.id} style={{ flex: 1, textAlign: "center", position: "relative" }}>
                                {i > 0 && (
                                  <div style={{
                                    position: "absolute", top: 14, left: 0, right: "50%", height: 3,
                                    background: isPast || isCurrent ? stateObj.color : "#e8e7e3",
                                    borderRadius: 2, zIndex: 0,
                                    transition: "background 0.3s",
                                  }} />
                                )}
                                {i < STATES.length - 1 && (
                                  <div style={{
                                    position: "absolute", top: 14, left: "50%", right: 0, height: 3,
                                    background: isPast ? stateObj.color : "#e8e7e3",
                                    borderRadius: 2, zIndex: 0,
                                    transition: "background 0.3s",
                                  }} />
                                )}
                                <div style={{
                                  width: 30, height: 30, borderRadius: "50%", margin: "0 auto",
                                  background: isPast ? "#1D9E75" : isCurrent ? stateObj.color : "#e8e7e3",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  color: isFuture ? "#bbb" : "#fff",
                                  fontSize: isCurrent ? 14 : 12, fontWeight: 700,
                                  position: "relative", zIndex: 1,
                                  transition: "all 0.3s",
                                  boxShadow: isCurrent ? `0 0 0 4px ${stateObj.color}30` : "none",
                                }}>
                                  {isPast ? "✓" : isCurrent ? s.icon?.slice(0, 2) || (i + 1) : i + 1}
                                </div>
                                <div style={{
                                  fontSize: 9, marginTop: 6,
                                  fontWeight: isCurrent ? 700 : 400,
                                  color: isCurrent ? stateObj.color : isFuture ? "#ccc" : "#888",
                                  lineHeight: 1.2,
                                  transition: "color 0.3s",
                                }}>{s.label}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Current Status Message */}
                      <div style={{
                        margin: "0 24px 20px", padding: "16px 18px", borderRadius: 10,
                        background: stateObj.bg, borderLeft: `4px solid ${stateObj.color}`,
                      }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: stateObj.color, marginBottom: 4 }}>
                          Estado actual: {stateObj.label}
                        </div>
                        <div style={{ fontSize: 13, color: "#555", lineHeight: 1.5 }}>
                          {stateObj.desc}
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div style={{
                        display: "grid", gridTemplateColumns: "1fr 1fr",
                        gap: 1, background: "#f0efeb", margin: "0 24px 20px",
                        borderRadius: 10, overflow: "hidden",
                      }}>
                        {[
                          { label: "Cliente", value: order.client },
                          { label: "Contacto", value: order.contact },
                          { label: "Tipo de servicio", value: order.type },
                          { label: "Técnico asignado", value: order.technician },
                          { label: "Fecha de ingreso", value: formatDate(order.date) },
                          { label: "Última actualización", value: formatDateTime(order.lastUpdate) },
                        ].map((f, i) => (
                          <div key={i} style={{ padding: "14px 16px", background: "#fff" }}>
                            <div style={{ fontSize: 10, color: "#999", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 4 }}>{f.label}</div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>{f.value}</div>
                          </div>
                        ))}
                      </div>

                      {/* Technical Notes */}
                      {order.notes && (
                        <div style={{ margin: "0 24px 24px" }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#999", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 8 }}>
                            Notas del técnico
                          </div>
                          <div style={{
                            padding: "14px 16px", background: "#fafaf8", borderRadius: 10,
                            fontSize: 13, color: "#555", lineHeight: 1.6,
                            borderLeft: "3px solid #e8e7e3",
                          }}>
                            {order.notes}
                          </div>
                        </div>
                      )}

                      {/* Contact CTA */}
                      <div style={{
                        margin: "0 24px 24px", padding: "16px 18px", borderRadius: 10,
                        background: "#fafaf8", display: "flex", alignItems: "center",
                        justifyContent: "space-between", gap: 12, flexWrap: "wrap",
                      }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>¿Tiene alguna pregunta?</div>
                          <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>Contáctenos para más información sobre su orden</div>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button style={{
                            padding: "8px 16px", borderRadius: 8, border: "1px solid #ddd",
                            background: "#fff", color: "#555", fontSize: 12, fontWeight: 600,
                            cursor: "pointer",
                          }}>
                            (503) 2222-0000
                          </button>
                          <button style={{
                            padding: "8px 16px", borderRadius: 8, border: "none",
                            background: "#3B8BD4", color: "#fff", fontSize: 12, fontWeight: 600,
                            cursor: "pointer",
                          }}>
                            Enviar correo
                          </button>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Info Section - always visible */}
        {!loading && (
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 16, marginTop: 32,
          }}>
            {[
              { icon: "🔔", title: "Notificaciones", desc: "Reciba alertas por correo cada vez que el estado de su orden cambie." },
              { icon: "📄", title: "Reportes", desc: "Descargue reportes técnicos en PDF una vez completado el servicio." },
              { icon: "🕐", title: "Historial", desc: "Consulte todas sus órdenes anteriores con su cuenta registrada." },
            ].map((item, i) => (
              <div key={i} style={{
                background: "#fff", borderRadius: 12, padding: "20px 18px",
                border: "1px solid #eee", textAlign: "center",
              }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{item.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#333", marginBottom: 6 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: "#999", lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{
        background: "#1a1a1f", padding: "24px", textAlign: "center",
        borderTop: "3px solid #3B8BD4",
      }}>
        <div style={{ fontSize: 12, color: "#666" }}>
          DTS El Salvador — Sistema de Gestión de Servicios (SGS) — 2026
        </div>
        <div style={{ fontSize: 11, color: "#444", marginTop: 6 }}>
          Para soporte técnico: soporte@dts.com.sv | (503) 2222-0000
        </div>
      </footer>
    </div>
  );
}
