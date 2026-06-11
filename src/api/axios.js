import axios from "axios";
const api = axios.create({
    baseURL: "import.meta.env.VITE_API_URL || 'https://workspace-backend-pyb2.onrender.com/api",
    withCredentials: true,
});
export default api;