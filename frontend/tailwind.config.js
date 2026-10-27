/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vendorDark: '#0D1117',
        vendorCard: '#161B22',
        vendorBorder: '#30363D',
        vendorGreen: '#70E000',
        vendorRed: '#EF4444',
        vendorOrange: '#F97316',
        vendorYellow: '#EAB308'
      }
    },
  },
  plugins: [],
}
