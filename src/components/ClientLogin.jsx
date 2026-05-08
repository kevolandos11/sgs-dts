"use client";
import { useState } from "react";

const C = { blue:"#3B8BD4", blueLt:"#E6F1FB", green:"#1D9E75", greenLt:"#E1F5EE", amber:"#BA7517", amberLt:"#FAEEDA", red:"#E24B4A", dark:"#1a1a1f", border:"#e8e7e3", bg:"#f5f4f0" };

const ORDERS_DB = [
  { id:"OT-260001", date:"2026-04-16", desc:"Mantenimiento preventivo servidor principal", state:"diagnostico", type:"campo",  tech:"Carlos Méndez",  pdf:true  },
  { id:"OT-260004", date:"2026-04-16", desc:"Diagnóstico switch de red caído",             state:"recibido",   type:"taller", tech:"Luis Portillo",   pdf:false },
  { id:"OT-260010", date:"2026-03-20", desc:"Instalación firewall perimetral",              state:"entregado",  type:"campo",  tech:"Ana Martínez",    pdf:true  },
  { id:"OT-259088", date:"2026-02-10", desc:"Reparación servidor de correo",                state:"entregado",  type:"taller", tech:"Carlos Méndez",   pdf:true  },
  { id:"OT-259041", date:"2026-01-05", desc:"Configuración VPN corporativa",                state:"entregado",  type:"campo",  tech:"Roberto García",  pdf:true  },
];

const STATE_META = {
  recibido:    { label:"Recibido",           color:C.blue,   bg:C.blueLt  },
  diagnostico: { label:"En diagnóstico",     color:"#7F77DD",bg:"#EEEDFE" },
  repuestos:   { label:"Esp. repuestos",     color:C.amber,  bg:C.amberLt },
  reparado:    { label:"Reparado",           color:C.green,  bg:C.greenLt },
  entregado:   { label:"Entregado",          color:"#5F5E5A",bg:"#F1EFE8" },
};

const Input = ({ label, type="text", value, onChange, placeholder, required }) => (
  <div style={{ marginBottom:14 }}>
    <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#888", letterSpacing:0.5, textTransform:"uppercase", marginBottom:6 }}>
      {label}{required && <span style={{ color:C.red }}> *</span>}
    </label>
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{ width:"100%", padding:"12px 14px", borderRadius:10, border:`2px solid ${C.border}`, fontSize:14, color:C.dark, outline:"none", boxSizing:"border-box", background:"#fafaf8", transition:"border 0.2s", fontFamily:"inherit" }}
      onFocus={e => e.target.style.borderColor=C.blue}
      onBlur={e  => e.target.style.borderColor=C.border}/>
  </div>
);

