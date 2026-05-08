"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1a1a1f 0%, #2a2a32 100%)", display: "flex", flexDirection: "column" }}>
      <header style={{ padding: "20px 28px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 24, fontWeight: 800, color: "#fff" }}>DTS</span>
        <span style={{ fontSize: 24, fontWeight: 300, color: "#3B8BD4" }}>SGS</span>
        <div style={{ width: 1, height: 24, background: "#333", margin: "0 6px" }} />
        <span style={{ fontSize: 12, color: "#666" }}>El Salvador</span>
      </header>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ textAlign: "center", maxWidth: 540, marginBottom: 40 }}>
          <h1 style={{ color: "#fff", fontSize: 36, fontWeight: 800, margin: "0 0 14px", lineHeight: 1.2, letterSpacing: -0.5 }}>
            Sistema de Gestión<br/>de Servicios
          </h1>
          <p style={{ color: "#888", fontSize: 16, margin: 0, lineHeight: 1.6 }}>
            Plataforma integral para la operación técnica de DTS El Salvador. Gestión de servicios en sitio y reparaciones en taller.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, width: "100%", maxWidth: 720 }}>
          <Link href="/dashboard" style={{ textDecoration: "none" }}>
            <div style={{ background: "#fff", borderRadius: 14, padding: "28px 24px", border: "1px solid #2a2a30", cursor: "pointer", transition: "transform 0.2s", height: "100%", boxSizing: "border-box" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}>
              <div style={{ width: 50, height: 50, borderRadius: 12, background: "#E6F1FB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 16 }}>⚙️</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#1a1a1f", marginBottom: 6 }}>Back-office</div>
              <div style={{ fontSize: 13, color: "#888", lineHeight: 1.5 }}>Acceso para administradores y técnicos. Gestión de órdenes, calendario y reportes.</div>
              <div style={{ marginTop: 14, color: "#3B8BD4", fontSize: 13, fontWeight: 700 }}>Ingresar →</div>
            </div>
          </Link>

          <Link href="/cliente" style={{ textDecoration: "none" }}>
            <div style={{ background: "#fff", borderRadius: 14, padding: "28px 24px", border: "1px solid #2a2a30", cursor: "pointer", transition: "transform 0.2s", height: "100%", boxSizing: "border-box" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}>
              <div style={{ width: 50, height: 50, borderRadius: 12, background: "#E1F5EE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 16 }}>👤</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#1a1a1f", marginBottom: 6 }}>Portal del cliente</div>
              <div style={{ fontSize: 13, color: "#888", lineHeight: 1.5 }}>Consulte el estado de su orden, descargue reportes e ingrese a su cuenta.</div>
              <div style={{ marginTop: 14, color: "#1D9E75", fontSize: 13, fontWeight: 700 }}>Ingresar →</div>
            </div>
          </Link>

          <Link href="/reporte" style={{ textDecoration: "none" }}>
            <div style={{ background: "#fff", borderRadius: 14, padding: "28px 24px", border: "1px solid #2a2a30", cursor: "pointer", transition: "transform 0.2s", height: "100%", boxSizing: "border-box" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}>
              <div style={{ width: 50, height: 50, borderRadius: 12, background: "#EEEDFE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 16 }}>📱</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#1a1a1f", marginBottom: 6 }}>Reporte en campo</div>
              <div style={{ fontSize: 13, color: "#888", lineHeight: 1.5 }}>Para técnicos en sitio. Captura de hallazgos, fotos y firma digital del cliente.</div>
              <div style={{ marginTop: 14, color: "#7F77DD", fontSize: 13, fontWeight: 700 }}>Abrir formulario →</div>
            </div>
          </Link>
        </div>

        <div style={{ marginTop: 40, fontSize: 12, color: "#444" }}>
          DTS El Salvador © 2026 · v1.0 Pilot
        </div>
      </div>
    </div>
  );
}
