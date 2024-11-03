import { Transform } from "stream";

const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/animxyz/dist/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      animationDelay: {
        100: "100ms",
        200: "200ms",
        300: "300ms",
        400: "400ms",
      },
      colors: {
        customOrange: "#FF8345",
        customRedOrange: "#eb7134",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        sunset: "#FFD29E",
        "sunset-2": "#FFC684",
        "earth-yellow": "#FFB969",
        "sandy-brown": "#FFAD4F",
        "orange-peel": "#FFA135",
        "princeton-orange": "#FF941A",
        "dark-orange-web": "#FF8800",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      backgroundImage: {
        "custom-sunset-gradient":
          "linear-gradient(to bottom, #FFD29E, #FFC684, #FFB969, #FFAD4F, #FFA135, #FF941A, #FF8800)",
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        roboto: ["Roboto", "sans-serif"],
        anton: ["Anton SC", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        paytone: ["Paytone One", "sans-serif"],
        archivo: ["Archivo Black", "sans-serif"],
      },
      fontSize: {
        "200px": "200px", // Custom font size
        "300px": "300px",
        "400px": "400px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        grow: {
          "0%": { transform: "scale(1)", opacity: "0.7" },
          "50%": { transform: "scale(1.1)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "0.7" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        grow: "grow 4s ease-in-out",
      },
      borderWidth: {
        10: "10px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
