import axios from "axios";

const API = axios.create({
  // baseURL: "https://chronosbe.onrender.com/api/v1",
  baseURL: "http://localhost:5000/api/v1",
});

// Automatically attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default API;
