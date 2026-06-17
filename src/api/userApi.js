const API_BASE = import.meta.env.VITE_API_URL || 'https://workspace-backend-pyb2.onrender.com/api';
export const userApi = {
    // Get all users
    getAllUsers: async (token) => {
        const res = await fetch(`${API_BASE}/users`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return res.json();
    },

    // Get single user
    getUser: async (token, userId) => {
        const res = await fetch(`${API_BASE}/users/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return res.json();
    },

    // Create user
    createUser: async (token, userData) => {
        const res = await fetch(`${API_BASE}/users`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        return res.json();
    },

    // Update user
    updateUser: async (token, userId, userData) => {
        const res = await fetch(`${API_BASE}/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        return res.json();
    },

    // Delete user
    deleteUser: async (token, userId) => {
        const res = await fetch(`${API_BASE}/users/${userId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return res.json();
    },

    // Bulk upload
    bulkUpload: async (token, users) => {
        const res = await fetch(`${API_BASE}/users/bulk/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ users }),
        });
        return res.json();
    },

    // Search users
    searchUsers: async (token, query) => {
        const res = await fetch(`${API_BASE}/users/search?query=${query}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return res.json();
    },

    // Upload profile picture
    uploadProfilePicture: async (token, profilePicture) => {
        const res = await fetch(`${API_BASE}/users/profile-picture`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ profilePicture }),
        });
        return res.json();
    },
};