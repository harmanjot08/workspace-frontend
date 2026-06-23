const API_URL = import.meta.env.VITE_API_URL || 'https://workspace-backend-pyb2.onrender.com/api';

export const emailApi = {
    sendEmail: async (token, { to, subject, body }) => {
        const response = await fetch(`${API_URL}/emails/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ to, subject, body }),
        });
        return response.json();
    },

    getInbox: async (token) => {
        const response = await fetch(`${API_URL}/emails/inbox`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return response.json();
    },

    getSentEmails: async (token) => {
        const response = await fetch(`${API_URL}/emails/sent`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return response.json();
    },

    getDrafts: async (token) => {
        const response = await fetch(`${API_URL}/emails/drafts`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return response.json();
    },

    getEmail: async (token, emailId) => {
        const response = await fetch(`${API_URL}/emails/${emailId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return response.json();
    },

    deleteEmail: async (token, emailId) => {
        const response = await fetch(`${API_URL}/emails/${emailId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return response.json();
    },

    saveDraft: async (token, { to, subject, body, draftId }) => {
        const response = await fetch(`${API_URL}/emails/draft/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ to, subject, body, draftId }),
        });
        return response.json();
    },
};