import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#b45309',
          hover: '#92400e',
          soft: '#fef3c7',
        },
        danger: {
          DEFAULT: '#dc2626',
          hover: '#b91c1c',
        },
        success: {
          DEFAULT: '#15803d',
          hover: '#166534',
        },
      },
      maxWidth: {
        content: '56rem',
      },
    },
  },
  plugins: [],
};

export default config;
