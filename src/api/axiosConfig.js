// src/api/axiosConfig.js
// import axios from 'axios';

// const api = axios.create({
  
//   baseURL: 'https://postsphere-backend-r4mi.onrender.com/api', // backend baseURL
//   withCredentials: true, // send cookies for session
// });


// export default api;
// src/api/axiosConfig.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // adjust if needed
});

// Add JWT token to all requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
