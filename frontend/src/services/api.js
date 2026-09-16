import axios from "axios";

const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

const api = axios.create({
    baseURL: isLocalhost
        ? "http://localhost:5000/api"
        : "https://pwa-demo-frontend.onrender.com/api",
        

    headers: {
        "Content-Type": "application/json",
    },
});


api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;