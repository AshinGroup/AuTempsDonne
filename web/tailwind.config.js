/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        AshinBlue: {
          light: "#70B1DD",
          DEFAULT: "#40A1DD",
          dark: "#2080DD",
        },
      },
    },
  },
  plugins: [],
};
