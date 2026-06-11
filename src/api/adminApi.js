const API_BASE = 'http://localhost:5000/api/admin';

export const adminAPI = {
    // ===== COMPANIES =====
    getAllCompanies: async (token) => {
        const res = await fetch(`${API_BASE}/companies`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return res.json();
    },

    getCompany: async (token, companyId) => {
        const res = await fetch(`${API_BASE}/companies/${companyId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return res.json();
    },

    updateCompany: async (token, companyId, data) => {
        const res = await fetch(`${API_BASE}/companies/${companyId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return res.json();
    },

    // ===== PRICING PLANS =====
    getAllPricingPlans: async (token) => {
        const res = await fetch(`${API_BASE}/pricing-plans`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return res.json();
    },

    createPricingPlan: async (token, data) => {
        const res = await fetch(`${API_BASE}/pricing-plans`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return res.json();
    },

    updatePricingPlan: async (token, planId, data) => {
        const res = await fetch(`${API_BASE}/pricing-plans/${planId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return res.json();
    },

    deletePricingPlan: async (token, planId) => {
        const res = await fetch(`${API_BASE}/pricing-plans/${planId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return res.json();
    },

    // ===== SUBSCRIPTIONS =====
    getAllSubscriptions: async (token) => {
        const res = await fetch(`${API_BASE}/subscriptions`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return res.json();
    },

    createSubscription: async (token, data) => {
        const res = await fetch(`${API_BASE}/subscriptions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return res.json();
    },

    updateSubscription: async (token, subscriptionId, data) => {
        const res = await fetch(`${API_BASE}/subscriptions/${subscriptionId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return res.json();
    },

    cancelSubscription: async (token, subscriptionId) => {
        const res = await fetch(`${API_BASE}/subscriptions/${subscriptionId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return res.json();
    },

    // ===== ANALYTICS =====
    getAnalytics: async (token) => {
        const res = await fetch(`${API_BASE}/analytics`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return res.json();
    },
};