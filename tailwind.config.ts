import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				// Theme Colors
				anime: {
					primary: 'hsl(var(--anime-primary))',
					secondary: 'hsl(var(--anime-secondary))',
					accent: 'hsl(var(--anime-accent))',
					glow: 'hsl(var(--anime-glow))',
					text: 'hsl(var(--anime-text))',
				},
				minimal: {
					bg: 'hsl(var(--minimal-bg))',
					surface: 'hsl(var(--minimal-surface))',
					text: 'hsl(var(--minimal-text))',
					border: 'hsl(var(--minimal-border))',
					accent: 'hsl(var(--minimal-accent))',
				},
				cyber: {
					primary: 'hsl(var(--cyber-primary))',
					secondary: 'hsl(var(--cyber-secondary))',
					accent: 'hsl(var(--cyber-accent))',
					glow: 'hsl(var(--cyber-glow))',
					text: 'hsl(var(--cyber-text))',
					dark: 'hsl(var(--cyber-dark))',
				},
			},
			fontFamily: {
				cyber: ['Orbitron', 'monospace'],
				anime: ['Nunito', 'sans-serif'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			backdropBlur: {
				'glass': 'var(--glass-blur)',
			},
			keyframes: {
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' },
				},
				'background-fade': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
					'50%': { transform: 'translateY(-20px) rotate(5deg)' },
				},
				'glitch': {
					'0%, 100%': { transform: 'translate(0)' },
					'20%': { transform: 'translate(-2px, 2px)' },
					'40%': { transform: 'translate(-2px, -2px)' },
					'60%': { transform: 'translate(2px, 2px)' },
					'80%': { transform: 'translate(2px, -2px)' },
				},
				'pulse-scale': {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.05)' },
				},
			},
			animation: {
				'fade-in': 'fade-in 0.6s ease-out',
				'slide-in-right': 'slide-in-right 0.4s ease-out',
				'background-fade': 'background-fade 1s ease-in-out',
				'float': 'float 6s ease-in-out infinite',
				'glitch': 'glitch 0.3s ease-in-out',
				'pulse-scale': 'pulse-scale 2s ease-in-out infinite',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
