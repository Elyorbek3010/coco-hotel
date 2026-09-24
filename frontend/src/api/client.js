import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!rawBaseUrl && !import.meta.env.DEV) {
  console.error('[API Client Error] VITE_API_BASE_URL is not configured.');
}

// In development, fall back to localhost Django if not explicitly provided
export const API_BASE_URL = rawBaseUrl || (import.meta.env.DEV ? 'http://127.0.0.1:8000/api/v1' : '');

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export const checkHealth = async () => {
  const response = await apiClient.get('/health/');
  return response.data;
};

export default apiClient;
