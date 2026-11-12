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

<<<<<<< HEAD
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
=======
  // Allow Axios and the browser to set the multipart boundary
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});
>>>>>>> 70aeeb9897e0568ed0ddb486646b956588095fd5

export default API;
