import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/TicketSystem/",
  optimizeDeps: {
    include: ["pdfjs-dist/build/pdf.worker.min.js"],
  },
});