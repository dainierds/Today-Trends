# Today Trends — Monitor de Series y Películas en Streaming

Aplicación estilo **Netflix** para monitorear constantemente qué está en tendencia, qué es lo más visto en tiempo real y qué es lo mejor valorado en **Netflix, Amazon Prime Video, Max (HBO), Disney+, Paramount+, Peacock y Apple TV+** — sin alojar ni reproducir video ilegal, solo carátulas, sinopsis, calificaciones y disponibilidad.

Diseñada para funcionar desde el mismo repositorio en:
- **Web / Vercel** (PC, móvil, tablet)
- **Fire TV / Android TV** (navegación completa con control remoto D-Pad: flechas, OK/Enter, Atrás/Escape)

---

## 1. Fuentes de datos que utiliza

1. **TMDB API (Gratis):** Tendencias diarias/semanales, rankings por plataforma (`Netflix`, `Prime Video`, `Max`, `Disney+`, `Paramount+`, `Peacock`, `Apple TV+`), mejores valoradas, géneros, sinopsis en español latino (`es-MX`), pósters HD, reparto y tráilers de YouTube.
2. **Trakt.tv API (Gratis, opcional):** Conteo de personas viendo en tiempo real (*Trakt Live*) y *Más vistas de todos los tiempos*.
3. **Modo Demo automático:** Si aún no configuras tus API keys, la app funciona inmediatamente con un catálogo de demostración.

---

## 2. Configuración local

```bash
npm install
cp .env.example .env.local
```

Edita `.env.local` y agrega tus claves gratuitas:
- **TMDB API Key:** [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
- **Trakt Client ID (opcional):** [trakt.tv/oauth/applications](https://trakt.tv/oauth/applications)

Inicia en modo desarrollo:

```bash
npm run dev
```

---

## 3. Subir a GitHub y hacer Deploy en Vercel

1. Sube el proyecto a tu repositorio en GitHub:
   ```bash
   git add .
   git commit -m "Initial Today Trends app"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/today-trends.git
   git push -u origin main
   ```
2. Entra a [vercel.com](https://vercel.com), importa el repositorio y en **Environment Variables** agrega:
   - `TMDB_API_KEY` (o `TMDB_READ_ACCESS_TOKEN`)
   - `TRAKT_CLIENT_ID` (opcional)
   - `DEFAULT_REGION=US`
   - `DEFAULT_LANGUAGE=es-MX`
3. Haz clic en **Deploy**. Tu app quedará en línea y actualizando tendencias automáticamente.

---

## 4. Compilar como App (.apk) para Fire TV

Fire TV corre **Fire OS** (basado en Android). Para generar un `.apk` que cargue tu app de Vercel con soporte de control remoto:

1. Instala Capacitor Android:
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android
   npx cap add android
   ```
2. Edita `capacitor.config.ts` y coloca tu URL real de Vercel en `server.url` (o define `CAPACITOR_SERVER_URL=https://tu-app.vercel.app`).
3. Para que aparezca en la pantalla de inicio de Fire TV, agrega en `android/app/src/main/AndroidManifest.xml`:
   - Dentro de `<manifest>`:
     ```xml
     <uses-feature android:name="android.software.leanback" android:required="false" />
     <uses-feature android:name="android.hardware.touchscreen" android:required="false" />
     ```
   - Dentro del `<intent-filter>` de `MainActivity`:
     ```xml
     <category android:name="android.intent.category.LEANBACK_LAUNCHER" />
     ```
4. Sincroniza y compila el APK:
   ```bash
   npx cap sync android
   cd android && ./gradlew assembleRelease
   ```
5. Instala el APK en tu Fire TV usando **ADB** (`adb connect IP_DEL_FIRE_TV && adb install app-release.apk`) o la app **Downloader** en el Fire TV.
