import axios from 'axios';

const API_URL = "http://localhost:8080/api";

// Tạo instance axios
const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Hàm để lưu thông tin đăng nhập (Basic Auth)
export const setAuthToken = (username, password) => {
    const token = btoa(`${username}:${password}`);
    localStorage.setItem("auth", token);
};

// Interceptor: Tự động gắn token vào mỗi request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("auth");
    if (token) {
        config.headers["Authorization"] = `Basic ${token}`;
    }
    return config;
});

export default api;