import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  
  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: true
    },
    // Expose environment variables for client-side access
    define: {
      'import.meta.env.VITE_MIXPANEL_TOKEN': JSON.stringify(env.VITE_MIXPANEL_TOKEN || ''),
    },
    // Include .MOV files as assets
    assetsInclude: ['**/*.MOV', '**/*.mov'],
  }
})
