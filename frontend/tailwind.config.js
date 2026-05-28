/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          950: "#090b10",
          900: "#10131b",
          850: "#151925",
          800: "#1d2330",
          700: "#2b3445"
        },
        accent: {
          500: "#38bdf8",
          600: "#0891b2"
        }
      },
      boxShadow: {
        soft: "0 18px 50px rgba(0, 0, 0, 0.25)"
      }
    }
  },
  plugins: []
};
