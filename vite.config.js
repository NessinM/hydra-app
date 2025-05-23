import { defineConfig  } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 9000,
    strictPort: true,
    host: "0.0.0.0", // Permite el acceso desde otros dispositivos en la red
    open: "/", // Abre automáticamente la URL raíz en el navegador
    cors: {
      origin: "*", // ⚠️ Usa un origen específico en producción
      methods: ["GET", "POST"],
    },
  },
})
