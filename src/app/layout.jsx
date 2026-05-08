export const metadata = {
  title: "SGS — DTS El Salvador",
  description: "Sistema de Gestión de Servicios — DTS El Salvador",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#f5f4f0" }}>
        {children}
      </body>
    </html>
  );
}
