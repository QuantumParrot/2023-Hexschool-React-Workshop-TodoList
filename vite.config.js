import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/2023-Hexschool-React-Workshop-TodoList/' : '/',
  plugins: [react()],
})
