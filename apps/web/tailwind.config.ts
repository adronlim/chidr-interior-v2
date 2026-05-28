import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bone: '#F5F1EA',
        ink: '#1A1A1A',
        ash: '#8A8580',
        brass: '#A6814C',
        line: '#E2DCD2',
        canvas: '#FFFFFF',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      maxWidth: {
        container: '88rem',
      },
      spacing: {
        section: '8rem',
      },
      letterSpacing: {
        wider: '0.12em',
        tighter: '-0.02em',
      },
    },
  },
  plugins: [],
} satisfies Config;
