/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./dist/*.{html,js}'],
  theme: {
    extend: {},
    fontFamily: {
      roboto: [
        'Roboto',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Arial',
        'Noto Sans',
        'sans-serif',
        'Apple Color Emoji',
        'Segoe UI Emoji',
      ],
    },
  },
  plugins: [],
};
