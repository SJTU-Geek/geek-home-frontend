import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Vite 不会自动把 .env 注入到 vite.config.ts 的 process.env，
// 这里用 loadEnv() 显式加载当前 mode 下的 .env / .env.<mode> / .env.local 等。
// 第三个参数 '' 表示不限制变量名前缀（默认只读 VITE_ 开头的）。
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendTarget = env.VITE_BACKEND_BASE || 'http://127.0.0.1:8000';

  return {
    plugins: [react()],
    server: {
      host: '127.0.0.1',
      port: 5173,
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true,
        },
        '/auth': {
          target: backendTarget,
          changeOrigin: true,
        },
      },
    },
    base: '/',
  };
});
