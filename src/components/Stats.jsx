"use client";
import { useState, useEffect, useRef } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

// ─── Palette ────────────────────────────────────────────────
const C = {
  blue:   "#3B8BD4", blueLt: "#E6F1FB",
  green:  "#1D9E75", greenLt:"#E1F5EE",
  amber:  "#BA7517", amberLt:"#FAEEDA",
  red:    "#E24B4A", redLt:  "#FCEBEB",
  purple: "#7F77DD", purpleLt:"#EEEDFE",
  dark:   "#1a1a1f", gray:   "#5F5E5A",
  border: "#e8e7e3", bg:     "#f5f4f0",
};

// ─── Data ────────────────────────────────────────────────────
const MONTHS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

const ordersPerMonth = [
  {mes:"Ene",taller:12,campo:8,total:20},
  {mes:"Feb",taller:15,campo:11,total:26},
  {mes:"Mar",taller:10,campo:14,total:24},
  {mes:"Abr",taller:18,campo:16,total:34},
  {mes:"May",taller:22,campo:13,total:35},
  {mes:"Jun",taller:19,campo:18,total:37},
  {mes:"Jul",taller:25,campo:20,total:45},
  {mes:"Ago",taller:21,campo:22,total:43},
  {mes:"Sep",taller:28,campo:19,total:47},
  {mes:"Oct",taller:24,campo:21,total:45},
  {mes:"Nov",taller:30,campo:25,total:55},
  {mes:"Dic",taller:26,campo:17,total:43},
];

const resolutionTime = [
  {mes:"Ene",hrs:38},{mes:"Feb",hrs:34},{mes:"Mar",hrs:42},
  {mes:"Abr",hrs:29},{mes:"May",hrs:26},{mes:"Jun",hrs:24},
  {mes:"Jul",hrs:22},{mes:"Ago",hrs:20},{mes:"Sep",hrs:18},
  {mes:"Oct",hrs:21},{mes:"Nov",hrs:19},{mes:"Dic",hrs:17},
];

const byEquipment = [
  {name:"Laptop",value:28,color:C.blue},
  {name:"Desktop",value:19,color:C.purple},
  {name:"Impresora",value:15,color:C.amber},
  {name:"Servidor",value:12,color:C.green},
  {name:"UPS",value:9,color:C.red},
  {name:"Redes",value:17,color:"#888"},
];

const satisfaction = [
  {label:"Excelente",count:58,pct:52,color:C.green},
  {label:"Muy bueno",count:29,pct:26,color:"#5DCAA5"},
  {label:"Bueno",count:14,pct:13,color:C.blue},
  {label:"Regular",count:7,pct:6,color:C.amber},
  {label:"Malo",count:3,pct:3,color:C.red},
];

const TECNICOS = [
  {name:"Carlos Méndez",   avatar:"CM",color:C.blue,  orders:34,resolved:31,avgHrs:19,sat:4.8,specialty:"Infraestructura"},
  {name:"Roberto García",  avatar:"RG",color:C.purple,orders:28,resolved:25,avgHrs:23,sat:4.5,specialty:"Eléctrico"},
  {name:"Ana Martínez",    avatar:"AM",color:C.green, orders:41,resolved:39,avgHrs:16,sat:4.9,specialty:"Redes"},
  {name:"Luis Portillo",   avatar:"LP",color:C.amber, orders:22,resolved:19,avgHrs:27,sat:4.3,specialty:"Hardware"},
];

const recentActivity = [
  {id:"OT-260012",client:"Banco Agrícola",   type:"taller",state:"reparado",  tech:"AM",hrs:14,sat:5},
  {id:"OT-260011",client:"Grupo Calleja",    type:"campo", state:"entregado", tech:"CM",hrs:8, sat:5},
  {id:"OT-260010",client:"AES El Salvador",  type:"taller",state:"reparado",  tech:"RG",hrs:22,sat:4},
  {id:"OT-260009",client:"Digicel",          type:"campo", state:"entregado", tech:"AM",hrs:6, sat:5},
  {id:"OT-260008",client:"Lab. Vijosa",      type:"taller",state:"entregado", tech:"LP",hrs:31,sat:4},
];

