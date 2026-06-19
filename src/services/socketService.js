import io from 'socket.io-client';

let socket = null;

export const initSocket = (token) => {
    if (socket) return socket;

    socket = io(import.meta.env.VITE_SOCKET_URL || 'https://workspace-backend-pyb2.onrender.com', {
        auth: {
            token,
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
        console.log('Connected to socket server');
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from socket server');
    });

    return socket;
};

export const getSocket = () => socket;

export const userOnline = (userId) => {
    if (socket) socket.emit('user-online', userId);
};

export const joinChat = (chatId) => {
    if (socket) socket.emit('join-chat', chatId);
};

export const joinMeeting = (meetingId) => {
    console.log('🟡 joinMeeting called. Socket exists?', !!socket, 'Socket connected?', socket?.connected);
    if (socket) socket.emit('join-meeting', meetingId);
};

export const sendOffer = (data) => {
    if (socket) socket.emit('offer', data);
};

export const sendAnswer = (data) => {
    if (socket) socket.emit('answer', data);
};

export const sendIceCandidate = (data) => {
    if (socket) socket.emit('ice-candidate', data);
};

export const sendMessage = (messageData) => {
    if (socket) socket.emit('send-message', messageData);
};

export const onReceiveMessage = (callback) => {
    if (socket) {
        socket.off('receive-message'); // remove old listener first
        socket.on('receive-message', callback);
    }
};

export const onUserJoined = (callback) => {
    if (socket) {
        socket.off('user-joined');
        socket.on('user-joined', callback);
    }
};

export const onReceiveOffer = (callback) => {
    if (socket) {
        socket.off('offer');
        socket.on('offer', callback);
    }
};

export const onReceiveAnswer = (callback) => {
    if (socket) {
        socket.off('answer');
        socket.on('answer', callback);
    }
};

export const onReceiveIceCandidate = (callback) => {
    if (socket) {
        socket.off('ice-candidate');
        socket.on('ice-candidate', callback);
    }
};

export const startTyping = (data) => {
    if (socket) socket.emit('typing', data);
};

export const stopTyping = (data) => {
    if (socket) socket.emit('stop-typing', data);
};

export const onUserTyping = (callback) => {
    if (socket) {
        socket.off('user-typing');
        socket.on('user-typing', callback);
    }
};

export const onUserStoppedTyping = (callback) => {
    if (socket) {
        socket.off('user-stopped-typing');
        socket.on('user-stopped-typing', callback);
    }
};

export const addReaction = (data) => {
    if (socket) socket.emit('add-reaction', data);
};

export const onReactionAdded = (callback) => {
    if (socket) socket.on('reaction-added', callback);
};

export const onUserStatus = (callback) => {
    if (socket) socket.on('user-status', callback);
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};