"use client";
import { useState, useRef, useEffect } from "react";

const CLIENTS_DB = [
  { id: 1, name: "Banco Agrícola", contact: "Juan Pérez", email: "jperez@bancoagricola.com", phone: "(503) 2212-0000", address: "Blvd. Constitución, San Salvador", orders: 8 },
  { id: 2, name: "Grupo Calleja", contact: "María Rodríguez", email: "mrodriguez@grupocalleja.com", phone: "(503) 2243-1000", address: "Col. Escalón, San Salvador", orders: 5 },
  { id: 3, name: "AES El Salvador", contact: "Luis Martínez", email: "lmartinez@aes.com.sv", phone: "(503) 2250-5000", address: "Blvd. del Hipódromo, Antiguo Cuscatlán", orders: 12 },
  { id: 4, name: "Digicel El Salvador", contact: "Ana García", email: "agarcia@digicel.com.sv", phone: "(503) 2510-2000", address: "63 Av. Sur, San Salvador", orders: 3 },
  { id: 5, name: "Laboratorios Vijosa", contact: "Roberto Hernández", email: "rhernandez@vijosa.com", phone: "(503) 2231-3000", address: "Zona Industrial, Soyapango", orders: 6 },
  { id: 6, name: "Industrias La Constancia", contact: "Carmen Flores", email: "cflores@laconstancia.com", phone: "(503) 2231-9000", address: "Blvd. del Ejército, San Salvador", orders: 4 },
  { id: 7, name: "TIGO El Salvador", contact: "Fernando López", email: "flopez@tigo.com.sv", phone: "(503) 2500-5000", address: "Alameda Roosevelt, San Salvador", orders: 7 },
];

const EQUIPMENT_TYPES = [
  { id: "laptop", label: "Laptop", icon: "💻" },
  { id: "desktop", label: "Desktop", icon: "🖥️" },
  { id: "impresora", label: "Impresora", icon: "🖨️" },
  { id: "servidor", label: "Servidor", icon: "⚙️" },
  { id: "switch", label: "Switch de red", icon: "🔌" },
  { id: "router", label: "Router", icon: "📡" },
  { id: "ups", label: "UPS", icon: "🔋" },
  { id: "scanner", label: "Scanner", icon: "📠" },
  { id: "monitor", label: "Monitor", icon: "🖥️" },
  { id: "access_point", label: "Access Point", icon: "📶" },
  { id: "nas", label: "NAS / Storage", icon: "💾" },
  { id: "otro", label: "Otro", icon: "📦" },
];

const BRANDS = ["Dell", "HP", "Lenovo", "Cisco", "APC", "Epson", "Canon", "Brother", "Samsung", "LG", "Ubiquiti", "MikroTik", "Synology", "QNAP", "Otro"];

const COMMON_FAULTS = {
  laptop: ["No enciende", "Pantalla dañada", "Batería no carga", "Sobrecalentamiento", "Teclado no funciona", "Lenta / rendimiento bajo", "Sin conexión WiFi", "Disco duro dañado"],
  desktop: ["No enciende", "Pantalla azul / BSOD", "Lenta / rendimiento bajo", "Ruido excesivo", "No detecta disco", "Fuente de poder dañada", "Sin video", "Puerto USB dañado"],
  impresora: ["No imprime", "Atascos de papel", "Manchas en impresión", "Error de conexión", "Tóner / tinta agotado", "Ruido anormal", "No alimenta papel", "Impresión borrosa"],
  servidor: ["No enciende", "Error de RAID", "Disco duro dañado", "Sobrecalentamiento", "Error de memoria", "Fuente de poder fallando", "Rendimiento degradado", "Error de red"],
  ups: ["No enciende", "No mantiene carga", "Baterías agotadas", "Alarma constante", "No regula voltaje", "Bypass activado", "Ventilador ruidoso", "Display con error"],
  switch: ["Sin conectividad", "Puertos dañados", "Reinicio constante", "Configuración perdida", "Sobrecalentamiento", "Velocidad reducida", "PoE no funciona"],
  router: ["Sin internet", "Reinicio constante", "WiFi débil", "Configuración perdida", "Puertos dañados", "Firmware corrupto", "DNS no resuelve"],
  default: ["No enciende", "No funciona correctamente", "Daño físico", "Error de software", "Problema de conectividad", "Ruido anormal", "Otro"],
};

const PRIORITIES = [
  { id: "alta", label: "Alta", color: "#E24B4A", bg: "#FCEBEB", desc: "Requiere atención inmediata" },
  { id: "media", label: "Media", color: "#BA7517", bg: "#FAEEDA", desc: "Resolver en 24-48 horas" },
  { id: "baja", label: "Baja", color: "#1D9E75", bg: "#E1F5EE", desc: "Sin urgencia definida" },
];

