import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: true
    },
    // Expose MIXPANEL_TOKEN from .env as VITE_MIXPANEL_TOKEN for client-side access
    define: {
      'import.meta.env.VITE_MIXPANEL_TOKEN': JSON.stringify(env.MIXPANEL_TOKEN || env.VITE_MIXPANEL_TOKEN || ''),
    },
    // Include .MOV files as assets
    assetsInclude: ['**/*.MOV', '**/*.mov'],
    // Build optimization configuration
    build: {
      target: 'esnext',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'animation': ['framer-motion'],
            'maps': ['@react-google-maps/api'],
            'analytics': ['mixpanel-browser'],
          },
        },
      },
      // Optimize chunk sizes
      chunkSizeWarningLimit: 500,
      reportCompressedSize: false,
      cssCodeSplit: true,
      sourcemap: false,
    },
    // Performance hints
    preview: {
      port: 4173,
    },
  }
})
