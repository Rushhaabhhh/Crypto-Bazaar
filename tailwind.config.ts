import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        'radial-green-tl': 'radial-gradient(circle at top left, green, transparent)',
        'radial-green-br': 'radial-gradient(circle at bottom right, green, transparent)',
      },
    },
  },
  plugins: [],
} satisfies Config;
