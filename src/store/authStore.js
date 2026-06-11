import { create } from 'zustand';
const useAuthStore = create((set) => ({
    isAuthenticated: !!localStorage.getItem('accessToken'),
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    loading: false,
    error: null,
    login: async (email, password, role = 'user') => {
        set({ loading: true, error: null });
        try {
            const res = await fetch('https://workspace-backend-pyb2.onrender.com/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                set({ error: data.message, loading: false });
                return false;
            }
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('user', JSON.stringify(data.user));
            set({
                isAuthenticated: true,
                user: data.user,
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
                loading: false,
                error: null,
            });
            return true;
        } catch (err) {
            set({ error: 'Login failed', loading: false });
            return false;
        }
    },
    logout: async () => {
        try {
            const token = localStorage.getItem('accessToken');
            await fetch('https://workspace-backend-pyb2.onrender.com/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('selectedRole');
        set({
            isAuthenticated: false,
            user: null,
            accessToken: null,
            refreshToken: null,
            error: null,
        });
    },
    register: async (companyName, email, password, confirmPassword, name) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch('https://workspace-backend-pyb2.onrender.com/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    companyName,
                    email,
                    password,
                    confirmPassword,
                    name,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                set({ error: data.message, loading: false });
                return false;
            }
            set({ loading: false, error: null });
            return true;
        } catch (err) {
            set({ error: 'Registration failed', loading: false });
            return false;
        }
    },
    refreshToken: async () => {
        try {
            const refreshTokenValue = localStorage.getItem('refreshToken');

            if (!refreshTokenValue) {
                set({ isAuthenticated: false, user: null });
                return false;
            }
            const res = await fetch('https://workspace-backend-pyb2.onrender.com/api/auth/refresh-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: refreshTokenValue }),
            });
            const data = await res.json();
            if (!res.ok) {
                set({ isAuthenticated: false, user: null });
                return false;
            }
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            set({
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
            });
            return true;
        } catch (error) {
            return false;
        }
    },
    setUser: (user) => set({
        user,
        isAuthenticated: !!user
    }),
    clearError: () => set({ error: null }),
}));

export default useAuthStore;