// API configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3001',
  ENDPOINTS: {
    DASHBOARD: '/api/dashboard',
    STUDY_SESSIONS: '/api/study-sessions',
    WORDS: '/api/words',
    GROUPS: '/api/groups',
    ACTIVITIES: '/api/activities'
  }
};

// API helper function
export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error('API request failed');
  }

  return response.json();
} 