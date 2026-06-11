const API_BASE = 'http://localhost:5000/api';

export const taskAPI = {
    getTasks: async (token) => {
        const res = await fetch(`${API_BASE}/tasks`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return res.json();
    },

    createTask: async (token, data) => {
        const res = await fetch(`${API_BASE}/tasks`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return res.json();
    },

    updateTask: async (token, taskId, data) => {
        const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return res.json();
    },

    deleteTask: async (token, taskId) => {
        const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return res.json();
    },
};