export default function ClientLogin() {
  const [screen, setScreen] = useState("login"); // login | register | portal
  const [form, setForm]     = useState({ email:"", password:"", name:"", company:"", phone:"", confirm:"" });
  const [error, setError]   = useState("");
  const [tab, setTab]       = useState("ordenes");
  const [loading, setLoading] = useState(false);

  const upd = (k,v) => setForm(p=>({...p,[k]:v}));

  const handleLogin = () => {
    if (!form.email || !form.password) { setError("Complete todos los campos"); return; }
    setLoading(true); setError("");
    setTimeout(() => { setLoading(false); setScreen("portal"); }, 900);
  };

  const handleRegister = () => {
    if (!form.name || !form.email || !form.password) { setError("Complete los campos requeridos"); return; }
    if (form.password !== form.confirm) { setError("Las contraseñas no coinciden"); return; }
    setLoading(true); setError("");
    setTimeout(() => { setLoading(false); setScreen("portal"); }, 900);
  };

  // ── LOGIN ────────────────────────────────────────────────────
  if (screen === "login") return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#1a1a1f 0%,#2a2a32 100%)", display:"flex", flexDirection:"column", fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>
      <div style={{ padding:"20px 28px", display:"flex", alignItems:"center", gap:10 }}>
        <span style={{ fontSize:22, fontWeight:800, color:"#fff" }}>DTS</span>
        <span style={{ fontSize:22, fontWeight:300, color:C.blue }}>SGS</span>
        <div style={{ width:1, height:22, background:"#333", margin:"0 6px" }}/>
        <span style={{ fontSize:12, color:"#666" }}>Portal de cliente</span>
      </div>

      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
        <div style={{ width:"100%", maxWidth:400 }}>
          <div style={{ textAlign:"center", marginBottom:32 }}>
            <div style={{ width:60, height:60, borderRadius:"50%", background:C.blueLt, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontSize:26 }}>🔐</div>
            <h1 style={{ color:"#fff", fontSize:24, fontWeight:800, margin:"0 0 8px" }}>Bienvenido</h1>
            <p style={{ color:"#888", fontSize:14, margin:0 }}>Ingrese a su cuenta para consultar sus órdenes</p>
          </div>

          <div style={{ background:"#fff", borderRadius:16, padding:28, boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }}>
            <Input label="Correo electrónico" type="email" value={form.email} onChange={e=>upd("email",e.target.value)} placeholder="su.correo@empresa.com" required/>
            <Input label="Contraseña" type="password" value={form.password} onChange={e=>upd("password",e.target.value)} placeholder="••••••••" required/>

            {error && <div style={{ fontSize:13, color:C.red, marginBottom:12, fontWeight:500 }}>{error}</div>}

            <div style={{ textAlign:"right", marginBottom:16 }}>
              <span style={{ fontSize:12, color:C.blue, cursor:"pointer", fontWeight:600 }}>¿Olvidó su contraseña?</span>
            </div>

            <button onClick={handleLogin} style={{ width:"100%", padding:14, borderRadius:10, border:"none", background:C.blue, color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer" }}>
              {loading ? "Ingresando..." : "Ingresar →"}
            </button>

            <div style={{ textAlign:"center", marginTop:18, fontSize:13, color:"#aaa" }}>
              ¿No tiene cuenta?{" "}
              <span onClick={() => { setScreen("register"); setError(""); setForm({email:"",password:"",name:"",company:"",phone:"",confirm:""}); }}
                style={{ color:C.blue, fontWeight:700, cursor:"pointer" }}>Regístrese aquí</span>
            </div>

            <div style={{ marginTop:16, padding:"10px 14px", background:C.bg, borderRadius:8, fontSize:11, color:"#aaa", textAlign:"center" }}>
              Demo: cualquier correo + contraseña funciona
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ── REGISTER ─────────────────────────────────────────────────
  if (screen === "register") return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#1a1a1f 0%,#2a2a32 100%)", display:"flex", flexDirection:"column", fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>
      <div style={{ padding:"20px 28px", display:"flex", alignItems:"center", gap:10 }}>
        <span style={{ fontSize:22, fontWeight:800, color:"#fff" }}>DTS</span>
        <span style={{ fontSize:22, fontWeight:300, color:C.blue }}>SGS</span>
      </div>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
        <div style={{ width:"100%", maxWidth:440 }}>
          <div style={{ textAlign:"center", marginBottom:28 }}>
            <h1 style={{ color:"#fff", fontSize:22, fontWeight:800, margin:"0 0 6px" }}>Crear cuenta</h1>
            <p style={{ color:"#888", fontSize:14, margin:0 }}>Acceda al historial completo de sus órdenes</p>
          </div>
          <div style={{ background:"#fff", borderRadius:16, padding:28, boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }}>
            <Input label="Nombre completo" value={form.name} onChange={e=>upd("name",e.target.value)} placeholder="Juan Pérez" required/>
            <Input label="Empresa" value={form.company} onChange={e=>upd("company",e.target.value)} placeholder="Nombre de su empresa"/>
            <Input label="Correo electrónico" type="email" value={form.email} onChange={e=>upd("email",e.target.value)} placeholder="su.correo@empresa.com" required/>
            <Input label="Teléfono" value={form.phone} onChange={e=>upd("phone",e.target.value)} placeholder="(503) 0000-0000"/>
            <Input label="Contraseña" type="password" value={form.password} onChange={e=>upd("password",e.target.value)} placeholder="Mínimo 8 caracteres" required/>
            <Input label="Confirmar contraseña" type="password" value={form.confirm} onChange={e=>upd("confirm",e.target.value)} placeholder="Repita su contraseña" required/>

            {error && <div style={{ fontSize:13, color:C.red, marginBottom:12 }}>{error}</div>}

            <button onClick={handleRegister} style={{ width:"100%", padding:14, borderRadius:10, border:"none", background:C.green, color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer" }}>
              {loading ? "Creando cuenta..." : "Crear cuenta →"}
            </button>
            <div style={{ textAlign:"center", marginTop:16, fontSize:13, color:"#aaa" }}>
              ¿Ya tiene cuenta?{" "}
              <span onClick={() => { setScreen("login"); setError(""); }} style={{ color:C.blue, fontWeight:700, cursor:"pointer" }}>Ingresar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ── PORTAL ───────────────────────────────────────────────────
  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>
      <header style={{ background:C.dark, padding:"14px 24px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:18, fontWeight:800, color:"#fff" }}>DTS</span>
          <span style={{ fontSize:18, fontWeight:300, color:C.blue }}>SGS</span>
          <div style={{ width:1, height:20, background:"#333", margin:"0 4px" }}/>
          <span style={{ fontSize:11, color:"#666" }}>Portal de cliente</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:32, height:32, borderRadius:"50%", background:C.blueLt, color:C.blue, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700 }}>
            {form.name ? form.name[0].toUpperCase() : "U"}
          </div>
          <button onClick={() => setScreen("login")} style={{ padding:"6px 14px", borderRadius:8, border:"1px solid #333", background:"transparent", color:"#888", fontSize:12, cursor:"pointer" }}>Salir</button>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ background:"#fff", borderBottom:`1px solid ${C.border}`, padding:"0 24px", display:"flex" }}>
        {[{id:"ordenes",label:"Mis órdenes"},{id:"perfil",label:"Mi perfil"},{id:"soporte",label:"Soporte"}].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding:"13px 18px", border:"none", background:"none", cursor:"pointer", fontSize:13, fontWeight:tab===t.id?700:400, color:tab===t.id?C.blue:"#888", borderBottom:`2px solid ${tab===t.id?C.blue:"transparent"}`, transition:"all 0.15s" }}>{t.label}</button>
        ))}
      </div>

      <div style={{ maxWidth:760, margin:"0 auto", padding:"24px 24px 60px" }}>

        {/* Welcome banner */}
        <div style={{ background:`linear-gradient(135deg,${C.dark} 0%,#2a2a32 100%)`, borderRadius:14, padding:"24px 28px", marginBottom:20, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ color:"#888", fontSize:12, marginBottom:4 }}>Bienvenido de vuelta</div>
            <div style={{ color:"#fff", fontSize:20, fontWeight:800 }}>{form.name || "Juan Pérez"}</div>
            <div style={{ color:"#666", fontSize:12, marginTop:2 }}>Banco Agrícola · {ORDERS_DB.length} órdenes en su historial</div>
          </div>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:28, fontWeight:800, color:C.blue }}>{ORDERS_DB.filter(o=>o.state!=="entregado").length}</div>
            <div style={{ fontSize:11, color:"#888" }}>Órdenes activas</div>
          </div>
        </div>

        {/* ÓRDENES */}
        {tab === "ordenes" && (
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:C.dark, marginBottom:12 }}>Historial de órdenes</div>
            {ORDERS_DB.map(o => {
              const sm = STATE_META[o.state];
              return (
                <div key={o.id} style={{ background:"#fff", borderRadius:12, padding:"16px 20px", marginBottom:10, border:`1px solid ${C.border}`, transition:"box-shadow 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,0.06)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow="none"}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                        <span style={{ fontSize:15, fontWeight:800, color:C.blue }}>{o.id}</span>
                        <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700, background:sm.bg, color:sm.color }}>
                          {sm.label}
                        </span>
                        <span style={{ padding:"3px 10px", borderRadius:6, fontSize:10, fontWeight:600, background:o.type==="campo"?C.blueLt:"#EEEDFE", color:o.type==="campo"?"#185FA5":"#534AB7" }}>
                          {o.type==="campo"?"Campo":"Taller"}
                        </span>
                      </div>
                      <div style={{ fontSize:13, color:"#555", marginBottom:4 }}>{o.desc}</div>
                      <div style={{ fontSize:11, color:"#aaa" }}>Técnico: {o.tech} · {o.date}</div>
                    </div>
                    {o.pdf && (
                      <button style={{ padding:"7px 14px", borderRadius:8, border:`1px solid ${C.border}`, background:"#fff", color:C.blue, fontSize:12, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap", flexShrink:0 }}>
                        📄 PDF
                      </button>
                    )}
                  </div>
                  {o.state !== "entregado" && (
                    <div style={{ marginTop:12 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:0 }}>
                        {["recibido","diagnostico","repuestos","reparado","entregado"].map((s,i) => {
                          const idx  = ["recibido","diagnostico","repuestos","reparado","entregado"].indexOf(o.state);
                          const past = i < idx; const curr = i === idx;
                          return (
                            <div key={s} style={{ display:"flex", alignItems:"center", flex:1 }}>
                              <div style={{ textAlign:"center", flex:1 }}>
                                <div style={{ width:16, height:16, borderRadius:"50%", margin:"0 auto", background:past?C.green:curr?STATE_META[s]?.color||C.blue:"#e8e7e3", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, color:"#fff", fontWeight:700 }}>
                                  {past?"✓":""}
                                </div>
                                <div style={{ fontSize:8, marginTop:2, color:curr?STATE_META[s]?.color||C.blue:"#ccc", fontWeight:curr?700:400 }}>{STATE_META[s]?.label||s}</div>
                              </div>
                              {i < 4 && <div style={{ height:2, flex:1, background:past?C.green:"#e8e7e3", borderRadius:1 }}/>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* PERFIL */}
        {tab === "perfil" && (
          <div style={{ background:"#fff", borderRadius:14, padding:24, border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:15, fontWeight:700, marginBottom:20 }}>Información de perfil</div>
            <Input label="Nombre completo" value={form.name||"Juan Pérez"} onChange={e=>upd("name",e.target.value)}/>
            <Input label="Empresa" value={form.company||"Banco Agrícola"} onChange={e=>upd("company",e.target.value)}/>
            <Input label="Correo electrónico" type="email" value={form.email||"jperez@bancoagricola.com"} onChange={e=>upd("email",e.target.value)}/>
            <Input label="Teléfono" value={form.phone||"(503) 2212-0000"} onChange={e=>upd("phone",e.target.value)}/>
            <button style={{ padding:"11px 28px", borderRadius:10, border:"none", background:C.blue, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>Guardar cambios</button>
          </div>
        )}

        {/* SOPORTE */}
        {tab === "soporte" && (
          <div style={{ background:"#fff", borderRadius:14, padding:24, border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:15, fontWeight:700, marginBottom:16 }}>Contactar soporte</div>
            {[{ icon:"📞", label:"Teléfono", val:"(503) 2222-0000", sub:"Lunes a viernes 8am – 6pm" },
              { icon:"📧", label:"Correo",   val:"soporte@dts.com.sv", sub:"Respuesta en menos de 4 horas" },
              { icon:"📍", label:"Dirección",val:"San Salvador, El Salvador", sub:"Atención en persona con cita" }
            ].map(item => (
              <div key={item.label} style={{ display:"flex", gap:14, padding:"14px 0", borderBottom:`1px solid ${C.bg}` }}>
                <div style={{ width:40, height:40, borderRadius:10, background:C.blueLt, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize:11, color:"#aaa", fontWeight:600, textTransform:"uppercase", letterSpacing:0.4 }}>{item.label}</div>
                  <div style={{ fontSize:14, fontWeight:700, color:C.dark, marginTop:2 }}>{item.val}</div>
                  <div style={{ fontSize:12, color:"#aaa", marginTop:1 }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
