/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bebas Neue"', 'cursive'],
        ui: ['"Barlow Condensed"', 'sans-serif'],
        body: ['"Barlow"', 'sans-serif'],
      },
      colors: {
        brand: {
          orange: '#FF5500',
          'orange-light': '#FF7733',
          'orange-dark': '#CC4400',
          navy: '#070B14',
          'navy-card': '#0D1222',
          'navy-border': '#1A2035',
          'navy-hover': '#111827',
        },
      },
      animation: {
        'slide-up': 'slideUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.8s ease forwards',
        'pulse-orange': 'pulseOrange 2s ease-in-out infinite',
      },
      keyframes: {
        slideUp: {
          from: { opacity: 0, transform: 'translateY(30px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        pulseOrange: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255,85,0,0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(255,85,0,0)' },
        },
      },
    },
  },
  plugins: [],
}
