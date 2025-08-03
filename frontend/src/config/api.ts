// API Configuration
const getBackendUrl = (): string => {
  // Check if we're in development
  if (import.meta.env.DEV) {
    // For WSL, try to use the WSL IP address
    // You can override this by setting VITE_BACKEND_URL environment variable
    return import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
  }
  
  // For production, use relative URL
  return '/api';
};

export const API_BASE_URL = getBackendUrl();

export const API_ENDPOINTS = {
  health: `${API_BASE_URL}/health`,
  compile: `${API_BASE_URL}/compile`,
}; 