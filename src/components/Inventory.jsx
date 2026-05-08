"use client";
import { useState } from "react";

const INVENTORY = [
  { id:1, name:"Ventilador Dell 60mm 5000RPM", partNo:"0GRTH3",    category:"Servidores",  stock:4,  min:3,  unit:"pza", cost:28.50,  location:"Estante A1" },
  { id:2, name:"Memoria RAM DDR4 8GB",          partNo:"KVR32N22S8", category:"Computadoras",stock:12, min:5,  unit:"pza", cost:35.00,  location:"Estante B2" },
  { id:3, name:"Disco SSD 480GB",               partNo:"SA400S37",   category:"Computadoras",stock:2,  min:4,  unit:"pza", cost:55.00,  location:"Estante B3" },
  { id:4, name:"Cable de red Cat6A 1m",          partNo:"CAT6A-1M",   category:"Redes",       stock:45, min:20, unit:"pza", cost:3.50,   location:"Estante C1" },
  { id:5, name:"Patch panel 24 puertos",         partNo:"PP24-5E",    category:"Redes",       stock:1,  min:2,  unit:"pza", cost:45.00,  location:"Estante C2" },
  { id:6, name:"Batería UPS 12V 9Ah",            partNo:"UPS-BAT-12", category:"UPS",         stock:6,  min:4,  unit:"pza", cost:22.00,  location:"Estante D1" },
  { id:7, name:"Fuente de poder 600W",           partNo:"PSU-600-80", category:"Computadoras",stock:3,  min:3,  unit:"pza", cost:65.00,  location:"Estante B1" },
  { id:8, name:"Transceiver SFP 1G",            partNo:"SFP-1G-SX",  category:"Redes",       stock:8,  min:4,  unit:"pza", cost:18.00,  location:"Estante C3" },
  { id:9, name:"Pasta térmica Thermal Grizzly", partNo:"TG-KR-015",  category:"Servidores",  stock:7,  min:5,  unit:"tubo",cost:12.00,  location:"Estante A2" },
  { id:10,name:"Conector RJ45 Cat6 (bolsa 50)", partNo:"RJ45-C6-50", category:"Redes",       stock:0,  min:5,  unit:"bolsa",cost:8.00,  location:"Estante C1" },
  { id:11,name:"Teclado USB estándar",           partNo:"KB-USB-ES",  category:"Periféricos", stock:5,  min:3,  unit:"pza", cost:15.00,  location:"Estante E1" },
  { id:12,name:"Mouse óptico USB",               partNo:"MS-OPT-USB", category:"Periféricos", stock:4,  min:3,  unit:"pza", cost:10.00,  location:"Estante E1" },
];

const MOVEMENTS = [
  { id:1, date:"2026-04-16", type:"salida",  item:"Ventilador Dell 60mm",  qty:2, order:"OT-260001", tech:"Carlos M." },
  { id:2, date:"2026-04-16", type:"salida",  item:"Pasta térmica",          qty:1, order:"OT-260001", tech:"Carlos M." },
  { id:3, date:"2026-04-15", type:"entrada", item:"Memoria RAM DDR4 8GB",   qty:5, order:"OC-2026-04", tech:"Admin" },
  { id:4, date:"2026-04-14", type:"salida",  item:"Disco SSD 480GB",        qty:1, order:"OT-260003", tech:"Ana M." },
  { id:5, date:"2026-04-13", type:"salida",  item:"Cable Cat6A 1m",         qty:10,order:"OT-260005", tech:"Roberto G." },
  { id:6, date:"2026-04-12", type:"entrada", item:"Batería UPS 12V 9Ah",    qty:4, order:"OC-2026-03", tech:"Admin" },
];

const CATS = ["Todos", "Computadoras", "Servidores", "Redes", "UPS", "Periféricos"];

const C = { blue:"#3B8BD4", green:"#1D9E75", amber:"#BA7517", red:"#E24B4A", gray:"#5F5E5A", dark:"#1a1a1f", border:"#e8e7e3", bg:"#f5f4f0" };

const statusOf = (item) => {
  if (item.stock === 0) return { label:"Sin stock", color:C.red,   bg:"#FCEBEB" };
  if (item.stock < item.min) return { label:"Stock bajo", color:C.amber, bg:"#FAEEDA" };
  return { label:"OK",        color:C.green, bg:"#E1F5EE" };
};

