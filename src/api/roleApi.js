const API_BASE = import.meta.env.VITE_API_URL || 'https://workspace-backend-pyb2.onrender.com/api';

export const roleAPI = {
    getRoles: async (token) => {
        const res = await fetch(`${API_BASE}/roles`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return res.json();
    },

    createRole: async (token, data) => {
        const res = await fetch(`${API_BASE}/roles`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return res.json();
    },

    deleteRole: async (token, roleId) => {
        const res = await fetch(`${API_BASE}/roles/${roleId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return res.json();
    },

    assignUser: async (token, roleId, userId) => {
        const res = await fetch(`${API_BASE}/roles/${roleId}/assign`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });
        return res.json();
    },

    removeUser: async (token, roleId, userId) => {
        const res = await fetch(`${API_BASE}/roles/${roleId}/users/${userId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return res.json();
    },
};