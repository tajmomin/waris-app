/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        gold: {
          50: '#fbf8ee',
          100: '#f5edd3',
          200: '#ebdaa7',
          300: '#dfc274',
          400: '#d3a948',
          500: '#b88a29',
          600: '#9b6c1f',
          700: '#7a511c',
          800: '#65421d',
          900: '#56381d',
        },
        sand: {
          50: '#fdfbf7',
          100: '#f8f4ec',
          200: '#efe6d5',
          300: '#e3d2b6',
          400: '#d4b993',
          500: '#c5a073',
          600: '#b48a5e',
          700: '#966e4d',
          800: '#7a5842',
          900: '#644938',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Amiri', 'Georgia', 'serif'],
        urdu: ['Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', 'Gulzar', 'serif'],
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(16, 185, 129, 0.25)',
        'glow-gold': '0 0 25px -5px rgba(212, 169, 72, 0.3)',
      }
    },
  },
  plugins: [],
}