const stateColors = {
  recibido:"#3B8BD4", diagnostico:"#7F77DD", repuestos:"#BA7517",
  reparado:"#1D9E75", entregado:"#5F5E5A",
};
const stateLabels = {
  recibido:"Recibido", diagnostico:"Diagnóstico", repuestos:"En espera",
  reparado:"Reparado", entregado:"Entregado",
};

// ─── KPI Card ────────────────────────────────────────────────
const KPI = ({ label, value, sub, color, trend, icon }) => {
  const [display, setDisplay] = useState(0);
  const num = parseFloat(value);

  useEffect(() => {
    let start = 0;
    const end = num;
    const dur = 900;
    const step = 16;
    const inc = end / (dur / step);
    const t = setInterval(() => {
      start = Math.min(start + inc, end);
      setDisplay(start);
      if (start >= end) clearInterval(t);
    }, step);
    return () => clearInterval(t);
  }, [num]);

  const formatted = Number.isInteger(num)
    ? Math.round(display).toLocaleString()
    : display.toFixed(1);

  return (
    <div style={{
      background:"#fff", borderRadius:14, padding:"20px 22px",
      borderLeft:`4px solid ${color}`, position:"relative", overflow:"hidden",
    }}>
      <div style={{ fontSize:11, fontWeight:700, color:"#aaa", letterSpacing:0.8, textTransform:"uppercase", marginBottom:6 }}>{label}</div>
      <div style={{ fontSize:32, fontWeight:800, color:C.dark, lineHeight:1, marginBottom:4 }}>
        {formatted}{typeof value === "string" && value.includes("%") ? "%" : ""}
        {typeof value === "string" && value.includes("h") ? "h" : ""}
      </div>
      {sub && <div style={{ fontSize:12, color:"#888" }}>{sub}</div>}
      {trend && (
        <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:6 }}>
          <span style={{ fontSize:11, color:trend > 0 ? C.green : C.red, fontWeight:700 }}>
            {trend > 0 ? "▲" : "▼"} {Math.abs(trend)}%
          </span>
          <span style={{ fontSize:11, color:"#bbb" }}>vs. mes anterior</span>
        </div>
      )}
      <div style={{ position:"absolute", right:16, top:16, fontSize:28, opacity:0.08 }}>{icon}</div>
    </div>
  );
};

// ─── Section header ──────────────────────────────────────────
const SH = ({ title, sub }) => (
  <div style={{ marginBottom:14 }}>
    <div style={{ fontSize:15, fontWeight:700, color:C.dark }}>{title}</div>
    {sub && <div style={{ fontSize:12, color:"#aaa", marginTop:2 }}>{sub}</div>}
  </div>
);

// ─── Custom tooltip ──────────────────────────────────────────
const CustomTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#fff", border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", boxShadow:"0 4px 20px rgba(0,0,0,0.08)" }}>
      <div style={{ fontSize:11, fontWeight:700, color:"#999", marginBottom:6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize:13, fontWeight:600, color:p.color, display:"flex", gap:8 }}>
          <span>{p.name}:</span><span>{p.value}{p.name?.includes("hrs") || p.name==="Horas" ? "h" : ""}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Stars ───────────────────────────────────────────────────
const Stars = ({ n }) => (
  <span style={{ fontSize:12, color:C.amber }}>
    {"★".repeat(Math.floor(n))}{"☆".repeat(5 - Math.floor(n))}
    <span style={{ fontSize:11, color:"#888", marginLeft:4 }}>{n}</span>
  </span>
);

