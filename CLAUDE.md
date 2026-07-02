# CLAUDE.md

Este archivo brinda orientación a Claude Code (claude.ai/code) al trabajar con el código de este repositorio.

## Descripción

**YT Utilities** es una extensión de navegador (Chrome / Edge, Manifest V3) que agrega atajos de teclado y utilidades a YouTube, además de un auto-omisor de anuncios. Está escrita en JavaScript vainilla, sin frameworks, sin dependencias y sin paso de compilación (no hay `package.json` ni bundler). Los archivos fuente se cargan directamente como extensión sin empaquetar.

Publicada en la [Chrome Web Store](https://chromewebstore.google.com/detail/yt-utilities/nnnmbbmkfoehcnaknjjkknnihjogljjb) y en la [Microsoft Edge Add-ons Store](https://microsoftedge.microsoft.com/addons/detail/yt-utilities/pjkejeopjmhcciadfjfmcaephdlbjpaf).

## Comandos principales

No hay comandos de build, test ni instalación de dependencias: el proyecto es JavaScript plano. El flujo de trabajo es cargar la extensión y probarla manualmente en YouTube.

Para cargar la extensión en local (Chrome / Edge):

1. Abre `chrome://extensions` (o `edge://extensions`).
2. Activa el **Modo de desarrollador** (esquina superior derecha).
3. Pulsa **Cargar extensión sin empaquetar** ("Load unpacked") y selecciona la carpeta raíz del proyecto (la que contiene `manifest.json`).
4. Abre cualquier página de `youtube.com` para que se inyecten los content scripts, o pulsa el icono de la extensión para ver el popup.

Tras editar archivos, vuelve a `chrome://extensions` y pulsa **Recargar** en la tarjeta de la extensión; luego recarga la pestaña de YouTube.

Al cambiar `manifest.json`, incrementa el campo `version` (versión actual: `1.1.5`).

## Arquitectura

La extensión tiene cuatro piezas que se comunican principalmente a través de `chrome.storage.local`:

- **`manifest.json`** — Manifest V3. Declara el `service_worker` (`background.js`), los content scripts (`features.js`, `load.js`) que aplican a `*://*.youtube.com/*`, el popup (`popup.html`) y los permisos `storage` + `host_permissions` de YouTube.

- **`background.js`** — Service worker. Único cometido: en el evento `onInstalled` abre `index.html` (página de bienvenida) en una pestaña nueva.

- **`features.js`** — Content script principal, inyectado en YouTube. Contiene toda la lógica de interacción con el reproductor:
  - En `window.onload` espera `AWAIT_DOM_SECONDS` (3.5 s) a que cargue el DOM de YouTube.
  - `getButtons()` localiza los botones like/dislike leyendo `.YtSegmentedLikeDislikeButtonViewModelSegmentedButtonsWrapper` del DOM de YouTube (selector frágil ante cambios de YouTube).
  - `actions(method)` dispara el click del botón según la tecla; `checkNoFocus()` evita actuar cuando el foco está en un input/textarea/buscador.
  - Un `keydown` global mapea `a` → Me gusta y `d` → No me gusta.
  - `OmitirButton()` corre en un `setInterval` cada `AWAIT_SKIP_SECONDS` (2 s) y hace click en `.ytp-skip-ad-button` para omitir anuncios automáticamente.
  - Define `DATA_BUTTONS` (metadatos de iconos like/dislike) que la lógica actual no llega a usar para inyectar botones al reproductor.

- **`load.js`** — Content script + script del popup/index (se carga tanto como content script en YouTube como vía `<script type="module">` en `popup.html` e `index.html`). Gestiona la configuración persistida:
  - Helpers `getLocalStorage` / `setLocalStorage` / `getValue` / `setValue` sobre la clave `yt-shortcuts` en `chrome.storage.local` (con defaults `{ DarkMode: true, Lang: 'en' }`).
  - Enlaza los toggles del popup (`#dark-mode-toggle`, `#lang-toggle`), persiste su estado y escucha `chrome.storage.onChanged` para mantener la UI sincronizada.
  - Objeto `textos` con las traducciones `es`/`en` y `handleLangToggle()` que reemplaza el texto de la UI según el idioma. El toggle marcado = español (`es`), desmarcado = inglés (`en`).

- **`popup.html`** — UI del popup del icono de la extensión (ancho 320px). Muestra las acciones disponibles y los toggles de idioma/modo oscuro. Estilos inline en `<style>`.

- **`index.html`** — Página de bienvenida que abre `background.js` tras la instalación. Casi idéntica al popup pero con zoom al 150% y layout centrado.

### Notas y trampas conocidas

- Los selectores del DOM de YouTube en `features.js` (`.YtSegmentedLikeDislikeButtonViewModelSegmentedButtonsWrapper`, `.ytp-skip-ad-button`) dependen de la maquetación actual de YouTube; si YouTube cambia sus clases, hay que actualizarlos aquí.
- El `readme.md` menciona teclas `X` (botones like/dislike en el reproductor) y `N` (skip cada 3 s como toggle) que no tienen implementación en el código actual; el skip de anuncios es automático (cada 2 s) y no toggleable.
- `load.js` referencia `secondsInput` en el listener de `onChanged`, pero ese elemento no existe en el HTML (referencia muerta).
- `popup.html`/`index.html` referencian `images/paypal-seeklogo.svg`, que no está presente en `images/` (solo hay PNGs: `128`, `256`, `512`, `original`).
- La carga de idioma en `load.js` usa un booleano para `Lang` (checkbox) mientras el default es la cadena `'en'`; ten cuidado al tratar este valor.

## Estructura del repo

```
Youtube Utilities/
├── manifest.json      # Manifest V3: permisos, service worker, content scripts, popup
├── background.js      # Service worker: abre index.html tras instalar
├── features.js        # Content script: atajos like/dislike + auto-skip de anuncios
├── load.js            # Storage (chrome.storage.local) + i18n + toggles del popup/index
├── popup.html         # UI del popup del icono de la extensión
├── index.html         # Página de bienvenida post-instalación
├── readme.md          # Documentación de usuario (no modificar sin motivo)
└── images/            # Iconos de la extensión (128, 256, 512, original .png)
```
