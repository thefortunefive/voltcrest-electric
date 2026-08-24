import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand tokens — sampled from the hero footage.
        night: '#050B16',        // page base (derived from sky #001026)
        'night-2': '#0A1626',    // section alternate
        'night-3': '#122238',    // cards / raised surfaces (house-shadow #032443 family)
        amber: '#C58935',        // lit-window glow (sampled)
        'amber-light': '#E2A94F',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        'power2-out': 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
