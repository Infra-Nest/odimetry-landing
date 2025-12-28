# Odimetry Landing Page

Landing page moderna y responsive para **Odimetry**, una plataforma de auditorías automáticas de ciberseguridad que ayuda a las empresas a identificar servicios expuestos, vulnerabilidades conocidas y configuraciones inseguras en su infraestructura.

## 🚀 Características

- **Diseño moderno y responsive**: Interfaz optimizada para todos los dispositivos
- **Internacionalización (i18n)**: Soporte para múltiples idiomas (Español, Inglés, Francés, Alemán)
- **Routing con React Router**: Navegación fluida entre secciones y páginas legales
- **Componentes modulares**: Arquitectura basada en componentes reutilizables
- **TypeScript**: Tipado estático para mayor robustez y mantenibilidad
- **Tailwind CSS**: Estilos modernos y responsive con utilidades de Tailwind
- **Optimización de rendimiento**: Construido con Vite para builds rápidos

## 📋 Secciones

La landing page incluye las siguientes secciones:

- **Hero**: Sección principal con call-to-action
- **Problem**: Identificación de problemas de seguridad comunes
- **Solution**: Propuesta de valor y beneficios
- **Features**: Características técnicas de la plataforma
- **Dashboard**: Vista previa del panel de control
- **Target**: Público objetivo
- **Differentiators**: Diferenciadores competitivos
- **Pricing**: Planes y precios
- **Final CTA**: Llamada a la acción final

### Páginas legales

- Política de Privacidad (`/privacy`)
- Términos de Servicio (`/terms`)
- Política de Cookies (`/cookies`)

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

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd landing
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

4. Abre tu navegador en `http://localhost:5173`

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

Para construir la aplicación para producción:

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`, listos para ser desplegados en cualquier servidor estático o CDN.

## 📄 Licencia

Este proyecto es privado y propiedad de Odimetry.

## 👥 Contribución

Este es un proyecto privado. Para contribuciones, contacta al equipo de desarrollo.