// ─── Period Selector ─────────────────────────────────────────
const PeriodBtn = ({ label, active, onClick }) => (
  <button onClick={onClick} style={{
    padding:"5px 14px", borderRadius:20, border:`1px solid ${active ? C.blue : C.border}`,
    background:active ? C.blueLt : "#fff", color:active ? C.blue : "#888",
    fontSize:12, fontWeight:600, cursor:"pointer", transition:"all 0.15s",
  }}>{label}</button>
);

// ─── Main Dashboard ──────────────────────────────────────────
export default function StatsDashboard() {
  const [period, setPeriod] = useState("año");
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    {id:"general",  label:"General"},
    {id:"tecnicos", label:"Técnicos"},
    {id:"equipos",  label:"Por equipo"},
    {id:"clientes", label:"Satisfacción"},
  ];

  // Filter data by period
  const months = period === "año" ? 12 : period === "6m" ? 6 : period === "3m" ? 3 : 1;
  const slicedOrders = ordersPerMonth.slice(-months);
  const slicedRes    = resolutionTime.slice(-months);
  const totalOrders  = slicedOrders.reduce((a, b) => a + b.total, 0);
  const avgRes       = Math.round(slicedRes.reduce((a, b) => a + b.hrs, 0) / slicedRes.length);

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>

      {/* Header */}
      <header style={{ background:C.dark, padding:"14px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:18, fontWeight:800, color:"#fff" }}>DTS</span>
          <span style={{ fontSize:18, fontWeight:300, color:C.blue }}>SGS</span>
          <div style={{ width:1, height:20, background:"#333", margin:"0 4px" }}/>
          <span style={{ fontSize:11, color:"#666" }}>Dashboard de estadísticas</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:11, color:"#555", background:"#2a2a32", padding:"4px 10px", borderRadius:6 }}>
            Actualizado: Hoy 16 abr 2026
          </span>
        </div>
      </header>

      {/* Tabs + Period */}
      <div style={{ background:"#fff", borderBottom:`1px solid ${C.border}`, padding:"0 24px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              padding:"13px 18px", border:"none", background:"none", cursor:"pointer",
              fontSize:13, fontWeight:activeTab===t.id ? 700 : 400,
              color:activeTab===t.id ? C.blue : "#888",
              borderBottom:`2px solid ${activeTab===t.id ? C.blue : "transparent"}`,
              transition:"all 0.15s",
            }}>{t.label}</button>
          ))}
        </div>
        <div style={{ display:"flex", gap:6 }}>
          {["1m","3m","6m","año"].map(p => (
            <PeriodBtn key={p} label={p==="año"?"12 meses":p} active={period===p} onClick={() => setPeriod(p)} />
          ))}
        </div>
      </div>

      <div style={{ padding:"24px", maxWidth:1200, margin:"0 auto" }}>

        {/* ═══ GENERAL TAB ════════════════════════════════════ */}
        {activeTab === "general" && (
          <div>
            {/* KPI row */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:14, marginBottom:24 }}>
              <KPI label="Órdenes totales"    value={totalOrders}  sub="En el período"      color={C.blue}   trend={+12} icon="📋"/>
              <KPI label="Tiempo promedio"    value={`${avgRes}h`} sub="Resolución"          color={C.purple} trend={-8}  icon="⏱"/>
              <KPI label="Tasa de resolución" value="91%"          sub="Completadas a tiempo"color={C.green}  trend={+3}  icon="✅"/>
              <KPI label="Satisfacción"       value="4.7"          sub="Promedio de 5"       color={C.amber}  trend={+5}  icon="⭐"/>
              <KPI label="Activas ahora"      value={8}            sub="En proceso"          color={C.red}    icon="🔄"/>
            </div>

            {/* Charts row 1 */}
            <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:16, marginBottom:16 }}>

              {/* Orders trend */}
              <div style={{ background:"#fff", borderRadius:14, padding:"20px 20px 12px", border:`1px solid ${C.border}` }}>
                <SH title="Órdenes por mes" sub="Visitas en campo vs. reparaciones en taller" />
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={slicedOrders} margin={{top:4,right:4,left:-24,bottom:0}}>
                    <defs>
                      <linearGradient id="gt" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={C.blue}  stopOpacity={0.2}/>
                        <stop offset="95%" stopColor={C.blue}  stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={C.purple} stopOpacity={0.2}/>
                        <stop offset="95%" stopColor={C.purple} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
                    <XAxis dataKey="mes" tick={{fontSize:11, fill:"#aaa"}} axisLine={false} tickLine={false}/>
                    <YAxis  tick={{fontSize:11, fill:"#aaa"}} axisLine={false} tickLine={false}/>
                    <Tooltip content={<CustomTip/>}/>
                    <Area type="monotone" dataKey="taller" name="Taller"  stroke={C.blue}   fill="url(#gt)" strokeWidth={2} dot={false}/>
                    <Area type="monotone" dataKey="campo"  name="Campo"   stroke={C.purple} fill="url(#gc)" strokeWidth={2} dot={false}/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Pie by type */}
              <div style={{ background:"#fff", borderRadius:14, padding:"20px", border:`1px solid ${C.border}` }}>
                <SH title="Distribución" sub="Tipo de servicio" />
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={[{name:"Taller",value:54},{name:"Campo",value:46}]}
                      cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                      paddingAngle={3} dataKey="value">
                      <Cell fill={C.blue}/>
                      <Cell fill={C.purple}/>
                    </Pie>
                    <Tooltip formatter={(v) => `${v}%`}/>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display:"flex", justifyContent:"center", gap:20 }}>
                  {[{label:"Taller",c:C.blue},{label:"Campo",c:C.purple}].map(l => (
                    <div key={l.label} style={{ display:"flex", alignItems:"center", gap:6, fontSize:12 }}>
                      <span style={{ width:10, height:10, borderRadius:"50%", background:l.c }}/>
                      {l.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Charts row 2 */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>

              {/* Resolution time */}
              <div style={{ background:"#fff", borderRadius:14, padding:"20px 20px 12px", border:`1px solid ${C.border}` }}>
                <SH title="Tiempo de resolución" sub="Promedio mensual en horas" />
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={slicedRes} margin={{top:4,right:4,left:-24,bottom:0}}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
                    <XAxis dataKey="mes" tick={{fontSize:11,fill:"#aaa"}} axisLine={false} tickLine={false}/>
                    <YAxis  tick={{fontSize:11,fill:"#aaa"}} axisLine={false} tickLine={false}/>
                    <Tooltip content={<CustomTip/>} formatter={(v)=>`${v}h`}/>
                    <Bar dataKey="hrs" name="Horas" fill={C.purple} radius={[4,4,0,0]} maxBarSize={32}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* States pipeline */}
              <div style={{ background:"#fff", borderRadius:14, padding:"20px", border:`1px solid ${C.border}` }}>
                <SH title="Estado actual de órdenes" sub="Órdenes activas en el sistema" />
                <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:4 }}>
                  {[
                    {state:"recibido",count:2},
                    {state:"diagnostico",count:3},
                    {state:"repuestos",count:1},
                    {state:"reparado",count:2},
                  ].map(({state, count}) => {
                    const maxCount = 3;
                    const pct = (count / maxCount) * 100;
                    return (
                      <div key={state}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                          <span style={{ fontSize:12, fontWeight:600, color:stateColors[state] }}>{stateLabels[state]}</span>
                          <span style={{ fontSize:12, fontWeight:700, color:C.dark }}>{count}</span>
                        </div>
                        <div style={{ height:8, background:C.bg, borderRadius:4, overflow:"hidden" }}>
                          <div style={{ height:"100%", width:`${Math.min(pct,100)}%`, background:stateColors[state], borderRadius:4, transition:"width 0.8s ease" }}/>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent orders */}
            <div style={{ background:"#fff", borderRadius:14, padding:"20px", border:`1px solid ${C.border}` }}>
              <SH title="Órdenes recientes cerradas" sub="Últimas 5 órdenes completadas" />
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                  <thead>
                    <tr style={{ background:C.bg }}>
                      {["Orden","Cliente","Tipo","Estado","Técnico","Tiempo","Satisfacción"].map(h => (
                        <th key={h} style={{ padding:"8px 12px", textAlign:"left", fontSize:11, fontWeight:700, color:"#aaa", letterSpacing:0.4, whiteSpace:"nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivity.map((r, i) => (
                      <tr key={r.id} style={{ borderTop:`1px solid ${C.bg}` }}
                        onMouseEnter={e => e.currentTarget.style.background = C.bg}
                        onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                        <td style={{ padding:"10px 12px", fontWeight:700, color:C.blue }}>{r.id}</td>
                        <td style={{ padding:"10px 12px" }}>{r.client}</td>
                        <td style={{ padding:"10px 12px" }}>
                          <span style={{ padding:"2px 8px", borderRadius:6, fontSize:11, fontWeight:600,
                            background:r.type==="taller" ? C.purpleLt : C.blueLt,
                            color:r.type==="taller" ? "#534AB7" : "#185FA5" }}>
                            {r.type==="taller" ? "Taller" : "Campo"}
                          </span>
                        </td>
                        <td style={{ padding:"10px 12px" }}>
                          <span style={{ padding:"2px 8px", borderRadius:6, fontSize:11, fontWeight:600,
                            background:r.state==="entregado" ? "#F1EFE8" : C.greenLt,
                            color:r.state==="entregado" ? C.gray : C.green }}>
                            {stateLabels[r.state]}
                          </span>
                        </td>
                        <td style={{ padding:"10px 12px" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                            <div style={{ width:26, height:26, borderRadius:"50%", background:`${TECNICOS.find(t=>t.avatar===r.tech)?.color}18`, color:TECNICOS.find(t=>t.avatar===r.tech)?.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700 }}>{r.tech}</div>
                          </div>
                        </td>
                        <td style={{ padding:"10px 12px", fontWeight:600 }}>{r.hrs}h</td>
                        <td style={{ padding:"10px 12px" }}>
                          <Stars n={r.sat}/>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ═══ TÉCNICOS TAB ═══════════════════════════════════ */}
        {activeTab === "tecnicos" && (
          <div>
            {/* Tecnico KPIs */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:14, marginBottom:24 }}>
              {TECNICOS.map(t => (
                <div key={t.name} style={{ background:"#fff", borderRadius:14, overflow:"hidden", border:`1px solid ${C.border}` }}>
                  <div style={{ height:4, background:t.color }}/>
                  <div style={{ padding:"16px 18px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
                      <div style={{ width:42, height:42, borderRadius:"50%", background:`${t.color}18`, color:t.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:800 }}>{t.avatar}</div>
                      <div>
                        <div style={{ fontSize:14, fontWeight:700, color:C.dark }}>{t.name}</div>
                        <div style={{ fontSize:11, color:"#aaa" }}>{t.specialty}</div>
                      </div>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                      {[
                        {label:"Órdenes",val:t.orders},
                        {label:"Resueltas",val:t.resolved},
                        {label:"Tiempo prom.",val:`${t.avgHrs}h`},
                        {label:"Satisfacción",val:`${t.sat}/5`},
                      ].map(f => (
                        <div key={f.label} style={{ background:C.bg, borderRadius:8, padding:"10px 12px" }}>
                          <div style={{ fontSize:10, color:"#bbb", fontWeight:600, textTransform:"uppercase", letterSpacing:0.4 }}>{f.label}</div>
                          <div style={{ fontSize:18, fontWeight:800, color:t.color, marginTop:2 }}>{f.val}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop:12 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#aaa", marginBottom:4 }}>
                        <span>Tasa resolución</span>
                        <span style={{ fontWeight:700, color:C.dark }}>{Math.round((t.resolved/t.orders)*100)}%</span>
                      </div>
                      <div style={{ height:6, background:C.bg, borderRadius:3, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${(t.resolved/t.orders)*100}%`, background:t.color, borderRadius:3 }}/>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison chart */}
            <div style={{ background:"#fff", borderRadius:14, padding:"20px 20px 12px", border:`1px solid ${C.border}` }}>
              <SH title="Comparativa de técnicos" sub="Órdenes asignadas vs. resueltas" />
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={TECNICOS.map(t=>({name:t.name.split(" ")[0],asignadas:t.orders,resueltas:t.resolved}))} margin={{top:4,right:4,left:-24,bottom:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
                  <XAxis dataKey="name" tick={{fontSize:12,fill:"#aaa"}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:11,fill:"#aaa"}} axisLine={false} tickLine={false}/>
                  <Tooltip content={<CustomTip/>}/>
                  <Legend wrapperStyle={{fontSize:12,paddingTop:8}}/>
                  <Bar dataKey="asignadas" name="Asignadas" fill={C.blue}   radius={[4,4,0,0]} maxBarSize={36}/>
                  <Bar dataKey="resueltas" name="Resueltas" fill={C.green}  radius={[4,4,0,0]} maxBarSize={36}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ═══ EQUIPOS TAB ════════════════════════════════════ */}
        {activeTab === "equipos" && (
          <div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
              {/* Pie */}
              <div style={{ background:"#fff", borderRadius:14, padding:"20px", border:`1px solid ${C.border}` }}>
                <SH title="Órdenes por tipo de equipo" sub="Distribución en el período" />
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={byEquipment} cx="50%" cy="50%" outerRadius={80} paddingAngle={2} dataKey="value" label={({name,pct})=>`${name}`} labelLine={false}>
                      {byEquipment.map((e, i) => <Cell key={i} fill={e.color}/>)}
                    </Pie>
                    <Tooltip formatter={(v)=>`${v}%`}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Bar */}
              <div style={{ background:"#fff", borderRadius:14, padding:"20px 20px 12px", border:`1px solid ${C.border}` }}>
                <SH title="Ranking de equipos" sub="Por volumen de órdenes" />
                <div style={{ display:"flex", flexDirection:"column", gap:12, marginTop:8 }}>
                  {byEquipment.sort((a,b)=>b.value-a.value).map((e,i) => (
                    <div key={e.name}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <span style={{ fontSize:11, fontWeight:700, color:"#bbb", width:14 }}>#{i+1}</span>
                          <span style={{ fontSize:13, fontWeight:600, color:C.dark }}>{e.name}</span>
                        </div>
                        <span style={{ fontSize:12, fontWeight:700, color:e.color }}>{e.value}%</span>
                      </div>
                      <div style={{ height:8, background:C.bg, borderRadius:4, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${e.value*3}%`, background:e.color, borderRadius:4 }}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Faults by equipment */}
            <div style={{ background:"#fff", borderRadius:14, padding:"20px", border:`1px solid ${C.border}` }}>
              <SH title="Fallas más frecuentes" sub="Top 5 por tipo de equipo"/>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:12 }}>
                {[
                  {eq:"Laptop",faults:["No enciende","Pantalla dañada","Batería"],color:C.blue},
                  {eq:"Desktop",faults:["Pantalla azul","Fuente dañada","Sin video"],color:C.purple},
                  {eq:"Impresora",faults:["No imprime","Atascos papel","Manchas"],color:C.amber},
                  {eq:"Servidor",faults:["Error RAID","Sobrecalent.","Disco dañado"],color:C.green},
                ].map(e => (
                  <div key={e.eq} style={{ padding:"14px", background:C.bg, borderRadius:10, borderLeft:`3px solid ${e.color}` }}>
                    <div style={{ fontSize:13, fontWeight:700, color:e.color, marginBottom:8 }}>{e.eq}</div>
                    {e.faults.map((f,i) => (
                      <div key={f} style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                        <span style={{ fontSize:11, fontWeight:700, color:"#bbb" }}>#{i+1}</span>
                        <span style={{ fontSize:12, color:C.dark }}>{f}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ SATISFACCIÓN TAB ═══════════════════════════════ */}
        {activeTab === "clientes" && (
          <div>
            {/* Big score */}
            <div style={{ background:"#fff", borderRadius:14, padding:"32px", border:`1px solid ${C.border}`, marginBottom:16, textAlign:"center" }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#aaa", letterSpacing:0.8, textTransform:"uppercase", marginBottom:8 }}>Satisfacción general</div>
              <div style={{ fontSize:64, fontWeight:800, color:C.amber, lineHeight:1 }}>4.7</div>
              <div style={{ fontSize:24, color:C.amber, margin:"8px 0" }}>★★★★★</div>
              <div style={{ fontSize:14, color:"#888" }}>Basado en 111 evaluaciones en el período</div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
              {/* Breakdown */}
              <div style={{ background:"#fff", borderRadius:14, padding:"20px", border:`1px solid ${C.border}` }}>
                <SH title="Desglose de calificaciones"/>
                {satisfaction.map(s => (
                  <div key={s.label} style={{ marginBottom:12 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                      <span style={{ fontSize:13, fontWeight:600, color:C.dark }}>{s.label}</span>
                      <span style={{ fontSize:12, color:"#aaa" }}>{s.count} ({s.pct}%)</span>
                    </div>
                    <div style={{ height:10, background:C.bg, borderRadius:5, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${s.pct}%`, background:s.color, borderRadius:5 }}/>
                    </div>
                  </div>
                ))}
              </div>

              {/* Per technician */}
              <div style={{ background:"#fff", borderRadius:14, padding:"20px", border:`1px solid ${C.border}` }}>
                <SH title="Satisfacción por técnico"/>
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  {TECNICOS.sort((a,b)=>b.sat-a.sat).map(t => (
                    <div key={t.name} style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{ width:34, height:34, borderRadius:"50%", background:`${t.color}18`, color:t.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, flexShrink:0 }}>{t.avatar}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                          <span style={{ fontSize:13, fontWeight:600, color:C.dark }}>{t.name.split(" ")[0]}</span>
                          <Stars n={t.sat}/>
                        </div>
                        <div style={{ height:6, background:C.bg, borderRadius:3, overflow:"hidden" }}>
                          <div style={{ height:"100%", width:`${(t.sat/5)*100}%`, background:t.color, borderRadius:3 }}/>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Comments */}
            <div style={{ background:"#fff", borderRadius:14, padding:"20px", border:`1px solid ${C.border}` }}>
              <SH title="Comentarios recientes de clientes"/>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:12 }}>
                {[
                  {text:"Excelente servicio, muy puntuales y profesionales.",client:"Juan Pérez",company:"Banco Agrícola",sat:5,tech:"AM"},
                  {text:"El técnico resolvió el problema rápidamente y explicó todo claramente.",client:"María Rodríguez",company:"Grupo Calleja",sat:5,tech:"CM"},
                  {text:"Buen trabajo aunque esperamos un poco para los repuestos.",client:"Luis Martínez",company:"AES El Salvador",sat:4,tech:"RG"},
                  {text:"Muy satisfechos con la atención, regresaremos.",client:"Ana García",company:"Digicel",sat:5,tech:"AM"},
                ].map((c,i) => (
                  <div key={i} style={{ padding:"14px 16px", background:C.bg, borderRadius:10, borderLeft:`3px solid ${C.amber}` }}>
                    <div style={{ fontSize:13, color:"#555", fontStyle:"italic", lineHeight:1.5, marginBottom:10 }}>"{c.text}"</div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div>
                        <div style={{ fontSize:12, fontWeight:700, color:C.dark }}>{c.client}</div>
                        <div style={{ fontSize:11, color:"#aaa" }}>{c.company}</div>
                      </div>
                      <Stars n={c.sat}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
