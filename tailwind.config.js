/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#199A8E',
        primaryDark: '#101623',
        primaryGray: '#717784',
        medicalGray: '#F9FAFB',
        secondary: '#E5E7EB',
        medical: '#A1A8B0',
        medicalBlack: '#3B4453',
        'medicalGray-2': '#F5F8FF',
        medicalError: '#FF5C5C'
      },
    },
  },
  plugins: [],
};