/**
 * Configuración para empaquetar Today Trends como app Android TV / Fire TV (.apk).
 * Reemplaza `server.url` con la URL de tu deploy en Vercel antes de ejecutar `npx cap sync android`.
 */
const config = {
  appId: "com.todaytrends.firetv",
  appName: "Today Trends",
  webDir: "public",
  server: {
    // Cambia esta URL por tu dominio en Vercel (ej. https://today-trends.vercel.app)
    url: process.env.CAPACITOR_SERVER_URL || "https://tu-app.vercel.app",
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
