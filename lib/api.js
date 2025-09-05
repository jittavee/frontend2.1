// lib/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Interceptor เพื่อแนบ Token ไปกับทุก request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // console.log('Attaching token to request:', config.headers.Authorization); // <--- เพิ่มบรรทัดนี้เพื่อดีบัก
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;