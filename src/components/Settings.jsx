"use client";
import { useState } from "react";

const C = { blue:"#3B8BD4", blueLt:"#E6F1FB", green:"#1D9E75", greenLt:"#E1F5EE", amber:"#BA7517", amberLt:"#FAEEDA", red:"#E24B4A", redLt:"#FCEBEB", dark:"#1a1a1f", border:"#e8e7e3", bg:"#f5f4f0" };

const Toggle = ({ value, onChange }) => (
  <div onClick={() => onChange(!value)} style={{ width:40, height:22, borderRadius:11, background:value?C.blue:"#d0cfca", position:"relative", cursor:"pointer", transition:"background 0.2s", flexShrink:0 }}>
    <div style={{ position:"absolute", top:3, left:value?21:3, width:16, height:16, borderRadius:"50%", background:"#fff", transition:"left 0.2s", boxShadow:"0 1px 3px rgba(0,0,0,0.2)" }}/>
  </div>
);

const Input = ({ label, value, onChange, placeholder, type="text" }) => (
  <div style={{ marginBottom:12 }}>
    {label && <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#888", letterSpacing:0.5, textTransform:"uppercase", marginBottom:5 }}>{label}</label>}
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{ width:"100%", padding:"10px 13px", borderRadius:9, border:`2px solid ${C.border}`, fontSize:13, color:C.dark, outline:"none", boxSizing:"border-box", background:"#fafaf8", transition:"border 0.2s", fontFamily:"inherit" }}
      onFocus={e=>e.target.style.borderColor=C.blue} onBlur={e=>e.target.style.borderColor=C.border}/>
  </div>
);

const Section = ({ title, children }) => (
  <div style={{ background:"#fff", borderRadius:14, padding:"20px 22px", border:`1px solid ${C.border}`, marginBottom:16 }}>
    <div style={{ fontSize:15, fontWeight:700, color:C.dark, marginBottom:16, paddingBottom:12, borderBottom:`1px solid ${C.border}` }}>{title}</div>
    {children}
  </div>
);

const SettingRow = ({ label, sub, children }) => (
  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:`1px solid ${C.bg}` }}>
    <div style={{ flex:1, paddingRight:20 }}>
      <div style={{ fontSize:13, fontWeight:600, color:C.dark }}>{label}</div>
      {sub && <div style={{ fontSize:12, color:"#aaa", marginTop:2 }}>{sub}</div>}
    </div>
    {children}
  </div>
);

const USERS = [
  { id:1, name:"Kevin Landos",   email:"klandos@dts.com.sv",   role:"admin",    avatar:"KL", color:C.blue,   active:true  },
  { id:2, name:"Carlos Méndez",  email:"cmendez@dts.com.sv",   role:"tecnico",  avatar:"CM", color:C.blue,   active:true  },
  { id:3, name:"Roberto García", email:"rgarcia@dts.com.sv",   role:"tecnico",  avatar:"RG", color:"#7F77DD",active:true  },
  { id:4, name:"Ana Martínez",   email:"amartinez@dts.com.sv", role:"tecnico",  avatar:"AM", color:C.green,  active:true  },
  { id:5, name:"Luis Portillo",  email:"lportillo@dts.com.sv", role:"tecnico",  avatar:"LP", color:C.amber,  active:true  },
  { id:6, name:"Sandra López",   email:"slopez@dts.com.sv",    role:"recepcion",avatar:"SL", color:"#888",   active:false },
];

const ROLES = { admin:"Administrador", tecnico:"Técnico", recepcion:"Recepción" };
const ROLE_COLORS = { admin:[C.blue,C.blueLt], tecnico:[C.green,C.greenLt], recepcion:[C.amber,C.amberLt] };

