import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        butterfly: {
          50:  '#fff0f5',
          100: '#ffe0ec',
          200: '#ffc0d9',
          300: '#ff91bb',
          400: '#ff5599',
          500: '#f0276f',
          600: '#d4075a',
          700: '#b2054c',
          800: '#920640',
          900: '#780836',
        },
        rose: {
          50:  '#fff0f5',
          100: '#ffe0ec',
          200: '#ffc0d9',
          300: '#ff91bb',
          400: '#ff5599',
          500: '#f0276f',
          600: '#d4075a',
          700: '#b2054c',
          800: '#920640',
          900: '#780836',
        },
      },
      boxShadow: {
        soft:    '0 18px 50px rgba(212, 7, 90, 0.10)',
        'rose-sm': '0 4px 16px rgba(212, 7, 90, 0.12)',
        'rose-md': '0 12px 40px rgba(212, 7, 90, 0.16)',
        'rose-lg': '0 24px 64px rgba(212, 7, 90, 0.20)',
      },
      fontFamily: {
        sans:    ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'rose-gradient': 'linear-gradient(135deg, #d4075a 0%, #f0276f 100%)',
        'dark-gradient': 'linear-gradient(135deg, #0f0b0d 0%, #2d1a26 100%)',
        'gold-gradient': 'linear-gradient(135deg, #c9963a 0%, #f0c060 100%)',
      },
      borderRadius: {
        '4xl': '2.5rem',
        '5xl': '3rem',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      scale: {
        '102': '1.02',
        '103': '1.03',
        '107': '1.07',
      },
      animation: {
        'fade-up':    'fadeUp 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
        'fade-in':    'fadeIn 0.5s ease both',
        'scale-in':   'scaleIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'slide-down': 'slideDown 0.35s ease both',
        'float':      'floatY 4s ease-in-out infinite',
        'ping-slow':  'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.94)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        floatY: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
