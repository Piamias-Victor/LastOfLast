/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
          pharmacy: {
            primary: '#0a5b91',
            secondary: '#66a5ad',
            accent: '#07889b',
            highlight: '#66b9bf',
            light: '#e0f7fa',
          },
        },
      },
    },
    plugins: [],
  }