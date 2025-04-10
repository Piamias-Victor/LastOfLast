/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pharmacy-primary': '#0A5B91',
        'pharmacy-primary-light': '#2E7DB3',
        'pharmacy-primary-dark': '#064672',
        'pharmacy-accent': '#66A5AD',
        'pharmacy-accent-light': '#87BDC3',
        'pharmacy-accent-dark': '#4A8072',
        'pharmacy-success': '#4A8072',
        'pharmacy-warning': '#F59E0B',
        'pharmacy-danger': '#E63946',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0,0,0,0.08)',
        'md': '0 3px 6px rgba(0,0,0,0.12)',
        'lg': '0 8px 16px rgba(0,0,0,0.16)',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '250ms',
        'slow': '400ms',
      },
    },
  },
  plugins: [],
}