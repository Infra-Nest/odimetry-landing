# Odimetry Landing Page

Landing page moderna y responsive para **Odimetry**, una herramienta para realizar evaluaciones externas de ciberseguridad sobre dominios y activos autorizados. Identifica servicios expuestos, vulnerabilidades conocidas y configuraciones inseguras, y presenta resultados claros y priorizados.

La identidad visual se define en el brandbook canónico de la landing corporativa de Odimetry. Odimetry usa el mismo sistema tipográfico y la misma base navy, con teal como color de producto y ámbar reservado para destacar puntos de atención.

## 🚀 Características

- **Diseño moderno y responsive**: Interfaz optimizada para todos los dispositivos
- **Internacionalización (i18n)**: Soporte para múltiples idiomas (Español, Inglés, Francés, Alemán)
- **Routing con React Router**: Navegación fluida entre secciones y páginas legales
- **Componentes modulares**: Arquitectura basada en componentes reutilizables
- **TypeScript**: Tipado estático para mayor robustez y mantenibilidad
- **Tailwind CSS**: Estilos modernos y responsive con utilidades de Tailwind
- **Optimización de rendimiento**: Construido con Vite para builds rápidos

## 📋 Secciones

Esta publicación es solo la landing pública (`/`). Incluye:

- **Hero**: propuesta y llamada a apuntarse a la lista de interesados
- **Una lectura en contexto**: ejemplo de informe ilustrativo
- **Formulario de interés**: solo correo electrónico
- **FAQ**: límites y expectativas del producto

No se publican rutas de la aplicación (`/signup`, `/login`, panel, etc.) ni páginas legales.

## 🛠️ Tecnologías

- **React 19**: Biblioteca de UI
- **TypeScript**: Tipado estático
- **Vite**: Build tool y dev server
- **React Router DOM**: Enrutamiento
- **i18next**: Internacionalización
- **Tailwind CSS**: Framework de estilos
- **Lucide React**: Iconos
- **ESLint**: Linting y calidad de código

## 📦 Instalación

1. Usa Node.js 22 (el repositorio incluye `.nvmrc`):

```bash
nvm use
```

2. Clona el repositorio y entra en él:
```bash
git clone <url-del-repositorio>
cd odimetry-frontend
```

3. Instala las dependencias reproducibles:
```bash
npm ci
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

Abre tu navegador en `http://localhost:5173`. Si también tienes levantada la landing de Odimetry, usa otro puerto:

```bash
npm run dev -- --port 5174
```

Este lanzamiento es una landing informativa. El informe es ilustrativo; las rutas de acceso y panel redirigen a la página pública. El formulario de interés envía una solicitud con la dirección de correo a `info@odimetry.es` mediante una función de Vercel. No necesita el backend de Odimetry, base de datos, migraciones ni `VITE_API_BASE_URL`.

`npm run dev` levanta la interfaz con Vite, pero no ejecuta la función `/api/interest`; en ese modo el envío mostrará un error. Para probar el envío hace falta un entorno de funciones de Vercel con las mismas variables SMTP de Zoho que usa `odimetry.es`.

## 🏗️ Scripts disponibles

- `npm run dev`: Inicia el servidor de desarrollo con Vite
- `npm run build`: Construye la aplicación para producción
- `npm run preview`: Previsualiza la build de producción
- `npm run lint`: Ejecuta ESLint para verificar el código

## 📁 Estructura del proyecto

```
landing/
├── public/              # Archivos estáticos
├── src/
│   ├── assets/         # Imágenes y recursos
│   ├── components/     # Componentes React
│   │   ├── layout/     # Componentes de layout (Header, Footer, Layout)
│   │   ├── sections/   # Secciones de la landing page
│   │   └── ui/         # Componentes UI reutilizables
│   ├── hooks/          # Custom hooks
│   ├── i18n/           # Configuración de internacionalización
│   │   └── locales/    # Traducciones por idioma
│   ├── services/       # Servicios y lógica de negocio
│   ├── types/          # Definiciones de tipos TypeScript
│   └── utils/          # Utilidades y helpers
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

## 🌍 Internacionalización

El proyecto soporta múltiples idiomas mediante i18next. Los idiomas disponibles son:

- Español (es)
- Inglés (en)
- Francés (fr)
- Alemán (de)

Las traducciones se encuentran en `src/i18n/locales/[idioma]/translation.json`.

## 🎨 Estilos

El proyecto utiliza **Tailwind CSS** para los estilos. La configuración se encuentra en `tailwind.config.js` y los estilos globales en `src/index.css`.

## 📝 Desarrollo

### Agregar una nueva sección

1. Crea un nuevo componente en `src/components/sections/`
2. Importa y añádelo en `src/App.tsx` dentro de la ruta principal
3. Agrega las traducciones correspondientes en los archivos de idioma

### Agregar un nuevo idioma

1. Crea una nueva carpeta en `src/i18n/locales/` con el código del idioma
2. Copia `translation.json` de otro idioma y traduce el contenido
3. Actualiza `src/i18n/config.ts` para incluir el nuevo idioma

## 🚢 Despliegue

Antes de publicar, ejecuta:

```bash
npm run lint
npm run build
npm run preview
```

La build queda en `dist/`. En Vercel, importa el proyecto como Vite, con raíz `./`, comando `npm run build` y directorio de salida `dist`. `vercel.json` solo reescribe `/` a `index.html`; el resto de rutas de la aplicación o legales responden 404.

Para activar el formulario, configura en el proyecto de Vercel de Odimetry las mismas variables que en Odimetry:

- `ZOHO_SMTP_HOST`
- `ZOHO_SMTP_PORT` (`465` o `587`)
- `ZOHO_SMTP_USER`
- `ZOHO_SMTP_PASS`
- `CONTACT_TO_EMAIL` (recomendado: `info+odimetry@odimetry.es`)

El aviso se envía por SMTP de Zoho desde `ZOHO_SMTP_USER`, llega a `CONTACT_TO_EMAIL` y la dirección del interesado queda como respuesta. Guarda las credenciales solo en las variables del proyecto, nunca en Git.

Antes de abrir el formulario al público, configura en Vercel Firewall un límite de peticiones para `/api/interest` por IP. El límite incluido en la función solo actúa por instancia y no sustituye esa protección. El aviso recibido no verifica que la dirección pertenezca a quien rellenó el formulario.

Para conectar `odimetry.es`, añade el dominio al proyecto y aplica en tu proveedor DNS los registros que Vercel indique. Tras publicar, comprueba HTTPS, el formulario de interés y que rutas como `/signup` o `/privacy` respondan 404.

## 🎨 Identidad

Los assets de producto están en `public/brand/` y el isotipo se usa también como favicon. `odimetry-wordmark.svg` es la variante para fondos claros y `odimetry-wordmark-dark.svg` la variante para fondos oscuros. La atribución corporativa se reserva al pie y a los contextos donde sea necesaria, con la fórmula **un producto de Odimetry**; no se repite como coletilla en la navegación ni en las secciones. No se debe comunicar seguridad total, ausencia de vulnerabilidades, detección exhaustiva, certificación de cumplimiento, monitorización continua ni remediación automática. El servicio solo debe utilizarse sobre dominios y activos autorizados.

## 📄 Licencia

Este proyecto es privado y propiedad de Odimetry.

## 👥 Contribución

Este es un proyecto privado. Para contribuciones, contacta al equipo de desarrollo.