const generateOrderId = () => {
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `OT-26${num}`;
};

const FieldLabel = ({ children, required }) => (
  <label style={{
    display: "block", fontSize: 11, fontWeight: 700, color: "#888",
    letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6,
  }}>
    {children} {required && <span style={{ color: "#E24B4A" }}>*</span>}
  </label>
);

const TextInput = ({ value, onChange, placeholder, multiline, ...props }) => {
  const s = {
    width: "100%", padding: "11px 14px", borderRadius: 10,
    border: "2px solid #e8e7e3", fontSize: 14, color: "#1a1a1f",
    outline: "none", transition: "border 0.2s", boxSizing: "border-box",
    background: "#fafaf8", fontFamily: "inherit", resize: "vertical",
  };
  const handlers = {
    onFocus: (e) => (e.target.style.borderColor = "#3B8BD4"),
    onBlur: (e) => (e.target.style.borderColor = "#e8e7e3"),
  };
  return multiline
    ? <textarea value={value} onChange={onChange} placeholder={placeholder} rows={3} style={s} {...handlers} {...props} />
    : <input type="text" value={value} onChange={onChange} placeholder={placeholder} style={s} {...handlers} {...props} />;
};

export default function OrderIntake() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [generatedOrder, setGeneratedOrder] = useState(null);

  // Client search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isNewClient, setIsNewClient] = useState(false);
  const searchRef = useRef(null);

  // New client form
  const [newClient, setNewClient] = useState({ name: "", contact: "", email: "", phone: "", address: "" });

  // Equipment
  const [equipment, setEquipment] = useState({
    type: null, brand: "", model: "", serial: "", customType: "",
    accessories: [],
    newAccessory: "",
    physicalCondition: "bueno",
    conditionNotes: "",
  });

  // Fault & service
  const [fault, setFault] = useState({
    selectedFaults: [],
    customFault: "",
    description: "",
    serviceType: null,
    priority: "media",
    scheduledDate: "",
    scheduledTime: "",
    visitAddress: "",
    technician: null,
  });

  const TECNICOS = [
    { id: 1, name: "Carlos Méndez", specialty: "HVAC", avatar: "CM", color: "#3B8BD4" },
    { id: 2, name: "Roberto García", specialty: "Eléctrico", avatar: "RG", color: "#7F77DD" },
    { id: 3, name: "Ana Martínez", specialty: "Redes", avatar: "AM", color: "#1D9E75" },
    { id: 4, name: "Luis Portillo", specialty: "Hardware", avatar: "LP", color: "#D85A30" },
  ];

  // Search logic
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const q = searchQuery.toLowerCase();
    const results = CLIENTS_DB.filter(
      (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.contact.toLowerCase().includes(q) || c.phone.includes(q)
    );
    setSearchResults(results);
    setShowResults(true);
  }, [searchQuery]);

  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowResults(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectClient = (client) => {
    setSelectedClient(client);
    setSearchQuery("");
    setShowResults(false);
    setIsNewClient(false);
  };

  const startNewClient = () => {
    setIsNewClient(true);
    setSelectedClient(null);
    setShowResults(false);
    setNewClient({ name: searchQuery, contact: "", email: "", phone: "", address: "" });
  };

  const getFaults = () => {
    if (!equipment.type) return COMMON_FAULTS.default;
    return COMMON_FAULTS[equipment.type] || COMMON_FAULTS.default;
  };

  const toggleFault = (f) => {
    setFault((prev) => ({
      ...prev,
      selectedFaults: prev.selectedFaults.includes(f)
        ? prev.selectedFaults.filter((x) => x !== f)
        : [...prev.selectedFaults, f],
    }));
  };

  const addAccessory = () => {
    if (!equipment.newAccessory.trim()) return;
    setEquipment((p) => ({
      ...p,
      accessories: [...p.accessories, p.newAccessory.trim()],
      newAccessory: "",
    }));
  };

  const removeAccessory = (i) => {
    setEquipment((p) => ({ ...p, accessories: p.accessories.filter((_, idx) => idx !== i) }));
  };

  const canAdvance = () => {
    if (step === 0) return selectedClient || (isNewClient && newClient.name.trim() && newClient.contact.trim());
    if (step === 1) return equipment.type && equipment.brand;
    if (step === 2) return (fault.selectedFaults.length > 0 || fault.description.trim()) && fault.serviceType && fault.technician;
    return true;
  };

  const handleSubmit = () => {
    const orderId = generateOrderId();
    const client = selectedClient || { name: newClient.name, contact: newClient.contact, email: newClient.email, phone: newClient.phone, address: newClient.address };
    const eqType = EQUIPMENT_TYPES.find((e) => e.id === equipment.type);
    setGeneratedOrder({
      orderId,
      date: new Date().toLocaleDateString("es-SV", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      client,
      equipment: { ...equipment, typeName: eqType?.label || equipment.customType, typeIcon: eqType?.icon || "📦" },
      fault,
      technicianObj: TECNICOS.find((t) => t.id === fault.technician),
    });
    setSubmitted(true);
  };

  const steps = [
    { title: "Cliente", subtitle: "Buscar o crear" },
    { title: "Equipo", subtitle: "Datos del producto" },
    { title: "Falla y servicio", subtitle: "Tipo de orden" },
  ];

  // ========= SUBMITTED VIEW =========
  if (submitted && generatedOrder) {
    const o = generatedOrder;
    const priorityObj = PRIORITIES.find((p) => p.id === o.fault.priority);
    return (
      <div style={{ minHeight: "100vh", background: "#f5f4f0", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
        <header style={{ background: "#1a1a1f", padding: "14px 20px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>DTS</span>
          <span style={{ fontSize: 18, fontWeight: 300, color: "#3B8BD4" }}>SGS</span>
          <div style={{ width: 1, height: 20, background: "#333", margin: "0 4px" }} />
          <span style={{ fontSize: 11, color: "#666" }}>Orden generada</span>
        </header>

        <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 20px 40px" }}>

          {/* Success banner */}
          <div style={{
            background: "#1D9E75", borderRadius: 16, padding: "28px 24px", marginBottom: 20,
            textAlign: "center", color: "#fff",
          }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>✓</div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>Orden creada exitosamente</div>
            <div style={{
              fontSize: 32, fontWeight: 800, marginTop: 8, letterSpacing: 1,
              background: "rgba(255,255,255,0.2)", display: "inline-block",
              padding: "6px 24px", borderRadius: 10,
            }}>{o.orderId}</div>
            <div style={{ fontSize: 12, marginTop: 10, opacity: 0.8 }}>{o.date}</div>
          </div>

          {/* Order ticket */}
          <div style={{
            background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #eee",
            marginBottom: 20,
          }}>
            {/* Type banner */}
            <div style={{
              padding: "14px 20px",
              background: o.fault.serviceType === "taller" ? "#EEEDFE" : "#E6F1FB",
              borderBottom: "1px solid #eee",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>{o.fault.serviceType === "taller" ? "🏭" : "🚐"}</span>
                <div>
                  <div style={{
                    fontSize: 14, fontWeight: 700,
                    color: o.fault.serviceType === "taller" ? "#534AB7" : "#185FA5",
                  }}>
                    {o.fault.serviceType === "taller" ? "Reparación en taller" : "Visita en campo"}
                  </div>
                  <div style={{ fontSize: 11, color: "#999", marginTop: 1 }}>
                    {o.fault.serviceType === "taller" ? "El equipo queda en nuestras instalaciones" : `Programada: ${o.fault.scheduledDate || "Por definir"}`}
                  </div>
                </div>
              </div>
              <div style={{
                padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                background: priorityObj.bg, color: priorityObj.color,
              }}>
                {priorityObj.label}
              </div>
            </div>

            {/* Client */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0efeb" }}>
              <div style={{ fontSize: 10, color: "#bbb", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Cliente</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1f" }}>{o.client.name || o.client.contact}</div>
              <div style={{ fontSize: 13, color: "#666", marginTop: 2 }}>{o.client.contact}{o.client.email ? ` — ${o.client.email}` : ""}</div>
              {o.client.phone && <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>{o.client.phone}</div>}
            </div>

            {/* Equipment */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0efeb" }}>
              <div style={{ fontSize: 10, color: "#bbb", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Equipo</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10, background: "#E6F1FB",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                }}>{o.equipment.typeIcon}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1f" }}>
                    {o.equipment.typeName} {o.equipment.brand}
                  </div>
                  <div style={{ fontSize: 13, color: "#666" }}>
                    {o.equipment.model}{o.equipment.serial ? ` — S/N: ${o.equipment.serial}` : ""}
                  </div>
                </div>
              </div>
              {o.equipment.accessories.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ fontSize: 11, color: "#999", marginBottom: 4 }}>Accesorios recibidos:</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {o.equipment.accessories.map((a, i) => (
                      <span key={i} style={{
                        padding: "3px 10px", borderRadius: 6, background: "#fafaf8",
                        border: "1px solid #eee", fontSize: 12, color: "#666",
                      }}>{a}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Fault */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0efeb" }}>
              <div style={{ fontSize: 10, color: "#bbb", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Falla reportada</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: o.fault.description ? 10 : 0 }}>
                {o.fault.selectedFaults.map((f, i) => (
                  <span key={i} style={{
                    padding: "4px 12px", borderRadius: 8, background: "#FCEBEB",
                    color: "#A32D2D", fontSize: 12, fontWeight: 600,
                  }}>{f}</span>
                ))}
              </div>
              {o.fault.description && (
                <div style={{ fontSize: 13, color: "#555", lineHeight: 1.5, background: "#fafaf8", padding: "10px 14px", borderRadius: 8 }}>
                  {o.fault.description}
                </div>
              )}
            </div>

            {/* Technician */}
            <div style={{ padding: "16px 20px" }}>
              <div style={{ fontSize: 10, color: "#bbb", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Técnico asignado</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: `${o.technicianObj.color}18`, color: o.technicianObj.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700,
                }}>{o.technicianObj.avatar}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#333" }}>{o.technicianObj.name}</div>
                  <div style={{ fontSize: 12, color: "#999" }}>{o.technicianObj.specialty}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            <button style={{
              padding: "14px", borderRadius: 12, border: "1px solid #ddd",
              background: "#fff", color: "#555", fontSize: 13, fontWeight: 600,
              cursor: "pointer", textAlign: "center",
            }}>
              🖨️ Imprimir orden
            </button>
            <button style={{
              padding: "14px", borderRadius: 12, border: "1px solid #ddd",
              background: "#fff", color: "#555", fontSize: 13, fontWeight: 600,
              cursor: "pointer", textAlign: "center",
            }}>
              📧 Enviar al cliente
            </button>
          </div>

          <button onClick={() => {
            setSubmitted(false);
            setStep(0);
            setSelectedClient(null);
            setIsNewClient(false);
            setSearchQuery("");
            setNewClient({ name: "", contact: "", email: "", phone: "", address: "" });
            setEquipment({ type: null, brand: "", model: "", serial: "", customType: "", accessories: [], newAccessory: "", physicalCondition: "bueno", conditionNotes: "" });
            setFault({ selectedFaults: [], customFault: "", description: "", serviceType: null, priority: "media", scheduledDate: "", scheduledTime: "", visitAddress: "", technician: null });
          }}
            style={{
              width: "100%", padding: "14px", borderRadius: 12, border: "none",
              background: "#3B8BD4", color: "#fff", fontSize: 15, fontWeight: 700,
              cursor: "pointer",
            }}>
            + Nueva orden de ingreso
          </button>
        </div>
      </div>
    );
  }

  // ========= FORM VIEW =========
  return (
    <div style={{ minHeight: "100vh", background: "#f5f4f0", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      {/* Header */}
      <header style={{
        background: "#1a1a1f", padding: "14px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>DTS</span>
          <span style={{ fontSize: 18, fontWeight: 300, color: "#3B8BD4" }}>SGS</span>
          <div style={{ width: 1, height: 20, background: "#333", margin: "0 4px" }} />
          <span style={{ fontSize: 11, color: "#666" }}>Ingreso de orden</span>
        </div>
      </header>

      {/* Step Progress */}
      <div style={{ background: "#fff", padding: "16px 20px", borderBottom: "1px solid #eee" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0, maxWidth: 400, margin: "0 auto" }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{ textAlign: "center", flex: 1 }}>
                <div onClick={() => i <= step && setStep(i)} style={{
                  width: 28, height: 28, borderRadius: "50%", margin: "0 auto",
                  background: i < step ? "#1D9E75" : i === step ? "#3B8BD4" : "#e8e7e3",
                  color: i <= step ? "#fff" : "#bbb",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700,
                  cursor: i <= step ? "pointer" : "default", transition: "all 0.2s",
                }}>{i < step ? "✓" : i + 1}</div>
                <div style={{ fontSize: 10, marginTop: 3, fontWeight: i === step ? 700 : 400, color: i === step ? "#3B8BD4" : "#bbb" }}>{s.title}</div>
              </div>
              {i < steps.length - 1 && (
                <div style={{ height: 2, flex: 1, minWidth: 20, borderRadius: 1, background: i < step ? "#1D9E75" : "#e8e7e3", transition: "background 0.3s" }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 20px 100px" }}>

        {/* ===== STEP 0: CLIENTE ===== */}
        {step === 0 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#3B8BD4", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>1</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1f" }}>Datos del cliente</div>
                <div style={{ fontSize: 12, color: "#999" }}>Busque por nombre, correo o teléfono</div>
              </div>
            </div>

            {/* Search */}
            {!selectedClient && !isNewClient && (
              <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #eee", marginBottom: 16 }} ref={searchRef}>
                <FieldLabel>Buscar cliente</FieldLabel>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: "#ccc", pointerEvents: "none" }}>🔍</div>
                  <input type="text" value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.trim() && setShowResults(true)}
                    placeholder="Nombre, correo o teléfono..."
                    style={{
                      width: "100%", padding: "12px 14px 12px 42px", borderRadius: 10,
                      border: "2px solid #e8e7e3", fontSize: 14, color: "#1a1a1f",
                      outline: "none", boxSizing: "border-box", background: "#fafaf8",
                      transition: "border 0.2s",
                    }}
                    onFocuCapture={(e) => (e.target.style.borderColor = "#3B8BD4")}
                  />

                  {showResults && (
                    <div style={{
                      position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
                      background: "#fff", borderRadius: 12, border: "1px solid #eee",
                      boxShadow: "0 12px 40px rgba(0,0,0,0.1)", zIndex: 20,
                      maxHeight: 300, overflow: "auto",
                    }}>
                      {searchResults.map((c) => (
                        <div key={c.id} onClick={() => selectClient(c)}
                          style={{
                            padding: "14px 16px", cursor: "pointer",
                            borderBottom: "1px solid #f5f4f0", transition: "background 0.1s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#fafaf8")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1f" }}>{c.name}</div>
                          <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{c.contact} — {c.email}</div>
                          <div style={{ fontSize: 11, color: "#bbb", marginTop: 1 }}>{c.phone} · {c.orders} órdenes previas</div>
                        </div>
                      ))}
                      {searchResults.length === 0 && searchQuery.trim() && (
                        <div style={{ padding: "20px 16px", textAlign: "center" }}>
                          <div style={{ fontSize: 13, color: "#999", marginBottom: 10 }}>No se encontraron clientes</div>
                          <button onClick={startNewClient} style={{
                            padding: "8px 20px", borderRadius: 8, border: "none",
                            background: "#3B8BD4", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
                          }}>+ Registrar nuevo cliente</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {!searchQuery.trim() && (
                  <div style={{ textAlign: "center", marginTop: 20 }}>
                    <div style={{ fontSize: 13, color: "#ccc", marginBottom: 12 }}>o bien</div>
                    <button onClick={startNewClient} style={{
                      padding: "10px 24px", borderRadius: 10, border: "1px dashed #ccc",
                      background: "transparent", color: "#3B8BD4", fontSize: 13, fontWeight: 600,
                      cursor: "pointer", width: "100%",
                    }}>+ Registrar cliente nuevo</button>
                  </div>
                )}
              </div>
            )}

            {/* Selected client card */}
            {selectedClient && (
              <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: "2px solid #3B8BD4", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%", background: "#E6F1FB",
                      color: "#3B8BD4", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 16, fontWeight: 700,
                    }}>{selectedClient.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}</div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1f" }}>{selectedClient.name}</div>
                      <div style={{ fontSize: 13, color: "#666", marginTop: 2 }}>{selectedClient.contact}</div>
                    </div>
                  </div>
                  <button onClick={() => { setSelectedClient(null); setSearchQuery(""); }}
                    style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid #ddd", background: "#fff", color: "#999", fontSize: 12, cursor: "pointer" }}>
                    Cambiar
                  </button>
                </div>
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1,
                  background: "#f0efeb", borderRadius: 10, overflow: "hidden", marginTop: 14,
                }}>
                  {[
                    { l: "Correo", v: selectedClient.email },
                    { l: "Teléfono", v: selectedClient.phone },
                    { l: "Dirección", v: selectedClient.address },
                    { l: "Órdenes previas", v: `${selectedClient.orders} servicios` },
                  ].map((f, i) => (
                    <div key={i} style={{ padding: "10px 12px", background: "#fff" }}>
                      <div style={{ fontSize: 10, color: "#bbb", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4 }}>{f.l}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#555", marginTop: 2 }}>{f.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New client form */}
            {isNewClient && (
              <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: "2px solid #1D9E75", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#0F6E56" }}>Nuevo cliente</div>
                  <button onClick={() => { setIsNewClient(false); setSearchQuery(""); }}
                    style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid #ddd", background: "#fff", color: "#999", fontSize: 12, cursor: "pointer" }}>
                    Cancelar
                  </button>
                </div>
                <div style={{ display: "grid", gap: 12 }}>
                  <div>
                    <FieldLabel required>Nombre / Empresa</FieldLabel>
                    <TextInput value={newClient.name} onChange={(e) => setNewClient((p) => ({ ...p, name: e.target.value }))} placeholder="Nombre de la empresa o persona" />
                  </div>
                  <div>
                    <FieldLabel required>Contacto</FieldLabel>
                    <TextInput value={newClient.contact} onChange={(e) => setNewClient((p) => ({ ...p, contact: e.target.value }))} placeholder="Nombre del contacto principal" />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div>
                      <FieldLabel>Correo</FieldLabel>
                      <TextInput value={newClient.email} onChange={(e) => setNewClient((p) => ({ ...p, email: e.target.value }))} placeholder="correo@empresa.com" />
                    </div>
                    <div>
                      <FieldLabel>Teléfono</FieldLabel>
                      <TextInput value={newClient.phone} onChange={(e) => setNewClient((p) => ({ ...p, phone: e.target.value }))} placeholder="(503) 0000-0000" />
                    </div>
                  </div>
                  <div>
                    <FieldLabel>Dirección</FieldLabel>
                    <TextInput value={newClient.address} onChange={(e) => setNewClient((p) => ({ ...p, address: e.target.value }))} placeholder="Dirección del cliente" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== STEP 1: EQUIPO ===== */}
        {step === 1 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#3B8BD4", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>2</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1f" }}>Datos del equipo</div>
                <div style={{ fontSize: 12, color: "#999" }}>Seleccione el tipo de producto</div>
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #eee", marginBottom: 16 }}>
              <FieldLabel required>Tipo de equipo</FieldLabel>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
                {EQUIPMENT_TYPES.map((eq) => (
                  <button key={eq.id} onClick={() => setEquipment((p) => ({ ...p, type: eq.id }))}
                    style={{
                      padding: "14px 8px", borderRadius: 10, cursor: "pointer", textAlign: "center",
                      border: equipment.type === eq.id ? "2px solid #3B8BD4" : "2px solid #e8e7e3",
                      background: equipment.type === eq.id ? "#E6F1FB" : "#fafaf8",
                      transition: "all 0.15s",
                    }}>
                    <div style={{ fontSize: 24, marginBottom: 4 }}>{eq.icon}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: equipment.type === eq.id ? "#185FA5" : "#888" }}>{eq.label}</div>
                  </button>
                ))}
              </div>

              {equipment.type === "otro" && (
                <div style={{ marginBottom: 14 }}>
                  <FieldLabel required>Especifique el tipo</FieldLabel>
                  <TextInput value={equipment.customType} onChange={(e) => setEquipment((p) => ({ ...p, customType: e.target.value }))} placeholder="Tipo de equipo" />
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                <div>
                  <FieldLabel required>Marca</FieldLabel>
                  <select value={equipment.brand} onChange={(e) => setEquipment((p) => ({ ...p, brand: e.target.value }))}
                    style={{
                      width: "100%", padding: "11px 14px", borderRadius: 10,
                      border: "2px solid #e8e7e3", fontSize: 14, color: equipment.brand ? "#1a1a1f" : "#bbb",
                      outline: "none", boxSizing: "border-box", background: "#fafaf8", appearance: "auto",
                    }}>
                    <option value="">Seleccionar</option>
                    {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <FieldLabel>Modelo</FieldLabel>
                  <TextInput value={equipment.model} onChange={(e) => setEquipment((p) => ({ ...p, model: e.target.value }))} placeholder="Ej: ProDesk 400 G7" />
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <FieldLabel>Número de serie</FieldLabel>
                <TextInput value={equipment.serial} onChange={(e) => setEquipment((p) => ({ ...p, serial: e.target.value }))} placeholder="S/N del equipo (si disponible)" />
              </div>
            </div>

            {/* Accessories */}
            <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #eee", marginBottom: 16 }}>
              <FieldLabel>Accesorios recibidos</FieldLabel>
              {equipment.accessories.length > 0 && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                  {equipment.accessories.map((a, i) => (
                    <span key={i} style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      padding: "5px 10px", borderRadius: 8, background: "#E6F1FB",
                      color: "#185FA5", fontSize: 12, fontWeight: 600,
                    }}>
                      {a}
                      <span onClick={() => removeAccessory(i)} style={{ cursor: "pointer", opacity: 0.5, fontSize: 14 }}>×</span>
                    </span>
                  ))}
                </div>
              )}
              <div style={{ display: "flex", gap: 8 }}>
                <TextInput value={equipment.newAccessory}
                  onChange={(e) => setEquipment((p) => ({ ...p, newAccessory: e.target.value }))}
                  placeholder="Ej: Cargador, mouse, cable de red..."
                  onKeyDown={(e) => e.key === "Enter" && addAccessory()} />
                <button onClick={addAccessory} style={{
                  padding: "0 16px", borderRadius: 10, border: "none",
                  background: "#3B8BD4", color: "#fff", fontSize: 18, cursor: "pointer", flexShrink: 0,
                }}>+</button>
              </div>
            </div>

            {/* Physical condition */}
            <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #eee" }}>
              <FieldLabel>Condición física del equipo</FieldLabel>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 12 }}>
                {[
                  { id: "bueno", label: "Bueno", emoji: "✅" },
                  { id: "desgaste", label: "Con desgaste", emoji: "⚠️" },
                  { id: "danado", label: "Daño visible", emoji: "❌" },
                ].map((c) => (
                  <button key={c.id} onClick={() => setEquipment((p) => ({ ...p, physicalCondition: c.id }))}
                    style={{
                      padding: "12px 8px", borderRadius: 10, cursor: "pointer", textAlign: "center",
                      border: equipment.physicalCondition === c.id ? "2px solid #3B8BD4" : "2px solid #e8e7e3",
                      background: equipment.physicalCondition === c.id ? "#E6F1FB" : "#fafaf8",
                      transition: "all 0.15s",
                    }}>
                    <div style={{ fontSize: 18 }}>{c.emoji}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: equipment.physicalCondition === c.id ? "#185FA5" : "#888", marginTop: 4 }}>{c.label}</div>
                  </button>
                ))}
              </div>
              {equipment.physicalCondition !== "bueno" && (
                <div>
                  <FieldLabel>Detalle de la condición</FieldLabel>
                  <TextInput multiline value={equipment.conditionNotes}
                    onChange={(e) => setEquipment((p) => ({ ...p, conditionNotes: e.target.value }))}
                    placeholder="Describa golpes, rayones, partes faltantes..." />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== STEP 2: FALLA Y SERVICIO ===== */}
        {step === 2 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#3B8BD4", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>3</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1f" }}>Falla y tipo de servicio</div>
                <div style={{ fontSize: 12, color: "#999" }}>Describa el problema y asigne</div>
              </div>
            </div>

            {/* Faults */}
            <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #eee", marginBottom: 16 }}>
              <FieldLabel required>Falla reportada por el cliente</FieldLabel>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                {getFaults().map((f) => (
                  <button key={f} onClick={() => toggleFault(f)}
                    style={{
                      padding: "6px 14px", borderRadius: 20, cursor: "pointer",
                      border: fault.selectedFaults.includes(f) ? "2px solid #E24B4A" : "1px solid #ddd",
                      background: fault.selectedFaults.includes(f) ? "#FCEBEB" : "#fff",
                      color: fault.selectedFaults.includes(f) ? "#A32D2D" : "#666",
                      fontSize: 12, fontWeight: 600, transition: "all 0.15s",
                    }}>{f}</button>
                ))}
              </div>
              <FieldLabel>Descripción adicional de la falla</FieldLabel>
              <TextInput multiline value={fault.description}
                onChange={(e) => setFault((p) => ({ ...p, description: e.target.value }))}
                placeholder="Detalle la falla reportada por el cliente..." />
            </div>

            {/* Service type */}
            <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #eee", marginBottom: 16 }}>
              <FieldLabel required>Tipo de servicio</FieldLabel>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                {[
                  { id: "taller", label: "Reparación en taller", icon: "🏭", desc: "El equipo se queda aquí", color: "#534AB7", bg: "#EEEDFE" },
                  { id: "campo", label: "Visita en campo", icon: "🚐", desc: "Técnico va al sitio", color: "#185FA5", bg: "#E6F1FB" },
                ].map((t) => (
                  <button key={t.id} onClick={() => setFault((p) => ({ ...p, serviceType: t.id }))}
                    style={{
                      padding: "18px 14px", borderRadius: 12, cursor: "pointer", textAlign: "center",
                      border: fault.serviceType === t.id ? `2px solid ${t.color}` : "2px solid #e8e7e3",
                      background: fault.serviceType === t.id ? t.bg : "#fafaf8",
                      transition: "all 0.15s",
                    }}>
                    <div style={{ fontSize: 28, marginBottom: 6 }}>{t.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: fault.serviceType === t.id ? t.color : "#555" }}>{t.label}</div>
                    <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>{t.desc}</div>
                  </button>
                ))}
              </div>

              {fault.serviceType === "campo" && (
                <div style={{ background: "#fafaf8", borderRadius: 10, padding: 14, marginBottom: 14 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                    <div>
                      <FieldLabel>Fecha programada</FieldLabel>
                      <input type="date" value={fault.scheduledDate}
                        onChange={(e) => setFault((p) => ({ ...p, scheduledDate: e.target.value }))}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e8e7e3", fontSize: 13, boxSizing: "border-box", background: "#fff" }} />
                    </div>
                    <div>
                      <FieldLabel>Hora</FieldLabel>
                      <input type="time" value={fault.scheduledTime}
                        onChange={(e) => setFault((p) => ({ ...p, scheduledTime: e.target.value }))}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e8e7e3", fontSize: 13, boxSizing: "border-box", background: "#fff" }} />
                    </div>
                  </div>
                  <FieldLabel>Dirección de la visita</FieldLabel>
                  <TextInput value={fault.visitAddress}
                    onChange={(e) => setFault((p) => ({ ...p, visitAddress: e.target.value }))}
                    placeholder={selectedClient?.address || "Dirección del sitio"} />
                </div>
              )}

              {/* Priority */}
              <FieldLabel>Prioridad</FieldLabel>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {PRIORITIES.map((p) => (
                  <button key={p.id} onClick={() => setFault((prev) => ({ ...prev, priority: p.id }))}
                    style={{
                      padding: "12px 8px", borderRadius: 10, cursor: "pointer", textAlign: "center",
                      border: fault.priority === p.id ? `2px solid ${p.color}` : "2px solid #e8e7e3",
                      background: fault.priority === p.id ? p.bg : "#fafaf8",
                      transition: "all 0.15s",
                    }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: p.color, margin: "0 auto 6px" }} />
                    <div style={{ fontSize: 12, fontWeight: 700, color: fault.priority === p.id ? p.color : "#888" }}>{p.label}</div>
                    <div style={{ fontSize: 9, color: "#bbb", marginTop: 2 }}>{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Technician */}
            <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #eee" }}>
              <FieldLabel required>Asignar técnico</FieldLabel>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {TECNICOS.map((t) => (
                  <button key={t.id} onClick={() => setFault((p) => ({ ...p, technician: t.id }))}
                    style={{
                      padding: "14px", borderRadius: 10, cursor: "pointer",
                      border: fault.technician === t.id ? `2px solid ${t.color}` : "2px solid #e8e7e3",
                      background: fault.technician === t.id ? `${t.color}10` : "#fafaf8",
                      display: "flex", alignItems: "center", gap: 10, transition: "all 0.15s",
                    }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: `${t.color}18`, color: t.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, fontWeight: 700, flexShrink: 0,
                    }}>{t.avatar}</div>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: fault.technician === t.id ? t.color : "#555" }}>{t.name}</div>
                      <div style={{ fontSize: 11, color: "#999" }}>{t.specialty}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "#fff", borderTop: "1px solid #eee",
        padding: "12px 20px", display: "flex", justifyContent: "space-between",
        alignItems: "center", zIndex: 50,
      }}>
        <button onClick={() => setStep((p) => Math.max(0, p - 1))} disabled={step === 0}
          style={{
            padding: "10px 20px", borderRadius: 10, border: "1px solid #ddd",
            background: "#fff", color: step === 0 ? "#ddd" : "#555",
            fontSize: 14, fontWeight: 600, cursor: step === 0 ? "default" : "pointer",
          }}>← Anterior</button>
        <div style={{ fontSize: 12, color: "#bbb" }}>{step + 1} de {steps.length}</div>
        {step < steps.length - 1 ? (
          <button onClick={() => setStep((p) => p + 1)} disabled={!canAdvance()}
            style={{
              padding: "10px 20px", borderRadius: 10, border: "none",
              background: canAdvance() ? "#3B8BD4" : "#d0cfca",
              color: "#fff", fontSize: 14, fontWeight: 700,
              cursor: canAdvance() ? "pointer" : "default",
            }}>Siguiente →</button>
        ) : (
          <button onClick={handleSubmit} disabled={!canAdvance()}
            style={{
              padding: "10px 20px", borderRadius: 10, border: "none",
              background: canAdvance() ? "#1D9E75" : "#d0cfca",
              color: "#fff", fontSize: 14, fontWeight: 700,
              cursor: canAdvance() ? "pointer" : "default",
            }}>Generar orden ✓</button>
        )}
      </div>
    </div>
  );
}
