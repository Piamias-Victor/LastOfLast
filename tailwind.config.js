/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'San Francisco',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'sans-serif',
        ],
      },
      fontSize: {
        '2xs': '0.625rem',    // 10px
        'xs': '0.75rem',      // 12px
        'sm': '0.875rem',     // 14px
        'base': '1rem',       // 16px
        'lg': '1.125rem',     // 18px
        'xl': '1.25rem',      // 20px
        '2xl': '1.5rem',      // 24px
        '3xl': '2rem',        // 32px
        '4xl': '2.5rem',      // 40px
      },
      letterSpacing: {
        'wider': '0.02em',
        'widest': '0.03em',
      },
      colors: {
        'pharmacy-primary': '#007AFF',
        'pharmacy-primary-light': '#3395FF',
        'pharmacy-primary-dark': '#0055B3',
        'pharmacy-accent': '#5AC8FA',
        'pharmacy-accent-light': '#7AD4FF',
        'pharmacy-accent-dark': '#0A84FF',
        'pharmacy-success': '#34C759',
        'pharmacy-warning': '#FF9500',
        'pharmacy-danger': '#FF3B30',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0,0,0,0.05)',
        'md': '0 2px 8px rgba(0,0,0,0.07)',
        'lg': '0 10px 20px rgba(0,0,0,0.08)',
        'focus': '0 0 0 2px rgba(0,122,255,0.15)',
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
      },
      spacing: {
        'xs': '8px',
        'sm': '16px',
        'md': '32px',
        'lg': '48px',
        'xl': '64px',
      },
      transitionDuration: {
        'fast': '200ms',
        'normal': '300ms',
        'slow': '450ms',
      },
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
    },
  },
  plugins: [],
}