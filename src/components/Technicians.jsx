"use client";
import { useState } from "react";

const C = { blue:"#3B8BD4", blueLt:"#E6F1FB", green:"#1D9E75", greenLt:"#E1F5EE", amber:"#BA7517", amberLt:"#FAEEDA", red:"#E24B4A", redLt:"#FCEBEB", purple:"#7F77DD", purpleLt:"#EEEDFE", dark:"#1a1a1f", border:"#e8e7e3", bg:"#f5f4f0" };

const TECNICOS = [
  { id:1, name:"Carlos Méndez",  avatar:"CM", color:C.blue,   specialty:"Infraestructura / Servidores", phone:"(503) 7555-0001", email:"cmendez@dts.com.sv",  status:"activo",   orders:3, maxOrders:5 },
  { id:2, name:"Roberto García", avatar:"RG", color:C.purple, specialty:"Sistemas Eléctricos",          phone:"(503) 7555-0002", email:"rgarcia@dts.com.sv",  status:"campo",    orders:4, maxOrders:5 },
  { id:3, name:"Ana Martínez",   avatar:"AM", color:C.green,  specialty:"Redes y Comunicaciones",       phone:"(503) 7555-0003", email:"amartinez@dts.com.sv",status:"activo",   orders:2, maxOrders:5 },
  { id:4, name:"Luis Portillo",  avatar:"LP", color:C.amber,  specialty:"Hardware / Equipos",           phone:"(503) 7555-0004", email:"lportillo@dts.com.sv", status:"libre",    orders:1, maxOrders:5 },
];

const TODAY = new Date(2026, 3, 16);
const DAYS  = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];
const MONTHS= ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

const AGENDA = [
  { id:"OT-260001", techId:1, date:"2026-04-16", time:"09:00", type:"campo",  client:"Banco Agrícola",    desc:"Mantenimiento servidor",  state:"activo"  },
  { id:"OT-260002", techId:2, date:"2026-04-16", time:"10:30", type:"campo",  client:"Grupo Calleja",     desc:"Reparación UPS",          state:"campo"   },
  { id:"OT-260003", techId:3, date:"2026-04-16", time:"08:00", type:"taller", client:"AES El Salvador",   desc:"Cableado piso 3",         state:"activo"  },
  { id:"OT-260007", techId:4, date:"2026-04-16", time:"14:00", type:"taller", client:"Digicel",           desc:"Laptop ejecutiva",        state:"libre"   },
  { id:"OT-260008", techId:1, date:"2026-04-17", time:"09:00", type:"campo",  client:"Lab. Vijosa",       desc:"Revisión red",            state:"pendiente"},
  { id:"OT-260009", techId:3, date:"2026-04-17", time:"11:00", type:"campo",  client:"TIGO El Salvador",  desc:"Config. access points",   state:"pendiente"},
  { id:"OT-260010", techId:2, date:"2026-04-18", time:"08:30", type:"taller", client:"Banco Agrícola",    desc:"Switch diagnóstico",      state:"pendiente"},
  { id:"OT-260011", techId:4, date:"2026-04-18", time:"10:00", type:"campo",  client:"Ind. La Constancia","desc":"UPS revisión",           state:"pendiente"},
];

const statusLabel = { activo:"En oficina", campo:"En campo", libre:"Disponible", pendiente:"Pendiente" };
const statusColors = { activo:[C.blue,C.blueLt], campo:[C.amber,C.amberLt], libre:[C.green,C.greenLt], pendiente:[C.purple,C.purpleLt] };

const getWeekDays = (offset=0) => {
  const start = new Date(TODAY);
  start.setDate(start.getDate() - start.getDay() + 1 + offset*7);
  return Array.from({length:7}, (_,i) => { const d=new Date(start); d.setDate(d.getDate()+i); return d; });
};

