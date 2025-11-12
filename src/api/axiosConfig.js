// src/api/axiosConfig.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://postsphere-backend-r4mi.onrender.com/api', // backend baseURL
  withCredentials: true, // send cookies for session
});


export default api;