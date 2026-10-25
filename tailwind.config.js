/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Deep navy / midnight backgrounds
        navy: {
          950: '#050a14',
          900: '#0a1124',
          850: '#0d1730',
          800: '#111c3a',
          700: '#16234a',
          600: '#1c2d5e',
          500: '#243a73',
        },
        // Cyan / turquoise accents
        cyan: {
          DEFAULT: '#22d3ee',
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
        },
        accent: {
          blue: '#3b82f6',
          electric: '#2dd4bf',
          teal: '#14b8a6',
        },
        surface: {
          DEFAULT: '#0f1830',
          card: '#111c3a',
          glass: 'rgba(17, 28, 58, 0.6)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 24px rgba(34, 211, 238, 0.25)',
        'glow-lg': '0 0 40px rgba(34, 211, 238, 0.35)',
        card: '0 8px 30px rgba(0, 0, 0, 0.35)',
      },
      backgroundImage: {
        'navy-gradient':
          'radial-gradient(ellipse at top, #16234a 0%, #0a1124 50%, #050a14 100%)',
        'cyan-fade':
          'linear-gradient(135deg, rgba(34,211,238,0.18) 0%, rgba(45,212,191,0.05) 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'flow-dash': 'flowDash 1.5s linear infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
      },
      keyframes: {
        flowDash: {
          to: { strokeDashoffset: '-20' },
        },
        gradientShift: {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};
