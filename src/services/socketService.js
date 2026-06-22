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
    // data = { meetingId, offer, targetId }
    if (socket) socket.emit('offer', data);
};

export const sendAnswer = (data) => {
    // data = { meetingId, answer, targetId }
    if (socket) socket.emit('answer', data);
};

export const sendIceCandidate = (data) => {
    // data = { meetingId, candidate, targetId }
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

export const onExistingParticipants = (callback) => {
    if (socket) {
        socket.off('existing-participants');
        socket.on('existing-participants', callback);
    }
};

export const onReceiveOffer = (callback) => {
    if (socket) {
        socket.off('offer');
        socket.on('offer', (data) => {
            // data = { offer, fromId }
            callback(data);
        });
    }
};

export const onReceiveAnswer = (callback) => {
    if (socket) {
        socket.off('answer');
        socket.on('answer', (data) => {
            // data = { answer, fromId }
            callback(data);
        });
    }
};

export const onReceiveIceCandidate = (callback) => {
    if (socket) {
        socket.off('ice-candidate');
        socket.on('ice-candidate', (data) => {
            // data = { candidate, fromId }
            callback(data);
        });
    }
};

export const sendMeetingMessage = (data) => {
    if (socket) socket.emit('send-meeting-message', data);
};

export const onReceiveMeetingMessage = (callback) => {
    if (socket) {
        socket.off('receive-meeting-message');
        socket.on('receive-meeting-message', callback);
    }
};

export const offReceiveMeetingMessage = () => {
    if (socket) socket.off('receive-meeting-message');
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

export const sendRaiseHand = (data) => {
    if (socket) socket.emit('raise-hand', data);
};

export const onRaiseHand = (callback) => {
    if (socket) {
        socket.off('raise-hand');
        socket.on('raise-hand', callback);
    }
};

export const sendLowerHand = (data) => {
    if (socket) socket.emit('lower-hand', data);
};

export const onLowerHand = (callback) => {
    if (socket) {
        socket.off('lower-hand');
        socket.on('lower-hand', callback);
    }
};

export const sendScreenShare = (data) => {
    if (socket) socket.emit('screen-share-start', data);
};

export const onScreenShareStart = (callback) => {
    if (socket) {
        socket.off('screen-share-start');
        socket.on('screen-share-start', callback);
    }
};

export const sendScreenShareStop = (data) => {
    if (socket) socket.emit('screen-share-stop', data);
};

export const onScreenShareStop = (callback) => {
    if (socket) {
        socket.off('screen-share-stop');
        socket.on('screen-share-stop', callback);
    }
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};