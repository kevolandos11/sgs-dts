"use client";
import { useState } from "react";

// ─── Data ────────────────────────────────────────────────────
const STATES = [
  { id: "recibido",    label: "Recibido",              color: "#3B8BD4", bg: "#E6F1FB", icon: "📥" },
  { id: "diagnostico", label: "En diagnóstico",        color: "#7F77DD", bg: "#EEEDFE", icon: "🔍" },
  { id: "repuestos",   label: "Esperando repuestos",   color: "#BA7517", bg: "#FAEEDA", icon: "⏳" },
  { id: "reparado",    label: "Reparado / Listo",      color: "#1D9E75", bg: "#E1F5EE", icon: "✅" },
  { id: "entregado",   label: "Entregado",             color: "#5F5E5A", bg: "#F1EFE8", icon: "📦" },
];

const TEMPLATES = {
  recibido: {
    subject: "Hemos recibido su equipo — Orden {{order_id}}",
    headline: "Su equipo ha sido recibido",
    body: "Nos complace confirmar que hemos recibido su equipo correctamente en nuestras instalaciones. Nuestro equipo técnico lo revisará a la brevedad posible y le mantendremos informado sobre el progreso.",
    cta: "Ver estado de mi orden",
    tone: "neutral",
  },
  diagnostico: {
    subject: "Estamos diagnosticando su equipo — Orden {{order_id}}",
    headline: "Su equipo está siendo diagnosticado",
    body: "Nuestro técnico especializado está realizando el diagnóstico de su equipo en este momento. Le notificaremos tan pronto tengamos los resultados y el plan de acción para la reparación.",
    cta: "Seguir el progreso",
    tone: "info",
  },
  repuestos: {
    subject: "Repuestos solicitados para su orden — Orden {{order_id}}",
    headline: "Esperando llegada de repuestos",
    body: "Hemos completado el diagnóstico y hemos identificado los repuestos necesarios para la reparación de su equipo. Hemos realizado el pedido correspondiente y le avisaremos en cuanto estén disponibles para proceder.",
    cta: "Ver detalle de mi orden",
    tone: "warning",
  },
  reparado: {
    subject: "✅ Su equipo está listo para retirar — Orden {{order_id}}",
    headline: "¡Su equipo está listo!",
    body: "Nos complace informarle que la reparación de su equipo ha sido completada exitosamente. Puede pasar a retirarlo a nuestras instalaciones en horario de atención, o coordinar la entrega con su técnico asignado.",
    cta: "Confirmar retiro",
    tone: "success",
  },
  entregado: {
    subject: "Servicio completado — Gracias por confiar en DTS",
    headline: "Servicio finalizado con éxito",
    body: "Su equipo ha sido entregado y el servicio ha concluido satisfactoriamente. Agradecemos su confianza en DTS El Salvador. Si tiene alguna consulta o necesita soporte adicional, no dude en contactarnos.",
    cta: "Descargar reporte técnico",
    tone: "success",
  },
};

const SAMPLE_DATA = {
  order_id: "OT-260001",
  client_name: "Juan Pérez",
  company: "Banco Agrícola",
  equipment: "Servidor Dell PowerEdge R740",
  technician: "Carlos Méndez",
  date: "16 de abril de 2026",
  tracking_url: "https://sgs.dts.com.sv/tracking",
};

const DEFAULT_CONFIG = {
  sender_name: "DTS El Salvador",
  sender_email: "soporte@dts.com.sv",
  reply_to: "soporte@dts.com.sv",
  phone: "(503) 2222-0000",
  website: "www.dts.com.sv",
  logo_text: "DTS",
  enabled: {
    recibido: true,
    diagnostico: true,
    repuestos: true,
    reparado: true,
    entregado: true,
  },
  cc_admin: true,
  cc_email: "admin@dts.com.sv",
  send_technician: false,
};

// ─── Helpers ─────────────────────────────────────────────────
const replaceTags = (text, data) =>
  text.replace(/\{\{(\w+)\}\}/g, (_, k) => data[k] || `{{${k}}}`);