export default function Inventario() {
  const [tab, setTab]           = useState("stock");
  const [cat, setCat]           = useState("Todos");
  const [search, setSearch]     = useState("");
  const [showAdd, setShowAdd]   = useState(false);
  const [newItem, setNewItem]   = useState({ name:"", partNo:"", category:"Computadoras", stock:0, min:1, unit:"pza", cost:0, location:"" });
  const [inventory, setInventory] = useState(INVENTORY);
  const [saved, setSaved]       = useState(false);

  const filtered = inventory.filter(i =>
    (cat === "Todos" || i.category === cat) &&
    (i.name.toLowerCase().includes(search.toLowerCase()) || i.partNo.toLowerCase().includes(search.toLowerCase()))
  );

  const lowStock  = inventory.filter(i => i.stock > 0 && i.stock < i.min).length;
  const noStock   = inventory.filter(i => i.stock === 0).length;
  const totalVal  = inventory.reduce((a,b) => a + b.stock * b.cost, 0);

  const handleAdd = () => {
    setInventory(p => [...p, { ...newItem, id: p.length + 1, stock: parseInt(newItem.stock), min: parseInt(newItem.min), cost: parseFloat(newItem.cost) }]);
    setShowAdd(false);
    setNewItem({ name:"", partNo:"", category:"Computadoras", stock:0, min:1, unit:"pza", cost:0, location:"" });
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>
      <header style={{ background:C.dark, padding:"14px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:18, fontWeight:800, color:"#fff" }}>DTS</span>
          <span style={{ fontSize:18, fontWeight:300, color:C.blue }}>SGS</span>
          <div style={{ width:1, height:20, background:"#333", margin:"0 4px" }}/>
          <span style={{ fontSize:11, color:"#666" }}>Inventario de repuestos</span>
        </div>
        <button onClick={() => setShowAdd(true)} style={{ padding:"7px 16px", borderRadius:8, border:"none", background:C.blue, color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>+ Nuevo repuesto</button>
      </header>

      {/* Tabs */}
      <div style={{ background:"#fff", borderBottom:`1px solid ${C.border}`, padding:"0 24px", display:"flex", gap:0 }}>
        {[{id:"stock",label:"Stock"},{id:"movimientos",label:"Movimientos"},{id:"alertas",label:`Alertas (${lowStock+noStock})`}].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding:"13px 18px", border:"none", background:"none", cursor:"pointer", fontSize:13, fontWeight:tab===t.id?700:400, color:tab===t.id?C.blue:"#888", borderBottom:`2px solid ${tab===t.id?C.blue:"transparent"}`, transition:"all 0.15s" }}>{t.label}</button>
        ))}
      </div>

      <div style={{ padding:"24px", maxWidth:1100, margin:"0 auto" }}>

        {/* KPIs */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
          {[
            { label:"Total repuestos", val:inventory.length, color:C.blue },
            { label:"Sin stock",       val:noStock,           color:C.red },
            { label:"Stock bajo",      val:lowStock,          color:C.amber },
            { label:"Valor inventario",val:`$${totalVal.toFixed(0)}`, color:C.green },
          ].map(k => (
            <div key={k.label} style={{ background:"#fff", borderRadius:12, padding:"16px 18px", borderLeft:`4px solid ${k.color}` }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#aaa", letterSpacing:0.6, textTransform:"uppercase", marginBottom:4 }}>{k.label}</div>
              <div style={{ fontSize:26, fontWeight:800, color:k.color }}>{k.val}</div>
            </div>
          ))}
        </div>

        {/* STOCK TAB */}
        {tab === "stock" && (
          <div>
            <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
              <input type="text" placeholder="Buscar por nombre o número de parte..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ flex:1, minWidth:220, padding:"9px 14px", borderRadius:9, border:`1px solid ${C.border}`, fontSize:13, outline:"none", background:"#fff" }}/>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {CATS.map(c => (
                  <button key={c} onClick={() => setCat(c)} style={{ padding:"6px 14px", borderRadius:20, border:`1px solid ${cat===c?C.blue:C.border}`, background:cat===c?"#E6F1FB":"#fff", color:cat===c?C.blue:"#888", fontSize:12, fontWeight:600, cursor:"pointer" }}>{c}</button>
                ))}
              </div>
            </div>

            <div style={{ background:"#fff", borderRadius:14, overflow:"hidden", border:`1px solid ${C.border}` }}>
              <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 80px 80px 80px 100px 80px", padding:"10px 16px", background:C.bg, fontSize:11, fontWeight:700, color:"#aaa", letterSpacing:0.3 }}>
                <span>Descripción</span><span>Categoría</span><span>Ubicación</span><span>Stock</span><span>Mínimo</span><span>Costo</span><span>Estado</span><span>Acciones</span>
              </div>
              {filtered.map((item, i) => {
                const st = statusOf(item);
                return (
                  <div key={item.id} style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 80px 80px 80px 100px 80px", padding:"12px 16px", borderTop:`1px solid ${C.bg}`, alignItems:"center", fontSize:13 }}
                    onMouseEnter={e => e.currentTarget.style.background = C.bg}
                    onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                    <div>
                      <div style={{ fontWeight:600, color:C.dark }}>{item.name}</div>
                      <div style={{ fontSize:11, color:"#bbb", marginTop:1 }}>{item.partNo}</div>
                    </div>
                    <span style={{ fontSize:12, color:"#888" }}>{item.category}</span>
                    <span style={{ fontSize:12, color:"#888" }}>{item.location}</span>
                    <span style={{ fontWeight:700, color:item.stock===0?C.red:item.stock<item.min?C.amber:C.dark }}>{item.stock} {item.unit}</span>
                    <span style={{ fontSize:12, color:"#aaa" }}>{item.min}</span>
                    <span style={{ fontSize:12, color:"#888" }}>${item.cost.toFixed(2)}</span>
                    <span style={{ padding:"3px 10px", borderRadius:8, fontSize:11, fontWeight:700, background:st.bg, color:st.color, display:"inline-block" }}>{st.label}</span>
                    <div style={{ display:"flex", gap:6 }}>
                      <button style={{ padding:"4px 8px", borderRadius:6, border:`1px solid ${C.border}`, background:"#fff", fontSize:11, cursor:"pointer", color:C.green, fontWeight:700 }}>+</button>
                      <button style={{ padding:"4px 8px", borderRadius:6, border:`1px solid ${C.border}`, background:"#fff", fontSize:11, cursor:"pointer", color:C.red, fontWeight:700 }}>−</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MOVIMIENTOS TAB */}
        {tab === "movimientos" && (
          <div style={{ background:"#fff", borderRadius:14, overflow:"hidden", border:`1px solid ${C.border}` }}>
            <div style={{ display:"grid", gridTemplateColumns:"100px 80px 2fr 60px 120px 100px", padding:"10px 16px", background:C.bg, fontSize:11, fontWeight:700, color:"#aaa", letterSpacing:0.3 }}>
              <span>Fecha</span><span>Tipo</span><span>Repuesto</span><span>Cant.</span><span>Referencia</span><span>Técnico</span>
            </div>
            {MOVEMENTS.map((m, i) => (
              <div key={m.id} style={{ display:"grid", gridTemplateColumns:"100px 80px 2fr 60px 120px 100px", padding:"12px 16px", borderTop:`1px solid ${C.bg}`, alignItems:"center", fontSize:13 }}
                onMouseEnter={e => e.currentTarget.style.background = C.bg}
                onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                <span style={{ fontSize:12, color:"#888" }}>{m.date}</span>
                <span style={{ padding:"3px 10px", borderRadius:8, fontSize:11, fontWeight:700, background:m.type==="entrada"?"#E1F5EE":"#FCEBEB", color:m.type==="entrada"?C.green:C.red }}>{m.type==="entrada"?"Entrada":"Salida"}</span>
                <span style={{ fontWeight:600, color:C.dark }}>{m.item}</span>
                <span style={{ fontWeight:700 }}>{m.qty}</span>
                <span style={{ fontSize:12, color:C.blue, fontWeight:600 }}>{m.order}</span>
                <span style={{ fontSize:12, color:"#888" }}>{m.tech}</span>
              </div>
            ))}
          </div>
        )}

        {/* ALERTAS TAB */}
        {tab === "alertas" && (
          <div>
            {noStock > 0 && (
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:14, fontWeight:700, color:C.red, marginBottom:10, display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ width:10, height:10, borderRadius:"50%", background:C.red, display:"inline-block" }}/>
                  Sin stock — {noStock} item(s)
                </div>
                {inventory.filter(i => i.stock===0).map(item => (
                  <div key={item.id} style={{ background:"#fff", borderRadius:10, padding:"14px 16px", marginBottom:8, border:`1px solid #FCEBEB`, borderLeft:`4px solid ${C.red}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:C.dark }}>{item.name}</div>
                      <div style={{ fontSize:11, color:"#aaa" }}>{item.partNo} · {item.location}</div>
                    </div>
                    <button style={{ padding:"6px 14px", borderRadius:8, border:"none", background:C.red, color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>Solicitar compra</button>
                  </div>
                ))}
              </div>
            )}
            {lowStock > 0 && (
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:C.amber, marginBottom:10, display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ width:10, height:10, borderRadius:"50%", background:C.amber, display:"inline-block" }}/>
                  Stock bajo — {lowStock} item(s)
                </div>
                {inventory.filter(i => i.stock>0 && i.stock<i.min).map(item => (
                  <div key={item.id} style={{ background:"#fff", borderRadius:10, padding:"14px 16px", marginBottom:8, border:`1px solid #FAEEDA`, borderLeft:`4px solid ${C.amber}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:C.dark }}>{item.name}</div>
                      <div style={{ fontSize:11, color:"#aaa" }}>{item.partNo} · Stock: {item.stock} / Mínimo: {item.min}</div>
                    </div>
                    <button style={{ padding:"6px 14px", borderRadius:8, border:"none", background:C.amber, color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>Reponer</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add modal */}
      {showAdd && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ background:"#fff", borderRadius:16, padding:28, width:"100%", maxWidth:480, boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ fontSize:16, fontWeight:700, marginBottom:20 }}>Nuevo repuesto</div>
            <div style={{ display:"grid", gap:12 }}>
              {[["Nombre / Descripción","name","text"],["Número de parte","partNo","text"],["Ubicación","location","text"]].map(([lbl,key,type]) => (
                <div key={key}>
                  <div style={{ fontSize:11, fontWeight:700, color:"#aaa", marginBottom:4, textTransform:"uppercase", letterSpacing:0.5 }}>{lbl}</div>
                  <input type={type} value={newItem[key]} onChange={e => setNewItem(p=>({...p,[key]:e.target.value}))}
                    style={{ width:"100%", padding:"10px 12px", borderRadius:9, border:`1px solid ${C.border}`, fontSize:13, outline:"none", boxSizing:"border-box" }}/>
                </div>
              ))}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
                {[["Stock inicial","stock","number"],["Mínimo","min","number"],["Costo $","cost","number"]].map(([lbl,key,type]) => (
                  <div key={key}>
                    <div style={{ fontSize:11, fontWeight:700, color:"#aaa", marginBottom:4, textTransform:"uppercase", letterSpacing:0.5 }}>{lbl}</div>
                    <input type={type} value={newItem[key]} onChange={e => setNewItem(p=>({...p,[key]:e.target.value}))}
                      style={{ width:"100%", padding:"10px 12px", borderRadius:9, border:`1px solid ${C.border}`, fontSize:13, outline:"none", boxSizing:"border-box" }}/>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display:"flex", gap:10, marginTop:20 }}>
              <button onClick={() => setShowAdd(false)} style={{ flex:1, padding:"11px", borderRadius:10, border:`1px solid ${C.border}`, background:"#fff", fontSize:13, fontWeight:600, cursor:"pointer" }}>Cancelar</button>
              <button onClick={handleAdd} style={{ flex:1, padding:"11px", borderRadius:10, border:"none", background:C.blue, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {saved && (
        <div style={{ position:"fixed", bottom:24, right:24, background:C.green, color:"#fff", padding:"12px 20px", borderRadius:10, fontSize:13, fontWeight:700, zIndex:300 }}>✓ Repuesto agregado</div>
      )}
    </div>
  );
}
