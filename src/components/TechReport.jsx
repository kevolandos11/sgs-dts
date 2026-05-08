"use client";
import { useState, useRef, useEffect, useCallback } from "react";

const SPARE_PARTS_CATALOG = [
  "Fuente de poder", "Disco duro SSD", "Disco duro HDD", "Memoria RAM DDR4", "Memoria RAM DDR5",
  "Cable de red Cat6", "Cable de red Cat6A", "Conector RJ45", "Patch panel", "Switch de red",
  "Ventilador servidor", "Batería UPS", "Módulo UPS", "Tarjeta madre", "Procesador",
  "Tarjeta de video", "Cable HDMI", "Cable DisplayPort", "Teclado", "Mouse",
  "Monitor", "Adaptador de corriente", "Router", "Access Point", "Transceiver SFP",
  "Bandeja de fibra óptica", "Filtro de aire", "Termostato", "Sensor de temperatura", "Fusible",
];

const SignatureCanvas = ({ onSave, onClear, savedSignature }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasContent, setHasContent] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.strokeStyle = "#1a1a1f";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (savedSignature) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
        setHasContent(true);
      };
      img.src = savedSignature;
    }
  }, []);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
  };

  const startDraw = (e) => {
    e.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
    setHasContent(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const endDraw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    setIsDrawing(false);
    if (onSave) onSave(canvasRef.current.toDataURL());
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    setHasContent(false);
    if (onClear) onClear();
  };

  return (
    <div>
      <div style={{
        position: "relative", borderRadius: 12, overflow: "hidden",
        border: "2px dashed #d0cfca", background: "#fefefe",
      }}>
        <canvas ref={canvasRef}
          onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
          onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
          style={{ width: "100%", height: 180, touchAction: "none", cursor: "crosshair", display: "block" }}
        />
        {!hasContent && (
          <div style={{
            position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
            pointerEvents: "none", color: "#ccc", fontSize: 14,
          }}>
            Firme aquí con el dedo o mouse
          </div>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
        <button onClick={clear} style={{
          padding: "6px 16px", borderRadius: 8, border: "1px solid #ddd",
          background: "#fff", color: "#888", fontSize: 12, fontWeight: 600, cursor: "pointer",
        }}>Limpiar firma</button>
      </div>
    </div>
  );
};

const SectionHeader = ({ number, title, subtitle }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: 28, height: 28, borderRadius: "50%", background: "#3B8BD4",
        color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, fontWeight: 700, flexShrink: 0,
      }}>{number}</div>
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1f" }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: "#999", marginTop: 1 }}>{subtitle}</div>}
      </div>
    </div>
  </div>
);

const FieldLabel = ({ children, required }) => (
  <label style={{
    display: "block", fontSize: 11, fontWeight: 700, color: "#888",
    letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6,
  }}>
    {children} {required && <span style={{ color: "#E24B4A" }}>*</span>}
  </label>
);

const TextInput = ({ value, onChange, placeholder, multiline, ...props }) => {
  const style = {
    width: "100%", padding: "11px 14px", borderRadius: 10,
    border: "2px solid #e8e7e3", fontSize: 14, color: "#1a1a1f",
    outline: "none", transition: "border 0.2s", boxSizing: "border-box",
    background: "#fafaf8", fontFamily: "inherit", resize: "vertical",
  };
  return multiline ? (
    <textarea value={value} onChange={onChange} placeholder={placeholder} rows={3} style={style}
      onFocus={(e) => (e.target.style.borderColor = "#3B8BD4")}
      onBlur={(e) => (e.target.style.borderColor = "#e8e7e3")} {...props} />
  ) : (
    <input type="text" value={value} onChange={onChange} placeholder={placeholder} style={style}
      onFocus={(e) => (e.target.style.borderColor = "#3B8BD4")}
      onBlur={(e) => (e.target.style.borderColor = "#e8e7e3")} {...props} />
  );
};

