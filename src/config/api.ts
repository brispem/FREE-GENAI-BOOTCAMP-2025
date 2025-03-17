const API_CONFIG = {
  baseUrl: 'http://localhost:5174', // Hardcode for now to debug
  endpoints: {
    dashboard: '/dashboard',
    stats: '/stats'
  }
} as const;

export default API_CONFIG; 