const API_BASE_URL = import.meta.env.DEV
  ? import.meta.env.VITE_BACKEND_URL || "http://localhost:3001/api" // dev: localhost:3001/api, pode ser sobrescrito com var de ambiente VITE_BACKEND_URL
  : "/api"; // prod: front-end e back-end no mesmo domínio

export const API_ENDPOINTS = {
  health: `${API_BASE_URL}/health`,
  compile: `${API_BASE_URL}/compile`,
};
