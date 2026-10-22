/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Odimetry: teal de visibilidad sobre la base navy de Odimetry.
        primary: {
          50: '#e8f5f6',
          100: '#cfe9eb',
          200: '#a5d5d9',
          300: '#6fc0c8',
          400: '#2da8b3',
          500: '#087e8b',
          600: '#076f7b',
          700: '#075c66',
          800: '#064850',
          900: '#04363d',
          950: '#02252b',
        },
        security: {
          green: '#10b981', // Verde de seguridad
          yellow: '#f59e0b', // Amarillo de advertencia
          red: '#ef4444', // Rojo de alerta
          orange: '#f97316', // Naranja de riesgo
        },
        gray: {
          50: '#f5f7f8',
          100: '#e8eef0',
          200: '#d8dee3',
          300: '#b7c3c8',
          400: '#8b9ba2',
          500: '#64757d',
          600: '#4b5d66',
          700: '#334650',
          800: '#233641',
          900: '#17212b',
          950: '#101d27',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['Sora', 'Manrope', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
