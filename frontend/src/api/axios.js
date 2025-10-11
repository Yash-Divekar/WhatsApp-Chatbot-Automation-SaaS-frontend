import axios from 'axios';

const backend_base_url = import.meta.env.VITE_BACKEND_BASE_URL
export const api = axios.create({
  baseURL: backend_base_url,
  headers: {
    "Content-Type": "application/json",
  },
});
