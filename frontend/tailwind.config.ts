import type { Config } from 'tailwindcss';

const config = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	prefix: '',
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
				aix: {
					'50': '#ffffff',
					'100': '#f2f5f9',
					'200': '#e3e8ef',
					'300': '#cdd5e0',
					'400': '#afbac8',
					'500': '#939dae',
					'600': '#6c7788',
					'700': '#4a576b',
					'800': '#29364b',
					'900': '#121f37',
					green: {
						default: '#ccffce',
						'500': '#57eea6',
					},
					frosted: 'rgba(255, 255, 255, 0.34)',
				},
			},

			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				spotlight: {
					'0%': {
						opacity: '0',
						transform: 'translate(-72%, -62%) scale(0.5)',
					},
					'100%': {
						opacity: '1',
						transform: 'translate(-50%,-40%) scale(1)',
					},
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				spotlight: 'spotlight 2s ease .75s 1 forwards',
			},
			fontFamily: {
				roboto: 'var(--font-roboto)',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
