/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clay: {
          bg: "#F7F2EA",
          surface: "#FFFFFF",
          sidebar: "#D2E4DB",
          sidebarHover: "#C4DBD1",
          peach: "#FAD4C0",
          peachDark: "#EB8B68",
          mint: "#D3E8DC",
          mintDark: "#5C9C7B",
          yellow: "#FDECC8",
          yellowDark: "#DCA642",
          blue: "#D0E5F5",
          blueDark: "#5A9FD4",
          purple: "#DDD4F2",
          purpleDark: "#8B6FCE",
          textMain: "#2E241E",
          textMuted: "#7E7268",
          border: "rgba(255, 255, 255, 0.8)",
        }
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        cinzel: ['Cinzel', 'serif'],
        mono: ['Fira Code', 'monospace']
      },
      boxShadow: {
        'clay-card': '0 12px 30px rgba(180, 160, 140, 0.12), inset 0 2px 4px rgba(255, 255, 255, 0.95)',
        'clay-button': '0 8px 18px rgba(235, 139, 104, 0.35), inset 0 2px 3px rgba(255, 255, 255, 0.6)',
        'clay-sidebar': '0 15px 35px rgba(150, 180, 165, 0.25), inset 0 2px 4px rgba(255, 255, 255, 0.8)',
        'clay-pill': '0 4px 12px rgba(160, 140, 120, 0.08), inset 0 1px 2px rgba(255, 255, 255, 0.8)',
        'clay-inset': 'inset 0 2px 5px rgba(160, 140, 120, 0.12)',
      },
      borderRadius: {
        '3xl': '28px',
        '4xl': '36px',
        '5xl': '44px'
      }
    },
  },
  plugins: [],
}
