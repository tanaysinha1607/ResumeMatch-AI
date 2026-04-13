// API base URL — uses env var in production (Vercel), falls back to localhost for dev
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
