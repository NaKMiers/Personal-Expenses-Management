import type { Config } from 'tailwindcss'
import animatePlugin from 'tailwindcss-animate'

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#01dbe5',
        secondary: '#7655e6',
        dark: '#333',
        light: '#fff',
        loading: '#334155',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        body: ['Source Sans Pro', 'sans-serif'],
      },
      spacing: {
        21: '21px',
        '21/2': '10.5px',
      },
      maxWidth: {
        1200: '1200px',
      },
      textColor: {
        light: '#fff',
        darker: '#003e70',
        dark: '#333',
      },
      boxShadow: {
        'medium-light': '0px 2px 10px 1px rgba(255, 255, 255, 0.1)',
        medium: '0px 14px 10px 5px rgba(0, 0, 0, 0.2)',
        small: '0px 2px 10px 1px rgba(0, 0, 0, 0.1)',
      },
      fill: {
        light: '#fff',
      },
      screens: {
        xs: '300px',

        sm: '640px',

        md: '768px',

        lg: '1024px',

        xl: '1280px',

        '2xl': '1536px',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'scale-wiggle': {
          '0%, 100%': { transform: 'rotate(-3deg) scale(1.2)' },
          '50%': { transform: 'rotate(3deg) scale(1.2)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'spin-slow': 'spin 2s linear infinite',
        wiggle: 'wiggle 0.8s ease-in-out infinite',
        'scale-wiggle': 'scale-wiggle 0.8s ease-in-out infinite 0.2s',
      },
    },
  },
  plugins: [animatePlugin],
} satisfies Config
