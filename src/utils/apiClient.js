import { refreshAccessToken } from '../api/auth.js';
export const apiCall = async (url, options = {}) => {
    let token = localStorage.getItem('accessToken');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    let res = await fetch(url, { ...options, headers });
    if (res.status === 401) {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            const refreshed = await refreshAccessToken(refreshToken);
            if (refreshed) {
                token = refreshed.accessToken;
                headers['Authorization'] = `Bearer ${token}`;
                res = await fetch(url, { ...options, headers });
            }
        }
    }
    return res;
};