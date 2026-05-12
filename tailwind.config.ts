import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#081426",
          900: "#0c1f38",
          800: "#123052",
        },
        sunset: {
          500: "#d49a2a",
          400: "#efb84d",
          100: "#fff6df",
        },
        coral: {
          500: "#e9665b",
          100: "#fff0ee",
        },
        foam: "#f7fbfb",
      },
      boxShadow: {
        resort: "0 18px 50px rgba(8, 20, 38, 0.14)",
      },
      fontFamily: {
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
