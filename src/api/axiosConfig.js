// src/api/axiosConfig.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // backend baseURL
  withCredentials: true, // send cookies for session
});

export default api;