const BASE_URL = 'https://workspace-backend-pyb2.onrender.com/api/emails';

const getToken = () => localStorage.getItem('accessToken');

export const getInboxEmails = async () => {
    const res = await fetch(`${BASE_URL}/inbox`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

    return res.json();
};

export const getSentEmails = async () => {
    const res = await fetch(`${BASE_URL}/sent`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

    return res.json();
};

export const getDraftEmails = async () => {
    const res = await fetch(`${BASE_URL}/drafts`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

    return res.json();
};

export const getPromotionEmails = async () => {
    const res = await fetch(`${BASE_URL}/promotions`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

    return res.json();
};

export const sendEmail = async (payload) => {
    const res = await fetch(`${BASE_URL}/send`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
    });

    return res.json();
};

export const deleteEmail = async (emailId) => {
    const res = await fetch(`${BASE_URL}/${emailId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

    return res.json();
};

export const getEmailById = async (emailId) => {
    const res = await fetch(`${BASE_URL}/${emailId}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

    return res.json();
};

export const saveDraft = async (payload) => {
    const res = await fetch(`${BASE_URL}/draft/save`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
    });

    return res.json();
};