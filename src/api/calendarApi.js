const API_BASE = import.meta.env.VITE_API_URL || 'https://workspace-backend-pyb2.onrender.com/api';

export const calendarAPI = {
    // Get all events
    getEvents: async (token) => {
        const res = await fetch(`${API_BASE}/calendar`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return res.json();
    },

    // Get user events
    getUserEvents: async (token) => {
        const res = await fetch(`${API_BASE}/calendar/my-events`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return res.json();
    },

    // Get single event
    getEvent: async (token, eventId) => {
        const res = await fetch(`${API_BASE}/calendar/${eventId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return res.json();
    },

    // Create event
    createEvent: async (token, data) => {
        // Convert local datetime to ISO string with timezone
        const startTime = new Date(data.startTime).toISOString();
        const endTime = new Date(data.endTime).toISOString();

        const res = await fetch(`${API_BASE}/events`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...data,
                startTime,
                endTime,
            }),
        });
        return res.json();
    },

    // Update event
    updateEvent: async (token, eventId, eventData) => {
        const res = await fetch(`${API_BASE}/calendar/${eventId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData),
        });
        return res.json();
    },

    // Delete event
    deleteEvent: async (token, eventId) => {
        const res = await fetch(`${API_BASE}/calendar/${eventId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return res.json();
    },
};