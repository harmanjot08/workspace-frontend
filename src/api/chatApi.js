import { ChartNoAxesColumnDecreasing } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || 'https://workspace-backend-pyb2.onrender.com/api';

export const chatAPI = {
    // Create chat
    createChat: async (token, { memberIds, isGroup, chatName }) => {
        const res = await fetch(`${API_BASE}/chats`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                participantIds: memberIds,
                isGroup,
                chatName
            }),
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
    sendMessage: async (token, chatId, content, fileData = null) => {
        const res = await fetch(`${API_BASE}/chats/${chatId}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content,
                fileUrl: fileData?.fileUrl,
                fileName: fileData?.fileName,
                fileType: fileData?.fileType,
            }),
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
    deleteMessage: async (token, messageId, deleteType = 'everyone') => {
        const res = await fetch(`${API_BASE}/chat/messages/${messageId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ deleteType }),
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