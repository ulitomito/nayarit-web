/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nayarit: {
          deep: '#0B1E14',
          jungle: '#153A26',
          jungleLight: '#23573B',
          sage: '#4B735B',
          gold: '#C59A47',
          goldLight: '#E3B86C',
          goldDark: '#A67D33',
          sand: '#FAF7F2',
          sandDark: '#EFE7DA',
          sandBorder: '#DFD5C4',
          terracotta: '#C85A32',
          terracottaLight: '#DF734D',
          ocean: '#114B5F',
          oceanLight: '#1A6B85',
          charcoal: '#1A211D',
          muted: '#5C6B62'
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        display: ['"Cinzel"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(21, 58, 38, 0.08)',
        'luxury-hover': '0 25px 50px -12px rgba(21, 58, 38, 0.16)',
        'gold-glow': '0 0 25px rgba(197, 154, 71, 0.25)',
      }
    },
  },
  plugins: [],
}


