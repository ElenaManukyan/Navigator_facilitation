const baseURL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

export const api = axios.create({
  baseURL,  // Домен бэкенда
  withCredentials: true, // Для куки
});

export default api;