import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5188,
    strictPort: false, // 5188이 사용 중이면 다음 빈 포트로 자동 이동
  },
})
