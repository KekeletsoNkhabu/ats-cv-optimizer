/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-syne)', 'sans-serif'],
        body: ['var(--font-jakarta)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        bg: {
          base: '#07070B',
          surface: '#0E0E14',
          elevated: '#161620',
          card: '#1A1A26',
        },
        accent: {
          green: '#22C55E',
          'green-light': '#4ADE80',
          'green-dark': '#16A34A',
          blue: '#60A5FA',
          purple: '#A78BFA',
          amber: '#FBBF24',
          red: '#F87171',
        },
        border: {
          subtle: 'rgba(255,255,255,0.06)',
          DEFAULT: 'rgba(255,255,255,0.09)',
          strong: 'rgba(255,255,255,0.15)',
          green: 'rgba(34,197,94,0.35)',
        },
        text: {
          primary: '#F0F0F6',
          secondary: '#9494A8',
          muted: '#56566A',
        },
      },
      boxShadow: {
        'glow-green': '0 0 40px rgba(34, 197, 94, 0.25), 0 0 80px rgba(34, 197, 94, 0.1)',
        'glow-green-sm': '0 0 20px rgba(34, 197, 94, 0.2)',
        'glow-blue': '0 0 40px rgba(96, 165, 250, 0.2)',
        'card': '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.09)',
      },
      backgroundImage: {
        'grid': 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
        'glow-radial': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(34, 197, 94, 0.15), transparent)',
        'gradient-green': 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        'shimmer': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'scan': 'scan 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-16px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
    },
  },
  plugins: [],
}
