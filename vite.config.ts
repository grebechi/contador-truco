import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Marcador de Truco Gaúcho',
        short_name: 'Truco',
        description: 'Caderno digital para Truco Gaúcho',
        theme_color: '#1a1a1a',
        background_color: '#1a1a1a',
        display: 'standalone', // Faz o app abrir em tela cheia, sem a barra de URL do navegador
        orientation: 'landscape', // Sugere que o app prefere rodar deitado
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})