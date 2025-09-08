import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  darkMode: 'class',
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(var(--bg))',
        surface1: 'hsl(var(--surface-1))',
        surface2: 'hsl(var(--surface-2))',
        surface3: 'hsl(var(--surface-3))',
        muted: 'hsl(var(--muted))',
        border: 'hsl(var(--border))',
        text1: 'hsl(var(--text-1))',
        text2: 'hsl(var(--text-2))',
        accent: 'hsl(var(--accent))',
        accent2: 'hsl(var(--accent-2))',
        success: 'hsl(var(--success))',
        warn: 'hsl(var(--warn))',
        danger: 'hsl(var(--danger))',
      },
      boxShadow: {
        soft: '0 1px 1px hsl(var(--shadow)/0.25), 0 4px 16px hsl(var(--shadow)/0.18)',
        float: '0 6px 24px hsl(var(--shadow)/0.22), 0 2px 8px hsl(var(--shadow)/0.16)',
        inset: 'inset 0 1px 0 hsl(var(--shadow)/0.25)',
      },
      borderRadius: {
        md: '10px',
        lg: '14px',
        xl: '20px',
        '2xl': '24px',
        pill: '9999px',
      },
      maxWidth: {
        chat: '480px',
      },
      spacing: {
        1.5: '0.375rem',
        3.5: '0.875rem',
      },
      transitionTimingFunction: {
        calm: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.98)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
      },
      animation: {
        fadeIn: 'fadeIn .25s ease-out',
        scaleIn: 'scaleIn .2s ease-out',
      },
    },
  },
  plugins: [typography],
};
export default config;