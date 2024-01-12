/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{ejs,js}", "./views/partials/**/*.ejs"],
  darkMode: "class",
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "1024px",
      xl: '1280px',
      "2xl": '1536px',
    },
    extend: {
      colors: {
        white: "#F2F2F7",
        black: "#000000",
        darkBlue: "#0D47A1",
        lightBlue: "#145CCB",
        grey: "#757575",
        lightBlack: "#080708",
        limeGreen: "#DBFE87",
        dashboardWhite: "#FFFFFF",
      },
    },
  },
  plugins: [],
};
