/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand / accent
        accent: {
          50:  "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
        },
        // Dark-mode surfaces
        navy: {
          950: "#040914",
          900: "#080D1A",
          800: "#0D1530",
          700: "#131D3A",
          600: "#1A2548",
          500: "#243058",
        },
        // Light-mode ink
        ink: {
          900: "#0F172A",
          700: "#334155",
          500: "#64748B",
          400: "#94A3B8",
          300: "#CBD5E1",
          200: "#E2E8F0",
          100: "#F1F5F9",
          50:  "#F8FAFC",
        },
        // Semantic
        good:  "#10B981",
        warn:  "#F59E0B",
        bad:   "#F43F5E",
        goodDark: "#34D399",
        warnDark: "#FBBF24",
      },
      fontFamily: {
        display: ["'Plus Jakarta Sans'", "sans-serif"],
        body:    ["'Inter'", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        card:    "0 1px 2px rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.06)",
        cardDark:"0 1px 3px rgba(0,0,0,0.4), 0 8px 32px rgba(0,0,0,0.3)",
        glow:    "0 0 20px rgba(99,102,241,0.35), 0 0 60px rgba(99,102,241,0.12)",
        glowSm:  "0 0 10px rgba(99,102,241,0.25)",
        pop:     "0 8px 30px rgba(79,70,229,0.35)",
      },
      backgroundImage: {
        "brand-gradient":    "linear-gradient(135deg, #4F46E5 0%, #7C6FF7 50%, #3B82F6 100%)",
        "brand-gradient-d":  "linear-gradient(135deg, #312E81 0%, #4338CA 50%, #1D4ED8 100%)",
        "glass-dark":        "linear-gradient(135deg, rgba(13,21,48,0.8) 0%, rgba(19,29,58,0.6) 100%)",
        "hero-gradient":     "linear-gradient(135deg, #080D1A 0%, #131D3A 50%, #080D1A 100%)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      animation: {
        "fade-in":    "fadeIn 0.4s ease-out",
        "slide-up":   "slideUp 0.4s ease-out",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "float":      "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn:    { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp:   { "0%": { opacity: "0", transform: "translateY(16px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        glowPulse: { "0%,100%": { boxShadow: "0 0 15px rgba(99,102,241,0.3)" }, "50%": { boxShadow: "0 0 30px rgba(99,102,241,0.6)" } },
        float:     { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
      },
    },
  },
  plugins: [],
};
