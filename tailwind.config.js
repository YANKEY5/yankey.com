/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0B2545',
          navyDark: '#07162c',
          navyLight: '#133E68',
          blue: '#1E88E5',
          blueLight: '#E3F2FD',
          blueHover: '#1565C0',
          cyan: '#00B4D8',
          green: '#10B981',
          greenDark: '#059669',
          greenLight: '#D1FAE5',
          yellow: '#F59E0B',
          yellowLight: '#FEF3C7',
          grayBg: '#F8FAFC',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(11, 37, 69, 0.08), 0 2px 6px -1px rgba(11, 37, 69, 0.04)',
        'soft-lg': '0 10px 30px -3px rgba(11, 37, 69, 0.12), 0 4px 10px -2px rgba(11, 37, 69, 0.06)',
        'glow-blue': '0 0 25px -5px rgba(30, 136, 229, 0.4)',
        'glow-green': '0 0 25px -5px rgba(16, 185, 129, 0.4)',
      }
    },
  },
  plugins: [],
}


