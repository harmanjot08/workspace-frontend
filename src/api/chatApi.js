const API_BASE = 'http://localhost:5000/api';

export const chatAPI = {
    // Create chat
    createChat: async (token, { memberIds, isGroup }) => {
        const res = await fetch(`${API_BASE}/chats`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ participantIds: memberIds, isGroup }),
        });
        return res.json();
    },

    // Get all users (to start new chat)
    getUsers: async (token) => {
        const res = await fetch(`${API_BASE}/users`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return res.json();
    },

    // Get all chats
    getAllChats: async (token) => {
        const res = await fetch(`${API_BASE}/chats`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return res.json();
    },

    // Get single chat
    getChat: async (token, chatId) => {
        const res = await fetch(`${API_BASE}/chats/${chatId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return res.json();
    },

    // Send message
    sendMessage: async (token, chatId, content) => {
        const res = await fetch(`${API_BASE}/chats/${chatId}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content }),
        });
        return res.json();
    },

    // Add reaction
    addReaction: async (token, messageId, emoji) => {
        const res = await fetch(`${API_BASE}/chats/messages/${messageId}/reactions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ emoji }),
        });
        return res.json();
    },

    // Delete message
    deleteMessage: async (token, messageId) => {
        const res = await fetch(`${API_BASE}/chats/messages/${messageId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return res.json();
    },

    // Mark as read
    markAsRead: async (token, messageId) => {
        const res = await fetch(`${API_BASE}/chats/messages/${messageId}/read`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return res.json();
    },

    // Add member
    addMember: async (token, chatId, userId) => {
        const res = await fetch(`${API_BASE}/chats/${chatId}/members`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });
        return res.json();
    },

    // Archive chat
    archiveChat: async (token, chatId) => {
        const res = await fetch(`${API_BASE}/chats/${chatId}/archive`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return res.json();
    },
};