/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        small: '0.25rem',
        medium: '0.375rem',
        large: '0.5rem',
      },
      fontSize: {
        tiny: '0.75rem',
        small: '0.875rem',
        medium: '1rem',
        large: '1.125rem',
      },
      borderWidth: {
        small: '1px',
        medium: '2px',
        large: '3px',
      }
    },
  },
  plugins: [],
}
