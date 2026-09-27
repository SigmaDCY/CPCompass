import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 引入 v4 插件

export default defineConfig(
  {
    plugins: [react(), tailwindcss()], // 使用插件
    build: {
      outDir: '../public',
    },
  })