export default function Configuracion() {
  const [tab, setTab] = useState("empresa");
  const [saved, setSaved] = useState(false);
  const [company, setCompany] = useState({ name:"DTS El Salvador", email:"soporte@dts.com.sv", phone:"(503) 2222-0000", address:"San Salvador, El Salvador", website:"www.dts.com.sv", taxId:"0614-280310-105-5" });
  const [notifs, setNotifs] = useState({ emailEnabled:true, smsEnabled:false, autoOnReceive:true, autoOnState:true, autoOnReady:true, autoOnDelivered:true, adminCC:true });
  const [prefs, setPrefs]   = useState({ defaultPriority:"media", maxOrdersTech:5, workStart:"08:00", workEnd:"18:00", currency:"USD", timezone:"America/El_Salvador", pdfLogo:true, pdfSign:true });
  const [users, setUsers]   = useState(USERS);

  const handleSave = () => { setSaved(true); setTimeout(()=>setSaved(false),2000); };
  const toggleUser = (id) => setUsers(p=>p.map(u=>u.id===id?{...u,active:!u.active}:u));

  const tabs = [
    {id:"empresa",  label:"Empresa",      icon:"🏢"},
    {id:"usuarios", label:"Usuarios",     icon:"👥"},
    {id:"notifs",   label:"Notificaciones",icon:"🔔"},
    {id:"sistema",  label:"Sistema",      icon:"⚙️"},
  ];

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>
      <header style={{ background:C.dark, padding:"14px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:18, fontWeight:800, color:"#fff" }}>DTS</span>
          <span style={{ fontSize:18, fontWeight:300, color:C.blue }}>SGS</span>
          <div style={{ width:1, height:20, background:"#333", margin:"0 4px" }}/>
          <span style={{ fontSize:11, color:"#666" }}>Configuración del sistema</span>
        </div>
        <button onClick={handleSave} style={{ padding:"7px 18px", borderRadius:8, border:"none", background:saved?C.green:C.blue, color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", transition:"background 0.2s" }}>
          {saved?"✓ Guardado":"Guardar cambios"}
        </button>
      </header>

      {/* Tabs */}
      <div style={{ background:"#fff", borderBottom:`1px solid ${C.border}`, padding:"0 24px", display:"flex" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)} style={{ padding:"13px 18px", border:"none", background:"none", cursor:"pointer", fontSize:13, fontWeight:tab===t.id?700:400, color:tab===t.id?C.blue:"#888", borderBottom:`2px solid ${tab===t.id?C.blue:"transparent"}`, transition:"all 0.15s", display:"flex", alignItems:"center", gap:6 }}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth:700, margin:"0 auto", padding:"24px 24px 60px" }}>

        {/* ── EMPRESA ── */}
        {tab==="empresa" && (
          <div>
            <Section title="Información de la empresa">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Input label="Nombre de la empresa" value={company.name} onChange={e=>setCompany(p=>({...p,name:e.target.value}))}/>
                <Input label="Correo de soporte" type="email" value={company.email} onChange={e=>setCompany(p=>({...p,email:e.target.value}))}/>
                <Input label="Teléfono principal" value={company.phone} onChange={e=>setCompany(p=>({...p,phone:e.target.value}))}/>
                <Input label="Sitio web" value={company.website} onChange={e=>setCompany(p=>({...p,website:e.target.value}))}/>
                <Input label="NIT / RUC" value={company.taxId} onChange={e=>setCompany(p=>({...p,taxId:e.target.value}))}/>
                <Input label="País" value="El Salvador" onChange={()=>{}}/>
              </div>
              <div style={{ marginTop:4 }}>
                <Input label="Dirección" value={company.address} onChange={e=>setCompany(p=>({...p,address:e.target.value}))}/>
              </div>
            </Section>

            <Section title="Apariencia del sistema">
              <SettingRow label="Logo en reportes PDF" sub="Muestra el nombre DTS en todos los documentos generados">
                <Toggle value={prefs.pdfLogo} onChange={v=>setPrefs(p=>({...p,pdfLogo:v}))}/>
              </SettingRow>
              <SettingRow label="Bloque de firmas en PDF" sub="Incluye sección de firma de técnico y cliente en reportes">
                <Toggle value={prefs.pdfSign} onChange={v=>setPrefs(p=>({...p,pdfSign:v}))}/>
              </SettingRow>
              <SettingRow label="Moneda" sub="Moneda usada en cotizaciones e inventario">
                <select value={prefs.currency} onChange={e=>setPrefs(p=>({...p,currency:e.target.value}))}
                  style={{ padding:"7px 12px", borderRadius:8, border:`1px solid ${C.border}`, fontSize:13, background:"#fff", outline:"none" }}>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </SettingRow>
            </Section>
          </div>
        )}

        {/* ── USUARIOS ── */}
        {tab==="usuarios" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div style={{ fontSize:14, fontWeight:700, color:C.dark }}>{users.length} usuarios en el sistema</div>
              <button style={{ padding:"8px 16px", borderRadius:9, border:"none", background:C.blue, color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>+ Nuevo usuario</button>
            </div>

            <div style={{ background:"#fff", borderRadius:14, overflow:"hidden", border:`1px solid ${C.border}` }}>
              {users.map((u,i) => {
                const [rc, rb] = ROLE_COLORS[u.role]||[C.blue,C.blueLt];
                return (
                  <div key={u.id} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 18px", borderTop:i>0?`1px solid ${C.bg}`:"none" }}
                    onMouseEnter={e=>e.currentTarget.style.background=C.bg}
                    onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
                    <div style={{ width:40, height:40, borderRadius:"50%", background:`${u.color}18`, color:u.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, flexShrink:0, opacity:u.active?1:0.4 }}>{u.avatar}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:14, fontWeight:600, color:u.active?C.dark:"#aaa" }}>{u.name}</span>
                        <span style={{ padding:"2px 9px", borderRadius:6, fontSize:10, fontWeight:700, background:rb, color:rc }}>{ROLES[u.role]}</span>
                        {!u.active && <span style={{ padding:"2px 9px", borderRadius:6, fontSize:10, fontWeight:700, background:"#f0efeb", color:"#aaa" }}>Inactivo</span>}
                      </div>
                      <div style={{ fontSize:12, color:"#aaa", marginTop:2 }}>{u.email}</div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <Toggle value={u.active} onChange={()=>toggleUser(u.id)}/>
                      <button style={{ padding:"5px 12px", borderRadius:7, border:`1px solid ${C.border}`, background:"#fff", fontSize:11, fontWeight:600, cursor:"pointer", color:"#666" }}>Editar</button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop:16, padding:"14px 18px", background:C.blueLt, borderRadius:12, border:`1px solid #85B7EB` }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#185FA5", marginBottom:4 }}>Roles y permisos</div>
              <div style={{ fontSize:12, color:"#555", lineHeight:1.6 }}>
                <strong>Administrador:</strong> acceso total al sistema. <strong>Técnico:</strong> puede gestionar y cerrar órdenes asignadas. <strong>Recepción:</strong> puede crear órdenes y consultar estados.
              </div>
            </div>
          </div>
        )}

        {/* ── NOTIFICACIONES ── */}
        {tab==="notifs" && (
          <Section title="Configuración de notificaciones">
            <SettingRow label="Correo electrónico activado" sub="Habilitar el envío de notificaciones por correo">
              <Toggle value={notifs.emailEnabled} onChange={v=>setNotifs(p=>({...p,emailEnabled:v}))}/>
            </SettingRow>
            <SettingRow label="SMS (próximamente)" sub="Notificaciones por mensaje de texto">
              <Toggle value={notifs.smsEnabled} onChange={v=>setNotifs(p=>({...p,smsEnabled:v}))}/>
            </SettingRow>
            <div style={{ height:1, background:C.bg, margin:"8px 0" }}/>
            <div style={{ fontSize:12, fontWeight:700, color:"#aaa", letterSpacing:0.5, textTransform:"uppercase", marginBottom:8, marginTop:4 }}>Disparadores automáticos</div>
            {[
              {key:"autoOnReceive",  label:"Al recibir la orden",        sub:"Confirmar al cliente que su equipo llegó"},
              {key:"autoOnState",    label:"Al cambiar de estado",       sub:"Notificar cada transición de estado"},
              {key:"autoOnReady",    label:"Al marcar como reparado",    sub:"Avisar que el equipo está listo"},
              {key:"autoOnDelivered",label:"Al entregar el servicio",    sub:"Enviar reporte PDF automáticamente"},
              {key:"adminCC",        label:"Copia al administrador",     sub:"CC en cada notificación enviada"},
            ].map(item => (
              <SettingRow key={item.key} label={item.label} sub={item.sub}>
                <Toggle value={notifs[item.key]} onChange={v=>setNotifs(p=>({...p,[item.key]:v}))}/>
              </SettingRow>
            ))}
          </Section>
        )}

        {/* ── SISTEMA ── */}
        {tab==="sistema" && (
          <div>
            <Section title="Operación">
              <SettingRow label="Prioridad por defecto" sub="Prioridad asignada a nuevas órdenes sin especificar">
                <select value={prefs.defaultPriority} onChange={e=>setPrefs(p=>({...p,defaultPriority:e.target.value}))}
                  style={{ padding:"7px 12px", borderRadius:8, border:`1px solid ${C.border}`, fontSize:13, background:"#fff", outline:"none" }}>
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>
              </SettingRow>
              <SettingRow label="Máximo de órdenes por técnico" sub="Límite de órdenes activas simultáneas">
                <input type="number" min="1" max="20" value={prefs.maxOrdersTech} onChange={e=>setPrefs(p=>({...p,maxOrdersTech:parseInt(e.target.value)}))}
                  style={{ width:70, padding:"7px 10px", borderRadius:8, border:`1px solid ${C.border}`, fontSize:13, textAlign:"center", outline:"none" }}/>
              </SettingRow>
              <SettingRow label="Horario de atención" sub="Horas de trabajo del equipo técnico">
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <input type="time" value={prefs.workStart} onChange={e=>setPrefs(p=>({...p,workStart:e.target.value}))}
                    style={{ padding:"7px 10px", borderRadius:8, border:`1px solid ${C.border}`, fontSize:13, outline:"none" }}/>
                  <span style={{ color:"#aaa", fontSize:12 }}>–</span>
                  <input type="time" value={prefs.workEnd} onChange={e=>setPrefs(p=>({...p,workEnd:e.target.value}))}
                    style={{ padding:"7px 10px", borderRadius:8, border:`1px solid ${C.border}`, fontSize:13, outline:"none" }}/>
                </div>
              </SettingRow>
              <SettingRow label="Zona horaria" sub="Zona usada para fechas y notificaciones">
                <select value={prefs.timezone} onChange={e=>setPrefs(p=>({...p,timezone:e.target.value}))}
                  style={{ padding:"7px 12px", borderRadius:8, border:`1px solid ${C.border}`, fontSize:13, background:"#fff", outline:"none" }}>
                  <option value="America/El_Salvador">América/El Salvador (CST)</option>
                  <option value="America/Mexico_City">América/Ciudad de México</option>
                  <option value="America/New_York">América/Nueva York (EST)</option>
                </select>
              </SettingRow>
            </Section>

            <Section title="Información del sistema">
              {[
                { label:"Versión SGS",     val:"1.0.0 Pilot" },
                { label:"Base de datos",   val:"Supabase PostgreSQL" },
                { label:"Hosting",         val:"Vercel (producción)" },
                { label:"Última copia",    val:"Hoy, 03:00 AM" },
                { label:"Almacenamiento",  val:"128 MB / 1 GB (13%)" },
              ].map(r => (
                <div key={r.label} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:`1px solid ${C.bg}`, fontSize:13 }}>
                  <span style={{ color:"#aaa" }}>{r.label}</span>
                  <span style={{ fontWeight:600, color:C.dark }}>{r.val}</span>
                </div>
              ))}
            </Section>

            <div style={{ background:C.redLt, borderRadius:12, padding:"16px 18px", border:`1px solid #F5ABAB` }}>
              <div style={{ fontSize:13, fontWeight:700, color:C.red, marginBottom:6 }}>Zona peligrosa</div>
              <div style={{ fontSize:12, color:"#777", marginBottom:12 }}>Estas acciones son irreversibles. Proceda con cuidado.</div>
              <div style={{ display:"flex", gap:10 }}>
                <button style={{ padding:"8px 16px", borderRadius:8, border:`1px solid #F5ABAB`, background:"#fff", color:C.red, fontSize:12, fontWeight:700, cursor:"pointer" }}>Exportar datos</button>
                <button style={{ padding:"8px 16px", borderRadius:8, border:"none", background:C.red, color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>Resetear sistema</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
