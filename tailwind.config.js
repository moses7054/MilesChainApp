/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "cyber-black": "#000000",
        "cyber-dark": "#1A1A1A",
        "cyber-purple": "#8A2BE2",
        "cyber-neon": "#9370DB",
        "cyber-pink": "#FF00FF",
        "cyber-magenta": "#FF00CC",
        "cyber-deep-purple": "#4B0082",
      },
      boxShadow: {
        neon: "0 0 3px #8A2BE2, 0 0 8px #8A2BE2",
      },
      fontFamily: {
        cyber: ["var(--font-cyber)"],
      },
      backgroundImage: {
        "cyber-gradient":
          "linear-gradient(to bottom, #000000, #1A0033, #4B0082)",
      },
      animation: {
        "pulse-slow": "pulse 3s infinite",
      },
      screens: {
        xs: "480px",
      },
    },
  },
  plugins: [],
};
