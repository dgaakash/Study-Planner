/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          50: '#FFF7FB',
          100: '#FCE7F3',
          200: '#FBCFE8',
          300: '#F9A8D4',
          400: '#F472B6',
          500: '#EC4899', // Primary Pink
          600: '#DB2777',
          700: '#BE185D',
          800: '#9D174D',
          900: '#3D2435', // Dark Text
        },
        dark: '#3D2435',
        bgSoft: '#FFF7FB'
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(236, 72, 153, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        card: '0 10px 30px -5px rgba(236, 72, 153, 0.12)',
        glass: '0 8px 32px 0 rgba(236, 72, 153, 0.15)',
      }
    },
  },
  plugins: [],
}
