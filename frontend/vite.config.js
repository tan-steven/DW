import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default ({ mode }) => {
  // Load env variables from .env / .env.local / .env.[mode]
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  // Define proxy target
  const proxy_url =
    process.env.VITE_USE_REMOTE === 'true'
      ? process.env.VITE_REMOTE_BACKEND
      : 'http://localhost:4005';

  return defineConfig({
    plugins: [
      react(),
      tailwindcss()
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      host: '0.0.0.0', // Allow external connections
      port: 5173,
      proxy: {
        '/api': {
          target: proxy_url,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  });
};