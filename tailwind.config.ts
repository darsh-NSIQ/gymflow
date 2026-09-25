import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          hover: 'hsl(var(--primary-hover))',
          soft: 'hsl(var(--primary-soft))',
          softText: 'hsl(var(--primary-soft-text))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
          soft: 'hsl(var(--destructive-soft))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success-bg))',
          text: 'hsl(var(--success-text))',
          icon: 'hsl(var(--success-icon))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning-bg))',
          text: 'hsl(var(--warning-text))',
          icon: 'hsl(var(--warning-icon))',
        },
        danger: {
          DEFAULT: 'hsl(var(--danger-bg))',
          text: 'hsl(var(--danger-text))',
          icon: 'hsl(var(--danger-icon))',
        },
        info: {
          DEFAULT: 'hsl(var(--info-bg))',
          text: 'hsl(var(--info-text))',
          icon: 'hsl(var(--info-icon))',
        },
        neutralBadge: {
          DEFAULT: 'hsl(var(--neutral-bg))',
          text: 'hsl(var(--neutral-text))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 6px)',
        xl: 'calc(var(--radius) + 6px)',
        '2xl': 'calc(var(--radius) + 10px)',
      },
      boxShadow: {
        'soft-xs': '0 1px 2px rgba(0, 0, 0, 0.4)',
        'soft-sm': '0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(255, 46, 76, 0.1)',
        'soft-md': '0 12px 28px -10px rgba(255, 46, 76, 0.3), 0 4px 12px rgba(0,0,0,0.5)',
        'soft-lg': '0 16px 36px -12px rgba(255, 46, 76, 0.4)',
        'soft-xl': '0 24px 56px -16px rgba(0, 0, 0, 0.8)',
        'brand-ring': '0 0 0 3px rgba(255, 46, 76, 0.4)',
      },
      transitionDuration: {
        fast: '120ms',
        base: '180ms',
        slow: '260ms',
        enter: '320ms',
      },
      transitionTimingFunction: {
        standard: 'cubic-bezier(.2,0,0,1)',
        exit: 'cubic-bezier(.4,0,1,1)',
        pop: 'cubic-bezier(.34,1.56,.64,1)',
      },
    },
  },
  plugins: [],
}

export default config