export default function TechReportForm() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    orderId: "OT-260001",
    client: "Banco Agrícola",
    contact: "Juan Pérez",
    equipment: "Servidor Dell PowerEdge R740",
    location: "Data Center Piso 2, Rack A3",
    serviceType: "preventivo",
    arrivalTime: "09:00",
    departureTime: "",
    findings: "",
    diagnosis: "",
    workDone: "",
    measurements: [{ parameter: "", value: "", unit: "" }],
    photos: [],
    spareParts: [],
    newPartName: "",
    newPartQty: 1,
    recommendations: "",
    nextVisit: false,
    nextVisitDate: "",
    nextVisitReason: "",
    clientName: "",
    clientPosition: "",
    signature: null,
    satisfaction: null,
    clientNotes: "",
  });

  const update = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const addMeasurement = () => {
    update("measurements", [...form.measurements, { parameter: "", value: "", unit: "" }]);
  };
  const updateMeasurement = (i, key, val) => {
    const m = [...form.measurements];
    m[i] = { ...m[i], [key]: val };
    update("measurements", m);
  };
  const removeMeasurement = (i) => {
    update("measurements", form.measurements.filter((_, idx) => idx !== i));
  };

  const addSparePart = () => {
    if (!form.newPartName.trim()) return;
    update("spareParts", [...form.spareParts, { name: form.newPartName, qty: form.newPartQty }]);
    update("newPartName", "");
    update("newPartQty", 1);
  };
  const removeSparePart = (i) => {
    update("spareParts", form.spareParts.filter((_, idx) => idx !== i));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setForm((p) => ({
          ...p,
          photos: [...p.photos, {
            id: Date.now() + Math.random(),
            src: ev.target.result,
            name: file.name,
            caption: "",
          }],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (id) => {
    update("photos", form.photos.filter((p) => p.id !== id));
  };

  const updatePhotoCaption = (id, caption) => {
    update("photos", form.photos.map((p) => p.id === id ? { ...p, caption } : p));
  };

  const steps = [
    { title: "Información", subtitle: "Datos del servicio" },
    { title: "Hallazgos", subtitle: "Diagnóstico y trabajo" },
    { title: "Evidencia", subtitle: "Fotos y mediciones" },
    { title: "Repuestos", subtitle: "Partes utilizadas" },
    { title: "Cierre", subtitle: "Firma del cliente" },
  ];

  const canAdvance = () => {
    if (step === 0) return form.serviceType && form.arrivalTime;
    if (step === 1) return form.findings.trim() && form.workDone.trim();
    if (step === 4) return form.clientName.trim() && form.signature;
    return true;
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{
        minHeight: "100vh", background: "#f5f4f0",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}>
        <div style={{
          background: "#fff", borderRadius: 20, padding: "48px 32px",
          textAlign: "center", maxWidth: 420, width: "100%",
          boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%", background: "#E1F5EE",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 30, margin: "0 auto 20px",
          }}>✓</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a1a1f", margin: "0 0 8px" }}>
            Reporte enviado
          </h2>
          <p style={{ fontSize: 14, color: "#888", margin: "0 0 8px", lineHeight: 1.5 }}>
            El reporte técnico de la orden <strong>{form.orderId}</strong> ha sido guardado exitosamente.
          </p>
          <p style={{ fontSize: 13, color: "#aaa", margin: "0 0 28px" }}>
            Se generará el PDF automáticamente y se enviará al cliente.
          </p>
          <div style={{
            background: "#fafaf8", borderRadius: 12, padding: 16, marginBottom: 24,
            textAlign: "left",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#999", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Resumen</div>
            <div style={{ display: "grid", gap: 6, fontSize: 13 }}>
              <div><span style={{ color: "#999" }}>Cliente:</span> <strong>{form.client}</strong></div>
              <div><span style={{ color: "#999" }}>Equipo:</span> <strong>{form.equipment}</strong></div>
              <div><span style={{ color: "#999" }}>Fotos:</span> <strong>{form.photos.length} adjuntas</strong></div>
              <div><span style={{ color: "#999" }}>Repuestos:</span> <strong>{form.spareParts.length} utilizados</strong></div>
              <div><span style={{ color: "#999" }}>Firmado por:</span> <strong>{form.clientName}</strong></div>
            </div>
          </div>
          <button onClick={() => { setSubmitted(false); setStep(0); setForm((p) => ({ ...p, findings: "", diagnosis: "", workDone: "", photos: [], spareParts: [], signature: null, clientName: "", clientPosition: "", satisfaction: null, clientNotes: "", recommendations: "", departureTime: "" })); }}
            style={{
              padding: "12px 28px", borderRadius: 10, border: "none",
              background: "#3B8BD4", color: "#fff", fontSize: 14, fontWeight: 700,
              cursor: "pointer", width: "100%",
            }}>
            Nuevo reporte
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#f5f4f0",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    }}>

      {/* Top Bar */}
      <header style={{
        background: "#1a1a1f", padding: "14px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>DTS</span>
          <span style={{ fontSize: 18, fontWeight: 300, color: "#3B8BD4" }}>SGS</span>
          <div style={{ width: 1, height: 20, background: "#333", margin: "0 4px" }} />
          <span style={{ fontSize: 11, color: "#666" }}>Reporte técnico</span>
        </div>
        <div style={{
          fontSize: 11, color: "#999", background: "#2a2a32",
          padding: "4px 10px", borderRadius: 6, fontWeight: 600,
        }}>{form.orderId}</div>
      </header>

      {/* Step Progress */}
      <div style={{ background: "#fff", padding: "16px 20px", borderBottom: "1px solid #eee" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0, maxWidth: 500, margin: "0 auto" }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{ textAlign: "center", flex: 1 }}>
                <div
                  onClick={() => i <= step && setStep(i)}
                  style={{
                    width: 26, height: 26, borderRadius: "50%", margin: "0 auto",
                    background: i < step ? "#1D9E75" : i === step ? "#3B8BD4" : "#e8e7e3",
                    color: i <= step ? "#fff" : "#bbb",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700,
                    cursor: i <= step ? "pointer" : "default",
                    transition: "all 0.2s",
                  }}>
                  {i < step ? "✓" : i + 1}
                </div>
                <div style={{
                  fontSize: 9, marginTop: 3, fontWeight: i === step ? 700 : 400,
                  color: i === step ? "#3B8BD4" : "#bbb",
                }}>{s.title}</div>
              </div>
              {i < steps.length - 1 && (
                <div style={{
                  height: 2, flex: 1, minWidth: 12, borderRadius: 1,
                  background: i < step ? "#1D9E75" : "#e8e7e3",
                  transition: "background 0.3s",
                }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 20px 100px" }}>

        {/* STEP 0: Información del servicio */}
        {step === 0 && (
          <div>
            <SectionHeader number="1" title="Información del servicio" subtitle="Datos generales de la orden" />

            <div style={{ background: "#fff", borderRadius: 14, padding: 20, marginBottom: 16, border: "1px solid #eee" }}>
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1,
                background: "#f0efeb", borderRadius: 10, overflow: "hidden", marginBottom: 16,
              }}>
                {[
                  { l: "Orden", v: form.orderId },
                  { l: "Cliente", v: form.client },
                  { l: "Contacto", v: form.contact },
                  { l: "Equipo", v: form.equipment },
                ].map((f, i) => (
                  <div key={i} style={{ padding: "12px 14px", background: "#fff" }}>
                    <div style={{ fontSize: 10, color: "#bbb", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4 }}>{f.l}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#333", marginTop: 2 }}>{f.v}</div>
                  </div>
                ))}
              </div>

              <FieldLabel>Ubicación del equipo</FieldLabel>
              <TextInput value={form.location} onChange={(e) => update("location", e.target.value)}
                placeholder="Ej: Data Center Piso 2, Rack A3" />
            </div>

            <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #eee" }}>
              <FieldLabel required>Tipo de servicio</FieldLabel>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                {[
                  { id: "preventivo", label: "Preventivo", icon: "🛡️" },
                  { id: "correctivo", label: "Correctivo", icon: "🔧" },
                ].map((t) => (
                  <button key={t.id} onClick={() => update("serviceType", t.id)}
                    style={{
                      padding: "14px", borderRadius: 10, cursor: "pointer",
                      border: form.serviceType === t.id ? "2px solid #3B8BD4" : "2px solid #e8e7e3",
                      background: form.serviceType === t.id ? "#E6F1FB" : "#fafaf8",
                      color: form.serviceType === t.id ? "#185FA5" : "#666",
                      fontSize: 14, fontWeight: 600, transition: "all 0.15s",
                      textAlign: "center",
                    }}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{t.icon}</div>
                    {t.label}
                  </button>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <FieldLabel required>Hora de llegada</FieldLabel>
                  <input type="time" value={form.arrivalTime} onChange={(e) => update("arrivalTime", e.target.value)}
                    style={{
                      width: "100%", padding: "11px 14px", borderRadius: 10,
                      border: "2px solid #e8e7e3", fontSize: 14, color: "#1a1a1f",
                      outline: "none", boxSizing: "border-box", background: "#fafaf8",
                    }} />
                </div>
                <div>
                  <FieldLabel>Hora de salida</FieldLabel>
                  <input type="time" value={form.departureTime} onChange={(e) => update("departureTime", e.target.value)}
                    style={{
                      width: "100%", padding: "11px 14px", borderRadius: 10,
                      border: "2px solid #e8e7e3", fontSize: 14, color: "#1a1a1f",
                      outline: "none", boxSizing: "border-box", background: "#fafaf8",
                    }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: Hallazgos y trabajo */}
        {step === 1 && (
          <div>
            <SectionHeader number="2" title="Hallazgos y trabajo realizado" subtitle="Documente el diagnóstico y las acciones" />

            <div style={{ background: "#fff", borderRadius: 14, padding: 20, marginBottom: 16, border: "1px solid #eee" }}>
              <FieldLabel required>Hallazgos encontrados</FieldLabel>
              <TextInput multiline value={form.findings} onChange={(e) => update("findings", e.target.value)}
                placeholder="Describa los hallazgos durante la inspección o diagnóstico..." />
            </div>

            <div style={{ background: "#fff", borderRadius: 14, padding: 20, marginBottom: 16, border: "1px solid #eee" }}>
              <FieldLabel>Diagnóstico técnico</FieldLabel>
              <TextInput multiline value={form.diagnosis} onChange={(e) => update("diagnosis", e.target.value)}
                placeholder="Causa raíz del problema identificado..." />
            </div>

            <div style={{ background: "#fff", borderRadius: 14, padding: 20, marginBottom: 16, border: "1px solid #eee" }}>
              <FieldLabel required>Trabajo realizado</FieldLabel>
              <TextInput multiline value={form.workDone} onChange={(e) => update("workDone", e.target.value)}
                placeholder="Detalle las acciones correctivas o preventivas ejecutadas..." />
            </div>

            <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #eee" }}>
              <FieldLabel>Recomendaciones</FieldLabel>
              <TextInput multiline value={form.recommendations} onChange={(e) => update("recommendations", e.target.value)}
                placeholder="Acciones sugeridas para el cliente..." />

              <div style={{ marginTop: 16 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <input type="checkbox" checked={form.nextVisit} onChange={(e) => update("nextVisit", e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: "#3B8BD4" }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#555" }}>Se requiere visita de seguimiento</span>
                </label>
                {form.nextVisit && (
                  <div style={{ marginTop: 12, paddingLeft: 28 }}>
                    <FieldLabel>Fecha sugerida</FieldLabel>
                    <input type="date" value={form.nextVisitDate} onChange={(e) => update("nextVisitDate", e.target.value)}
                      style={{
                        width: "100%", padding: "11px 14px", borderRadius: 10,
                        border: "2px solid #e8e7e3", fontSize: 14, color: "#1a1a1f",
                        outline: "none", boxSizing: "border-box", background: "#fafaf8",
                        marginBottom: 10,
                      }} />
                    <FieldLabel>Motivo</FieldLabel>
                    <TextInput value={form.nextVisitReason} onChange={(e) => update("nextVisitReason", e.target.value)}
                      placeholder="Razón de la visita de seguimiento" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Evidencia fotográfica y mediciones */}
        {step === 2 && (
          <div>
            <SectionHeader number="3" title="Evidencia y mediciones" subtitle="Fotos y datos técnicos registrados" />

            <div style={{ background: "#fff", borderRadius: 14, padding: 20, marginBottom: 16, border: "1px solid #eee" }}>
              <FieldLabel>Evidencia fotográfica</FieldLabel>
              <label style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                padding: "28px 20px", borderRadius: 12, border: "2px dashed #d0cfca",
                background: "#fafaf8", cursor: "pointer", transition: "all 0.15s",
                marginBottom: form.photos.length > 0 ? 16 : 0,
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#3B8BD4"; e.currentTarget.style.background = "#E6F1FB"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#d0cfca"; e.currentTarget.style.background = "#fafaf8"; }}
              >
                <input type="file" accept="image/*" multiple capture="environment"
                  onChange={handlePhotoUpload} style={{ display: "none" }} />
                <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#555" }}>Tomar foto o seleccionar</div>
                <div style={{ fontSize: 12, color: "#bbb", marginTop: 2 }}>Toque para abrir la cámara</div>
              </label>

              {form.photos.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {form.photos.map((photo) => (
                    <div key={photo.id} style={{
                      borderRadius: 10, overflow: "hidden", border: "1px solid #eee",
                      background: "#fafaf8",
                    }}>
                      <div style={{ position: "relative" }}>
                        <img src={photo.src} alt="" style={{
                          width: "100%", height: 120, objectFit: "cover", display: "block",
                        }} />
                        <button onClick={() => removePhoto(photo.id)}
                          style={{
                            position: "absolute", top: 6, right: 6,
                            width: 24, height: 24, borderRadius: "50%",
                            background: "rgba(0,0,0,0.6)", border: "none", color: "#fff",
                            fontSize: 14, cursor: "pointer", display: "flex",
                            alignItems: "center", justifyContent: "center",
                          }}>×</button>
                      </div>
                      <div style={{ padding: 8 }}>
                        <input type="text" placeholder="Descripción de la foto..."
                          value={photo.caption}
                          onChange={(e) => updatePhotoCaption(photo.id, e.target.value)}
                          style={{
                            width: "100%", padding: "6px 8px", borderRadius: 6,
                            border: "1px solid #e8e7e3", fontSize: 11, color: "#555",
                            outline: "none", boxSizing: "border-box",
                          }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #eee" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <FieldLabel>Mediciones técnicas</FieldLabel>
              </div>

              {form.measurements.map((m, i) => (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "1fr 80px 70px 32px", gap: 8,
                  marginBottom: 10, alignItems: "end",
                }}>
                  <div>
                    {i === 0 && <div style={{ fontSize: 10, color: "#bbb", marginBottom: 4 }}>Parámetro</div>}
                    <input type="text" placeholder="Ej: Voltaje"
                      value={m.parameter} onChange={(e) => updateMeasurement(i, "parameter", e.target.value)}
                      style={{
                        width: "100%", padding: "9px 10px", borderRadius: 8,
                        border: "1px solid #e8e7e3", fontSize: 13, color: "#333",
                        outline: "none", boxSizing: "border-box",
                      }} />
                  </div>
                  <div>
                    {i === 0 && <div style={{ fontSize: 10, color: "#bbb", marginBottom: 4 }}>Valor</div>}
                    <input type="text" placeholder="120"
                      value={m.value} onChange={(e) => updateMeasurement(i, "value", e.target.value)}
                      style={{
                        width: "100%", padding: "9px 10px", borderRadius: 8,
                        border: "1px solid #e8e7e3", fontSize: 13, color: "#333",
                        outline: "none", boxSizing: "border-box",
                      }} />
                  </div>
                  <div>
                    {i === 0 && <div style={{ fontSize: 10, color: "#bbb", marginBottom: 4 }}>Unidad</div>}
                    <input type="text" placeholder="V"
                      value={m.unit} onChange={(e) => updateMeasurement(i, "unit", e.target.value)}
                      style={{
                        width: "100%", padding: "9px 10px", borderRadius: 8,
                        border: "1px solid #e8e7e3", fontSize: 13, color: "#333",
                        outline: "none", boxSizing: "border-box",
                      }} />
                  </div>
                  <button onClick={() => removeMeasurement(i)}
                    style={{
                      width: 32, height: 36, borderRadius: 8, border: "1px solid #eee",
                      background: "#fff", color: "#ccc", fontSize: 16, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>×</button>
                </div>
              ))}

              <button onClick={addMeasurement}
                style={{
                  padding: "8px 16px", borderRadius: 8, border: "1px dashed #ccc",
                  background: "transparent", color: "#3B8BD4", fontSize: 12,
                  fontWeight: 600, cursor: "pointer", width: "100%", marginTop: 4,
                }}>
                + Agregar medición
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Repuestos */}
        {step === 3 && (
          <div>
            <SectionHeader number="4" title="Repuestos utilizados" subtitle="Registre las partes usadas en el servicio" />

            <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #eee" }}>

              {form.spareParts.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  {form.spareParts.map((part, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "12px 14px", borderRadius: 10, background: "#fafaf8",
                      marginBottom: 6,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 30, height: 30, borderRadius: 8, background: "#E6F1FB",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 14,
                        }}>🔩</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>{part.name}</div>
                          <div style={{ fontSize: 11, color: "#999" }}>Cantidad: {part.qty}</div>
                        </div>
                      </div>
                      <button onClick={() => removeSparePart(i)}
                        style={{
                          width: 28, height: 28, borderRadius: 6, border: "1px solid #eee",
                          background: "#fff", color: "#ccc", fontSize: 14, cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>×</button>
                    </div>
                  ))}
                </div>
              )}

              <FieldLabel>Agregar repuesto</FieldLabel>
              <div style={{ position: "relative", marginBottom: 10 }}>
                <TextInput value={form.newPartName} onChange={(e) => update("newPartName", e.target.value)}
                  placeholder="Buscar o escribir nombre del repuesto..."
                  list="parts-list" />
                <datalist id="parts-list">
                  {SPARE_PARTS_CATALOG.map((p) => <option key={p} value={p} />)}
                </datalist>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10 }}>
                <div>
                  <FieldLabel>Cantidad</FieldLabel>
                  <input type="number" min="1" value={form.newPartQty}
                    onChange={(e) => update("newPartQty", parseInt(e.target.value) || 1)}
                    style={{
                      width: "100%", padding: "11px 14px", borderRadius: 10,
                      border: "2px solid #e8e7e3", fontSize: 14, color: "#1a1a1f",
                      outline: "none", boxSizing: "border-box", background: "#fafaf8",
                    }} />
                </div>
                <div style={{ display: "flex", alignItems: "flex-end" }}>
                  <button onClick={addSparePart}
                    style={{
                      padding: "11px 20px", borderRadius: 10, border: "none",
                      background: "#3B8BD4", color: "#fff", fontSize: 14, fontWeight: 700,
                      cursor: "pointer", whiteSpace: "nowrap",
                    }}>
                    + Agregar
                  </button>
                </div>
              </div>

              {form.spareParts.length === 0 && (
                <div style={{
                  textAlign: "center", padding: "24px 0 8px", color: "#ccc", fontSize: 13,
                }}>
                  No se han registrado repuestos
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: Cierre y firma */}
        {step === 4 && (
          <div>
            <SectionHeader number="5" title="Cierre de servicio" subtitle="Firma digital del cliente" />

            <div style={{ background: "#fff", borderRadius: 14, padding: 20, marginBottom: 16, border: "1px solid #eee" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                <div>
                  <FieldLabel required>Nombre del cliente</FieldLabel>
                  <TextInput value={form.clientName} onChange={(e) => update("clientName", e.target.value)}
                    placeholder="Nombre completo" />
                </div>
                <div>
                  <FieldLabel>Cargo</FieldLabel>
                  <TextInput value={form.clientPosition} onChange={(e) => update("clientPosition", e.target.value)}
                    placeholder="Ej: Gerente de TI" />
                </div>
              </div>

              <FieldLabel>Satisfacción del cliente</FieldLabel>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6, marginBottom: 16 }}>
                {[
                  { v: 1, label: "Malo", emoji: "😞" },
                  { v: 2, label: "Regular", emoji: "😐" },
                  { v: 3, label: "Bueno", emoji: "🙂" },
                  { v: 4, label: "Muy bueno", emoji: "😊" },
                  { v: 5, label: "Excelente", emoji: "🤩" },
                ].map((s) => (
                  <button key={s.v} onClick={() => update("satisfaction", s.v)}
                    style={{
                      padding: "10px 4px", borderRadius: 10, cursor: "pointer",
                      border: form.satisfaction === s.v ? "2px solid #3B8BD4" : "2px solid #e8e7e3",
                      background: form.satisfaction === s.v ? "#E6F1FB" : "#fafaf8",
                      textAlign: "center", transition: "all 0.15s",
                    }}>
                    <div style={{ fontSize: 22 }}>{s.emoji}</div>
                    <div style={{ fontSize: 9, color: form.satisfaction === s.v ? "#185FA5" : "#999", fontWeight: 600, marginTop: 2 }}>{s.label}</div>
                  </button>
                ))}
              </div>

              <FieldLabel>Observaciones del cliente</FieldLabel>
              <TextInput multiline value={form.clientNotes} onChange={(e) => update("clientNotes", e.target.value)}
                placeholder="Comentarios adicionales del cliente..." />
            </div>

            <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #eee" }}>
              <FieldLabel required>Firma del cliente</FieldLabel>
              <SignatureCanvas
                savedSignature={form.signature}
                onSave={(sig) => update("signature", sig)}
                onClear={() => update("signature", null)}
              />
              <div style={{
                marginTop: 12, padding: "10px 14px", background: "#FAEEDA",
                borderRadius: 8, fontSize: 12, color: "#854F0B", lineHeight: 1.4,
              }}>
                Al firmar, el cliente confirma que el trabajo descrito fue realizado y acepta los términos del servicio.
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
        <button onClick={() => setStep((p) => Math.max(0, p - 1))}
          disabled={step === 0}
          style={{
            padding: "10px 20px", borderRadius: 10,
            border: "1px solid #ddd", background: "#fff",
            color: step === 0 ? "#ddd" : "#555", fontSize: 14, fontWeight: 600,
            cursor: step === 0 ? "default" : "pointer",
          }}>
          ← Anterior
        </button>

        <div style={{ fontSize: 12, color: "#bbb" }}>
          {step + 1} de {steps.length}
        </div>

        {step < steps.length - 1 ? (
          <button onClick={() => setStep((p) => Math.min(steps.length - 1, p + 1))}
            disabled={!canAdvance()}
            style={{
              padding: "10px 20px", borderRadius: 10, border: "none",
              background: canAdvance() ? "#3B8BD4" : "#d0cfca",
              color: "#fff", fontSize: 14, fontWeight: 700,
              cursor: canAdvance() ? "pointer" : "default",
              transition: "background 0.2s",
            }}>
            Siguiente →
          </button>
        ) : (
          <button onClick={handleSubmit}
            disabled={!canAdvance()}
            style={{
              padding: "10px 20px", borderRadius: 10, border: "none",
              background: canAdvance() ? "#1D9E75" : "#d0cfca",
              color: "#fff", fontSize: 14, fontWeight: 700,
              cursor: canAdvance() ? "pointer" : "default",
              transition: "background 0.2s",
            }}>
            Finalizar ✓
          </button>
        )}
      </div>
    </div>
  );
}
