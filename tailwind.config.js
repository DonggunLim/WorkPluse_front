/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      width: {
        1280: "1280px",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
