
// Vite exposes MIXPANEL_TOKEN from .env as VITE_MIXPANEL_TOKEN (configured in vite.config.js)// Analytics Configuration
// The MIXPANEL_TOKEN from .env file (without VITE_ prefix) is exposed 
// via vite.config.js as VITE_MIXPANEL_TOKEN for client-side access

// Vite exposes MIXPANEL_TOKEN from .env as VITE_MIXPANEL_TOKEN (configured in vite.config.js)
export const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN

// For reference (not used in client-side code)
export const MIXPANEL_API_SECRET = import.meta.env.MIXPANEL_API_SECRET

