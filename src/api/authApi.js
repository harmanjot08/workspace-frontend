import api from "./axios";
export const loginUser = async (data) => {
    const response = await api.post("/auth/login", data);
    return response.data;
};
export const registerUser = async (data) => {
    const response = await api.post("/auth/register", data);
    return response.data;
};
export const refreshAccessToken = async (refreshToken) => {
    const response = await api.post("/auth/refresh-token", { refreshToken });
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);

    return response.data;
};