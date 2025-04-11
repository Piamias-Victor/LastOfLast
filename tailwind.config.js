/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: [
  				'-apple-system',
  				'BlinkMacSystemFont',
  				'San Francisco',
  				'Segoe UI',
  				'Roboto',
  				'Helvetica Neue',
  				'sans-serif'
  			]
  		},
  		fontSize: {
  			'2xs': '0.625rem',
  			xs: '0.75rem',
  			sm: '0.875rem',
  			base: '1rem',
  			lg: '1.125rem',
  			xl: '1.25rem',
  			'2xl': '1.5rem',
  			'3xl': '2rem',
  			'4xl': '2.5rem'
  		},
  		letterSpacing: {
  			wider: '0.02em',
  			widest: '0.03em'
  		},
  		colors: {
  			'pharmacy-primary': '#007AFF',
  			'pharmacy-primary-light': '#3395FF',
  			'pharmacy-primary-dark': '#0055B3',
  			'pharmacy-accent': '#5AC8FA',
  			'pharmacy-accent-light': '#7AD4FF',
  			'pharmacy-accent-dark': '#0A84FF',
  			'pharmacy-success': '#34C759',
  			'pharmacy-warning': '#FF9500',
  			'pharmacy-danger': '#FF3B30',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		boxShadow: {
  			sm: '0 1px 2px rgba(0,0,0,0.05)',
  			md: '0 2px 8px rgba(0,0,0,0.07)',
  			lg: '0 10px 20px rgba(0,0,0,0.08)',
  			focus: '0 0 0 2px rgba(0,122,255,0.15)'
  		},
  		borderRadius: {
  			sm: 'calc(var(--radius) - 4px)',
  			md: 'calc(var(--radius) - 2px)',
  			lg: 'var(--radius)'
  		},
  		spacing: {
  			xs: '8px',
  			sm: '16px',
  			md: '32px',
  			lg: '48px',
  			xl: '64px'
  		},
  		transitionDuration: {
  			fast: '200ms',
  			normal: '300ms',
  			slow: '450ms'
  		},
  		transitionTimingFunction: {
  			apple: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}