export default function Tecnicos() {
  const [tab, setTab]         = useState("agenda");
  const [weekOff, setWeekOff] = useState(0);
  const [selTech, setSelTech] = useState(null);
  const weekDays = getWeekDays(weekOff);

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>
      <header style={{ background:C.dark, padding:"14px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:18, fontWeight:800, color:"#fff" }}>DTS</span>
          <span style={{ fontSize:18, fontWeight:300, color:C.blue }}>SGS</span>
          <div style={{ width:1, height:20, background:"#333", margin:"0 4px" }}/>
          <span style={{ fontSize:11, color:"#666" }}>Gestión de técnicos</span>
        </div>
      </header>

      <div style={{ background:"#fff", borderBottom:`1px solid ${C.border}`, padding:"0 24px", display:"flex" }}>
        {[{id:"agenda",label:"Agenda semanal"},{id:"tecnicos",label:"Técnicos"},{id:"carga",label:"Carga de trabajo"}].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding:"13px 18px", border:"none", background:"none", cursor:"pointer", fontSize:13, fontWeight:tab===t.id?700:400, color:tab===t.id?C.blue:"#888", borderBottom:`2px solid ${tab===t.id?C.blue:"transparent"}`, transition:"all 0.15s" }}>{t.label}</button>
        ))}
      </div>

      <div style={{ padding:"24px", maxWidth:1100, margin:"0 auto" }}>

        {/* AGENDA */}
        {tab === "agenda" && (
          <div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
              <button onClick={() => setWeekOff(p=>p-1)} style={{ padding:"6px 14px", borderRadius:8, border:`1px solid ${C.border}`, background:"#fff", cursor:"pointer", fontSize:13 }}>← Anterior</button>
              <div style={{ fontSize:15, fontWeight:700 }}>
                {MONTHS[weekDays[0].getMonth()]} {weekDays[0].getDate()} — {MONTHS[weekDays[6].getMonth()]} {weekDays[6].getDate()}, {weekDays[0].getFullYear()}
              </div>
              <button onClick={() => setWeekOff(p=>p+1)} style={{ padding:"6px 14px", borderRadius:8, border:`1px solid ${C.border}`, background:"#fff", cursor:"pointer", fontSize:13 }}>Siguiente →</button>
            </div>

            <div style={{ background:"#fff", borderRadius:14, overflow:"hidden", border:`1px solid ${C.border}` }}>
              {/* Header row */}
              <div style={{ display:"grid", gridTemplateColumns:"100px repeat(7,1fr)" }}>
                <div style={{ background:C.bg, padding:"10px 12px", borderRight:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}/>
                {weekDays.map((d,i) => {
                  const isToday = d.toDateString() === TODAY.toDateString();
                  return (
                    <div key={i} style={{ background:isToday?C.dark:C.bg, padding:"10px 8px", textAlign:"center", borderRight:i<6?`1px solid ${C.border}`:"none", borderBottom:`1px solid ${C.border}` }}>
                      <div style={{ fontSize:10, color:isToday?"#999":"#aaa", fontWeight:600 }}>{DAYS[i]}</div>
                      <div style={{ fontSize:18, fontWeight:800, color:isToday?"#fff":"#333" }}>{d.getDate()}</div>
                    </div>
                  );
                })}
              </div>

              {/* Tech rows */}
              {TECNICOS.map(tech => (
                <div key={tech.id} style={{ display:"grid", gridTemplateColumns:"100px repeat(7,1fr)", borderTop:`1px solid ${C.border}` }}>
                  <div style={{ background:C.bg, padding:"12px 10px", borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4 }}>
                    <div style={{ width:30, height:30, borderRadius:"50%", background:`${tech.color}18`, color:tech.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700 }}>{tech.avatar}</div>
                    <div style={{ fontSize:9, fontWeight:600, color:"#888", textAlign:"center", lineHeight:1.2 }}>{tech.name.split(" ")[0]}</div>
                  </div>
                  {weekDays.map((d,i) => {
                    const dateStr = d.toISOString().split("T")[0];
                    const dayJobs = AGENDA.filter(a => a.techId===tech.id && a.date===dateStr);
                    return (
                      <div key={i} style={{ minHeight:90, padding:4, borderRight:i<6?`1px solid ${C.border}`:"none", borderTop:`1px solid ${C.bg}` }}>
                        {dayJobs.map(job => (
                          <div key={job.id} style={{ padding:"5px 6px", marginBottom:3, borderRadius:5, background:job.type==="campo"?C.blueLt:C.purpleLt, borderLeft:`3px solid ${job.type==="campo"?C.blue:C.purple}`, cursor:"pointer", fontSize:10, lineHeight:1.3 }}>
                            <div style={{ fontWeight:700, color:"#333" }}>{job.time}</div>
                            <div style={{ color:"#666", marginTop:1, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{job.desc}</div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TÉCNICOS */}
        {tab === "tecnicos" && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16 }}>
            {TECNICOS.map(t => {
              const [sc, bg] = statusColors[t.status] || [C.gray, C.bg];
              return (
                <div key={t.id} style={{ background:"#fff", borderRadius:14, overflow:"hidden", border:`1px solid ${C.border}` }}>
                  <div style={{ height:4, background:t.color }}/>
                  <div style={{ padding:"20px 20px 16px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:14 }}>
                    <div style={{ width:48, height:48, borderRadius:"50%", background:`${t.color}18`, color:t.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:800 }}>{t.avatar}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:15, fontWeight:700 }}>{t.name}</div>
                      <div style={{ fontSize:11, fontWeight:600, color:t.color, background:`${t.color}15`, padding:"2px 8px", borderRadius:4, marginTop:3, display:"inline-block" }}>{t.specialty}</div>
                    </div>
                    <span style={{ padding:"4px 10px", borderRadius:20, fontSize:11, fontWeight:700, background:bg, color:sc }}>{statusLabel[t.status]}</span>
                  </div>
                  <div style={{ padding:"14px 20px" }}>
                    <div style={{ fontSize:12, color:"#888", marginBottom:6 }}>{t.phone} · {t.email}</div>
                    <div style={{ marginTop:12 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4 }}>
                        <span style={{ color:"#aaa", fontWeight:600 }}>Carga de trabajo</span>
                        <span style={{ fontWeight:700, color:C.dark }}>{t.orders}/{t.maxOrders} órdenes</span>
                      </div>
                      <div style={{ height:8, background:C.bg, borderRadius:4, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${(t.orders/t.maxOrders)*100}%`, background:t.orders===t.maxOrders?C.red:t.color, borderRadius:4 }}/>
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:8, marginTop:14 }}>
                      <button style={{ flex:1, padding:"8px", borderRadius:8, border:`1px solid ${C.border}`, background:"#fff", fontSize:12, fontWeight:600, cursor:"pointer", color:"#555" }}>Ver agenda</button>
                      <button style={{ flex:1, padding:"8px", borderRadius:8, border:"none", background:C.blue, color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>Asignar orden</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CARGA */}
        {tab === "carga" && (
          <div>
            <div style={{ background:"#fff", borderRadius:14, padding:"20px", border:`1px solid ${C.border}`, marginBottom:16 }}>
              <div style={{ fontSize:15, fontWeight:700, marginBottom:16 }}>Distribución de carga actual</div>
              {TECNICOS.map(t => (
                <div key={t.id} style={{ marginBottom:16 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:6 }}>
                    <div style={{ width:32, height:32, borderRadius:"50%", background:`${t.color}18`, color:t.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700 }}>{t.avatar}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                        <span style={{ fontSize:13, fontWeight:600 }}>{t.name}</span>
                        <span style={{ fontSize:12, fontWeight:700, color:t.orders===t.maxOrders?C.red:C.dark }}>{t.orders}/{t.maxOrders}</span>
                      </div>
                      <div style={{ height:12, background:C.bg, borderRadius:6, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${(t.orders/t.maxOrders)*100}%`, background:t.orders===t.maxOrders?C.red:t.color, borderRadius:6, transition:"width 0.6s" }}/>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background:"#fff", borderRadius:14, padding:"20px", border:`1px solid ${C.border}` }}>
              <div style={{ fontSize:15, fontWeight:700, marginBottom:14 }}>Órdenes de hoy</div>
              {AGENDA.filter(a => a.date==="2026-04-16").map(job => {
                const tech = TECNICOS.find(t => t.id===job.techId);
                return (
                  <div key={job.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:`1px solid ${C.bg}` }}>
                    <div style={{ width:32, height:32, borderRadius:"50%", background:`${tech?.color}18`, color:tech?.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700 }}>{tech?.avatar}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:600 }}>{job.desc}</div>
                      <div style={{ fontSize:11, color:"#aaa" }}>{job.client} · {job.time}</div>
                    </div>
                    <span style={{ fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:8, background:job.type==="campo"?C.blueLt:C.purpleLt, color:job.type==="campo"?"#185FA5":"#534AB7" }}>{job.type==="campo"?"Campo":"Taller"}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
