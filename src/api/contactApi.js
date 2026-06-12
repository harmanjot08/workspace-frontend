const API_BASE = import.meta.env.VITE_API_URL || 'https://workspace-backend-pyb2.onrender.com/api';

export const contactAPI = {
    sendMessage: async (data) => {
        const res = await fetch(`${API_BASE}/contact/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return res.json();
    },
};