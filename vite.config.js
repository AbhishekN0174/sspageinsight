import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import compression from 'vite-plugin-compression'
import inlineCriticalCss from './scripts/inline-critical-css.js'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  
  return {
    plugins: [
      react(),
      // Bundle visualizer - generates `dist/bundle-stats.html` after build
      visualizer({ filename: 'dist/bundle-stats.html', open: false, gzipSize: true, brotliSize: true }),
      // Inline critical CSS to improve FCP
      inlineCriticalCss(),
      // Precompress assets (gzip + brotli) for faster delivery
      compression({ algorithm: 'gzip', ext: '.gz', deleteOriginFile: false }),
      compression({ algorithm: 'brotli', ext: '.br', deleteOriginFile: false })
    ],
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
    build: {
      // Code splitting for better caching and lazy-loading
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['react', 'react-dom', 'react-router-dom'],
            'animation': ['framer-motion'],
            'maps': ['@react-google-maps/api'],
            'utils': ['date-fns', 'react-intersection-observer'],
          }
        }
      },
      // Aggressive minification for smaller bundles
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info'],
          unused: true,
        },
        mangle: true,
        format: {
          comments: false,
        }
      },
      // Target modern browsers only (reduce polyfill overhead)
      target: 'es2020',
      // Reduce chunk size warnings
      chunkSizeWarningLimit: 1000,
      // CSS optimization
      cssCodeSplit: true,
      // Inline small assets to reduce HTTP requests
      assetsInlineLimit: 8192,
    }
  }
})
