import axios from 'axios';
import { host, port } from '../config.json';

const axiosInstance = axios.create({
    baseURL: `${host}:${port}`
});

axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default axiosInstance;
