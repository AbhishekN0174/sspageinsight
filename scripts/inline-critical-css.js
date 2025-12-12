/**
 * Inline critical CSS into HTML head to improve First Contentful Paint (FCP)
 * This script extracts styles needed for above-the-fold content
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Critical CSS for above-the-fold content (hero section)
const CRITICAL_CSS = `
html {
  scroll-behavior: smooth;
}

body {
  background: white;
  color: rgb(31, 41, 55);
  font-family: 'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Kumbh Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  font-weight: bold;
  color: rgb(17, 24, 39);
}

/* Hero section critical styles */
.hero-section {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
}

.hero-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

/* Gradient backgrounds */
.text-gradient {
  background: linear-gradient(to right, #f48fb4, #f174ae, #e96d9a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Base button styles */
button {
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-weight: 600;
  transition: all 0.3s ease;
}

/* Prevent layout shift */
img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* Root container */
#root {
  width: 100%;
}

/* Fallback fonts */
.fallback-font {
  font-family: system-ui, -apple-system, sans-serif;
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
`

export default function inlineCriticalCss() {
  return {
    name: 'inline-critical-css',
    apply: 'build',
    enforce: 'post',
    generateBundle(options, bundle) {
      // Find index.html in the bundle
      const htmlFile = Object.keys(bundle).find(name => name.endsWith('index.html'))
      
      if (!htmlFile) return
      
      let html = bundle[htmlFile].source.toString()
      
      // Inject critical CSS inline before the main stylesheet
      const criticalCssTag = `<style>${CRITICAL_CSS}</style>`
      
      // Insert after <title> and before the stylesheet link
      const titleEndIndex = html.lastIndexOf('</title>') + '</title>'.length
      
      if (titleEndIndex > '</title>'.length - 1) {
        html = html.slice(0, titleEndIndex) + '\n' + criticalCssTag + '\n' + html.slice(titleEndIndex)
      }
      
      // Add defer attribute to main script
      html = html.replace(
        /<script type="module" crossorigin src="([^"]+)"><\/script>/,
        '<script type="module" crossorigin defer src="$1"><\/script>'
      )
      
      // Optimize CSS loading: Change stylesheet to preload + onload pattern
      // This makes CSS non-blocking on modern browsers
      html = html.replace(
        /<link rel="stylesheet" crossorigin href="\/assets\/([^"]+\.css)">(?=\s*<\/head>)/,
        '<link rel="preload" as="style" crossorigin href="/assets/$1" onload="this.rel=\'stylesheet\'">\n    <noscript><link rel="stylesheet" crossorigin href="/assets/$1"></noscript>'
      )
      
      // Defer Google Fonts using media=print + onload to prevent render-blocking
      // Load only essential weights (400, 600, 700)
      html = html.replace(
        /href="https:\/\/fonts\.googleapis\.com\/css2[^"]*"/g,
        'href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=Kumbh+Sans:wght@400;700&family=Nunito+Sans:wght@400;600;700&display=swap" media="print" onload="this.media=\'all\'"'
      )
      
      // Remove all modulepreload links to save bandwidth on mobile
      // Chunks will be lazy-loaded on-demand via dynamic import
      html = html.replace(/<link rel="modulepreload"[^>]*>/g, '')
      
      bundle[htmlFile].source = html
    }
  }
}