const toneColors = {
  neutral: { header: "#3B8BD4", light: "#E6F1FB" },
  info:    { header: "#7F77DD", light: "#EEEDFE" },
  warning: { header: "#BA7517", light: "#FAEEDA" },
  success: { header: "#1D9E75", light: "#E1F5EE" },
};

// ─── Email Preview ────────────────────────────────────────────
const EmailPreview = ({ stateId, config }) => {
  const tmpl  = TEMPLATES[stateId];
  const state = STATES.find(s => s.id === stateId);
  const tc    = toneColors[tmpl.tone];
  const d     = SAMPLE_DATA;

  const subj    = replaceTags(tmpl.subject, d);
  const headline= tmpl.headline;
  const body    = tmpl.body;

  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: 520, margin: "0 auto" }}>
      {/* Email chrome */}
      <div style={{ background: "#f0efeb", borderRadius: "10px 10px 0 0", padding: "10px 16px", fontSize: 11, color: "#888", borderBottom: "1px solid #ddd" }}>
        <div style={{ marginBottom: 3 }}><span style={{ color: "#bbb" }}>De: </span><strong>{config.sender_name}</strong> &lt;{config.sender_email}&gt;</div>
        <div style={{ marginBottom: 3 }}><span style={{ color: "#bbb" }}>Para: </span><strong>{d.client_name}</strong> &lt;cliente@empresa.com&gt;</div>
        <div><span style={{ color: "#bbb" }}>Asunto: </span><strong>{subj}</strong></div>
      </div>

      {/* Email body */}
      <div style={{ background: "#f5f4f0", padding: 16 }}>
        <div style={{ background: "#fff", borderRadius: 10, overflow: "hidden", border: "1px solid #e8e7e3" }}>

          {/* Header */}
          <div style={{ background: tc.header, padding: "28px 32px 24px" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 4 }}>
              {config.logo_text} <span style={{ fontWeight: 300, opacity: 0.7 }}>El Salvador</span>
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", letterSpacing: 1 }}>SOPORTE TÉCNICO ESPECIALIZADO</div>
          </div>

          {/* Status banner */}
          <div style={{ background: tc.light, padding: "14px 32px", borderBottom: `3px solid ${tc.header}`, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>{state.icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: tc.header }}>{state.label.toUpperCase()}</div>
              <div style={{ fontSize: 11, color: "#888" }}>Orden: <strong style={{ color: "#333" }}>{d.order_id}</strong></div>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: "28px 32px" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1f", marginBottom: 12 }}>{headline}</div>
            <div style={{ fontSize: 14, color: "#555", lineHeight: 1.7, marginBottom: 20 }}>
              Estimado/a <strong>{d.client_name}</strong>,
            </div>
            <div style={{ fontSize: 14, color: "#555", lineHeight: 1.7, marginBottom: 24 }}>{body}</div>

            {/* Order info card */}
            <div style={{ background: "#fafaf8", borderRadius: 8, padding: "16px 18px", marginBottom: 24, border: "1px solid #e8e7e3" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#999", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 10 }}>Detalle de su orden</div>
              {[
                ["Número de orden", d.order_id],
                ["Equipo",          d.equipment],
                ["Técnico",         d.technician],
                ["Fecha",           d.date],
              ].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #f0efeb", fontSize: 13 }}>
                  <span style={{ color: "#999" }}>{l}</span>
                  <span style={{ fontWeight: 600, color: "#333" }}>{v}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ display: "inline-block", background: tc.header, color: "#fff", padding: "13px 32px", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                {tmpl.cta} →
              </div>
            </div>

            <div style={{ fontSize: 12, color: "#aaa", lineHeight: 1.6 }}>
              Si tiene alguna consulta, puede responder a este correo o contactarnos al <strong style={{ color: "#555" }}>{config.phone}</strong>.
            </div>
          </div>

          {/* Footer */}
          <div style={{ background: "#1a1a1f", padding: "18px 32px", textAlign: "center" }}>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
              <strong style={{ color: "#fff" }}>{config.sender_name}</strong> — {config.website}
            </div>
            <div style={{ fontSize: 11, color: "#555" }}>
              {config.sender_email} | {config.phone}
            </div>
            <div style={{ fontSize: 10, color: "#444", marginTop: 8 }}>
              Este correo fue enviado automáticamente por el SGS · Por favor no responda directamente
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// ─── Toggle Switch ────────────────────────────────────────────
const Toggle = ({ value, onChange, label }) => (
  <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
    <div onClick={() => onChange(!value)} style={{
      width: 40, height: 22, borderRadius: 11, position: "relative", transition: "background 0.2s",
      background: value ? "#3B8BD4" : "#d0cfca", cursor: "pointer", flexShrink: 0,
    }}>
      <div style={{
        position: "absolute", top: 3, left: value ? 21 : 3,
        width: 16, height: 16, borderRadius: "50%", background: "#fff",
        transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      }} />
    </div>
    {label && <span style={{ fontSize: 13, color: "#555" }}>{label}</span>}
  </label>
);

const FieldLabel = ({ children }) => (
  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 }}>
    {children}
  </label>
);

const Input = ({ value, onChange, placeholder, type = "text" }) => (
  <input type={type} value={value} onChange={onChange} placeholder={placeholder}
    style={{ width: "100%", padding: "10px 13px", borderRadius: 9, border: "2px solid #e8e7e3", fontSize: 13, color: "#1a1a1f", outline: "none", boxSizing: "border-box", background: "#fafaf8", transition: "border 0.2s", fontFamily: "inherit" }}
    onFocus={e => e.target.style.borderColor = "#3B8BD4"}
    onBlur={e => e.target.style.borderColor = "#e8e7e3"} />
);

// ─── Notification Log ─────────────────────────────────────────
const NOTIF_LOG = [
  { id: 1, order: "OT-260001", client: "Juan Pérez", state: "reparado",    time: "Hoy, 11:05", status: "enviado" },
  { id: 2, order: "OT-260002", client: "María Rodríguez", state: "repuestos", time: "Hoy, 09:30", status: "enviado" },
  { id: 3, order: "OT-260003", client: "Luis Martínez", state: "entregado",  time: "Ayer, 16:45", status: "enviado" },
  { id: 4, order: "OT-260004", client: "Juan Pérez", state: "recibido",    time: "Ayer, 08:00", status: "enviado" },
  { id: 5, order: "OT-260005", client: "Ana García", state: "diagnostico", time: "Hace 2 días",  status: "fallido" },
];

// ─── Main Component ───────────────────────────────────────────
export default function NotificationsModule() {
  const [tab, setTab] = useState("config");          // config | preview | log
  const [previewState, setPreviewState] = useState("recibido");
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [saved, setSaved] = useState(false);
  const [testSent, setTestSent] = useState(false);

  const updateConfig = (field, value) => setConfig(p => ({ ...p, [field]: value }));
  const updateEnabled = (id, val) => setConfig(p => ({ ...p, enabled: { ...p.enabled, [id]: val } }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleTest = () => {
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  const tabs = [
    { id: "config",  label: "Configuración",   icon: "⚙️" },
    { id: "preview", label: "Vista previa",     icon: "👁" },
    { id: "log",     label: "Historial",        icon: "📋" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f5f4f0", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

      {/* Header */}
      <header style={{ background: "#1a1a1f", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>DTS</span>
          <span style={{ fontSize: 18, fontWeight: 300, color: "#3B8BD4" }}>SGS</span>
          <div style={{ width: 1, height: 20, background: "#333", margin: "0 4px" }} />
          <span style={{ fontSize: 11, color: "#666" }}>Notificaciones por correo</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handleTest} style={{ padding: "7px 16px", borderRadius: 8, border: "1px solid #333", background: testSent ? "#1D9E75" : "transparent", color: testSent ? "#fff" : "#aaa", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
            {testSent ? "✓ Enviado" : "Enviar prueba"}
          </button>
          <button onClick={handleSave} style={{ padding: "7px 16px", borderRadius: 8, border: "none", background: saved ? "#1D9E75" : "#3B8BD4", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
            {saved ? "✓ Guardado" : "Guardar cambios"}
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "0 24px", display: "flex", gap: 0 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "14px 20px", border: "none", background: "none", cursor: "pointer",
            fontSize: 13, fontWeight: tab === t.id ? 700 : 400,
            color: tab === t.id ? "#3B8BD4" : "#888",
            borderBottom: tab === t.id ? "2px solid #3B8BD4" : "2px solid transparent",
            transition: "all 0.15s", display: "flex", alignItems: "center", gap: 6,
          }}>
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 24px 60px" }}>

        {/* ═══ CONFIG TAB ════════════════════════════════════════ */}
        {tab === "config" && (
          <div style={{ display: "grid", gap: 16 }}>

            {/* Sender config */}
            <div style={{ background: "#fff", borderRadius: 14, padding: 22, border: "1px solid #eee" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1f", marginBottom: 16 }}>Remitente</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <FieldLabel>Nombre del remitente</FieldLabel>
                  <Input value={config.sender_name} onChange={e => updateConfig("sender_name", e.target.value)} placeholder="DTS El Salvador" />
                </div>
                <div>
                  <FieldLabel>Correo de envío</FieldLabel>
                  <Input value={config.sender_email} onChange={e => updateConfig("sender_email", e.target.value)} placeholder="soporte@dts.com.sv" />
                </div>
                <div>
                  <FieldLabel>Responder a (Reply-To)</FieldLabel>
                  <Input value={config.reply_to} onChange={e => updateConfig("reply_to", e.target.value)} placeholder="soporte@dts.com.sv" />
                </div>
                <div>
                  <FieldLabel>Teléfono en correo</FieldLabel>
                  <Input value={config.phone} onChange={e => updateConfig("phone", e.target.value)} placeholder="(503) 2222-0000" />
                </div>
                <div>
                  <FieldLabel>Sitio web</FieldLabel>
                  <Input value={config.website} onChange={e => updateConfig("website", e.target.value)} placeholder="www.dts.com.sv" />
                </div>
                <div>
                  <FieldLabel>Texto del logo</FieldLabel>
                  <Input value={config.logo_text} onChange={e => updateConfig("logo_text", e.target.value)} placeholder="DTS" />
                </div>
              </div>
              <div style={{ padding: "12px 14px", background: "#fafaf8", borderRadius: 9, marginTop: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: config.cc_admin ? 10 : 0 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>Copia al administrador (CC)</div>
                    <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>Recibir copia de cada notificación enviada</div>
                  </div>
                  <Toggle value={config.cc_admin} onChange={v => updateConfig("cc_admin", v)} />
                </div>
                {config.cc_admin && (
                  <Input value={config.cc_email} onChange={e => updateConfig("cc_email", e.target.value)} placeholder="admin@dts.com.sv" />
                )}
              </div>
            </div>

            {/* State toggles */}
            <div style={{ background: "#fff", borderRadius: 14, padding: 22, border: "1px solid #eee" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1f", marginBottom: 4 }}>Notificaciones por estado</div>
              <div style={{ fontSize: 12, color: "#999", marginBottom: 16 }}>Activa o desactiva el correo que se envía al cambiar a cada estado</div>
              <div style={{ display: "grid", gap: 8 }}>
                {STATES.map(s => (
                  <div key={s.id} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "14px 16px", borderRadius: 10,
                    background: config.enabled[s.id] ? s.bg : "#fafaf8",
                    border: `1px solid ${config.enabled[s.id] ? s.color + "40" : "#eee"}`,
                    transition: "all 0.2s",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 18 }}>{s.icon}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: config.enabled[s.id] ? s.color : "#888" }}>{s.label}</div>
                        <div style={{ fontSize: 11, color: "#bbb", marginTop: 1 }}>
                          Asunto: <em>{replaceTags(TEMPLATES[s.id].subject, { order_id: "OT-XXXX" })}</em>
                        </div>
                      </div>
                    </div>
                    <Toggle value={config.enabled[s.id]} onChange={v => updateEnabled(s.id, v)} />
                  </div>
                ))}
              </div>
            </div>

            {/* Variables reference */}
            <div style={{ background: "#fff", borderRadius: 14, padding: 22, border: "1px solid #eee" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1f", marginBottom: 12 }}>Variables disponibles en asuntos</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8 }}>
                {[
                  ["{{order_id}}",    "Número de orden"],
                  ["{{client_name}}", "Nombre del cliente"],
                  ["{{company}}",     "Empresa"],
                  ["{{equipment}}",   "Equipo"],
                  ["{{technician}}",  "Técnico asignado"],
                  ["{{date}}",        "Fecha del servicio"],
                ].map(([v, d]) => (
                  <div key={v} style={{ padding: "8px 12px", background: "#fafaf8", borderRadius: 8, border: "1px solid #eee" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#3B8BD4", fontFamily: "monospace" }}>{v}</div>
                    <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>{d}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ═══ PREVIEW TAB ══════════════════════════════════════ */}
        {tab === "preview" && (
          <div>
            <div style={{ background: "#fff", borderRadius: 14, padding: 16, border: "1px solid #eee", marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: "#999", marginBottom: 10, fontWeight: 600 }}>VISTA PREVIA DEL CORREO</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {STATES.map(s => (
                  <button key={s.id} onClick={() => setPreviewState(s.id)} style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "7px 14px", borderRadius: 20, cursor: "pointer",
                    border: previewState === s.id ? `2px solid ${s.color}` : "1px solid #ddd",
                    background: previewState === s.id ? s.bg : "#fff",
                    color: previewState === s.id ? s.color : "#888",
                    fontSize: 12, fontWeight: 600, transition: "all 0.15s",
                  }}>
                    <span>{s.icon}</span> {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid #eee", background: "#fff" }}>
              <EmailPreview stateId={previewState} config={config} />
            </div>
          </div>
        )}

        {/* ═══ LOG TAB ══════════════════════════════════════════ */}
        {tab === "log" && (
          <div>
            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
              {[
                { label: "Enviados hoy", value: "2", color: "#1D9E75" },
                { label: "Total este mes", value: "47", color: "#3B8BD4" },
                { label: "Fallidos",       value: "1", color: "#E24B4A" },
              ].map(s => (
                <div key={s.label} style={{ background: "#fff", borderRadius: 12, padding: "16px 18px", border: "1px solid #eee", borderLeft: `3px solid ${s.color}` }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Log table */}
            <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: "1px solid #eee" }}>
              <div style={{ padding: "14px 18px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1f" }}>Historial de notificaciones</div>
                <div style={{ fontSize: 12, color: "#bbb" }}>Últimas 30 notificaciones</div>
              </div>
              {NOTIF_LOG.map((n, i) => {
                const s = STATES.find(st => st.id === n.state);
                const failed = n.status === "fallido";
                return (
                  <div key={n.id} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "13px 18px", borderBottom: i < NOTIF_LOG.length - 1 ? "1px solid #f5f4f0" : "none",
                    transition: "background 0.1s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fafaf8"}
                    onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 9, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                        {s.icon}
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#3B8BD4" }}>{n.order}</span>
                          <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 6, background: s.bg, color: s.color, fontWeight: 600 }}>{s.label}</span>
                        </div>
                        <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>Para: {n.client}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6, display: "inline-block", marginBottom: 4, background: failed ? "#FCEBEB" : "#E1F5EE", color: failed ? "#A32D2D" : "#0F6E56" }}>
                        {failed ? "✗ Fallido" : "✓ Enviado"}
                      </div>
                      <div style={{ fontSize: 11, color: "#bbb" }}>{n.time}</div>
                      {failed && (
                        <button style={{ fontSize: 11, color: "#3B8BD4", background: "none", border: "none", cursor: "pointer", padding: 0, marginTop: 2, fontWeight: 600 }}>
                          Reintentar →
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Info note */}
            <div style={{ marginTop: 16, padding: "14px 18px", background: "#E6F1FB", borderRadius: 12, border: "1px solid #85B7EB" }}>
              <div style={{ fontSize: 13, color: "#185FA5", fontWeight: 600, marginBottom: 4 }}>¿Cómo funciona en producción?</div>
              <div style={{ fontSize: 12, color: "#555", lineHeight: 1.6 }}>
                Cada vez que un técnico cambia el estado de una orden en el back-office, el SGS llama automáticamente al servicio de correo (Resend o SendGrid) con la plantilla correspondiente. El cliente recibe el correo en menos de 30 segundos con el enlace de tracking directo a su orden.
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
