import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    joinMeeting,
    onUserJoined,
    onExistingParticipants,
    sendOffer,
    sendAnswer,
    sendIceCandidate,
    onReceiveOffer,
    onReceiveAnswer,
    onReceiveIceCandidate,
    sendMeetingMessage,
    onReceiveMeetingMessage,
    offReceiveMeetingMessage,
    sendRaiseHand,
    onRaiseHand,
    sendLowerHand,
    onLowerHand,
} from '../../services/socketService';
import { getSocket } from '../../services/socketService';
import { Mic, MicOff, Video, VideoOff, Phone, Send, X, MessageCircle, Hand } from 'lucide-react';

export default function MeetingPage() {
    const { meetingId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('accessToken');
    const currentUser = JSON.parse(localStorage.getItem('user'));

    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isAudioOn, setIsAudioOn] = useState(true);
    const [chatMessages, setChatMessages] = useState([]);
    const [isHandRaised, setIsHandRaised] = useState(false);
    const [raisedHands, setRaisedHands] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [showChat, setShowChat] = useState(true);
    const [remoteStreams, setRemoteStreams] = useState({});
    const [participants, setParticipants] = useState([]);

    const localVideoRef = useRef(null);
    const localStreamRef = useRef(null);
    const peerConnectionsRef = useRef({}); // Multiple peer connections: { socketId: peerConnection }

    const servers = {
        iceServers: [
            {
                urls: 'stun:stun.l.google.com:19302',
            },
        ],
    };

    const toggleVideo = () => {
        if (!localStreamRef.current) return;
        const videoTrack = localStreamRef.current.getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            setIsVideoOn(videoTrack.enabled);
        }
    };

    const toggleAudio = () => {
        if (!localStreamRef.current) return;
        const audioTrack = localStreamRef.current.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            setIsAudioOn(audioTrack.enabled);
        }
    };

    const endCall = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
        }
        // Close all peer connections
        Object.values(peerConnectionsRef.current).forEach(pc => pc.close());
        offReceiveMeetingMessage();
        navigate(-1);
    };

    const toggleChat = () => {
        setShowChat(!showChat);
    };

    const toggleRaiseHand = () => {
        const newState = !isHandRaised;
        setIsHandRaised(newState);

        if (newState) {
            // Hand raised
            sendRaiseHand({
                meetingId,
                socketId: getSocket()?.id,
                userName: currentUser?.name || 'User',
                userId: currentUser?.id,
            });
        } else {
            // Hand lowered
            sendLowerHand({
                meetingId,
                socketId: getSocket()?.id,
                userId: currentUser?.id,
            });
        }
    };

    // Create peer connection for a specific target user
    const createPeerConnection = (targetId) => {
        const peerConnection = new RTCPeerConnection(servers);

        peerConnection.ontrack = (event) => {
            console.log("Remote stream received from:", targetId);
            setRemoteStreams(prev => ({
                ...prev,
                [targetId]: event.streams[0]
            }));
        };

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                sendIceCandidate({
                    meetingId,
                    candidate: event.candidate,
                    targetId: targetId,
                });
            }
        };

        peerConnection.onconnectionstatechange = () => {
            console.log("Connection state with", targetId, ":", peerConnection.connectionState);
        };

        peerConnection.oniceconnectionstatechange = () => {
            console.log("ICE connection state with", targetId, ":", peerConnection.iceConnectionState);
        };

        // Add local tracks
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => {
                peerConnection.addTrack(track, localStreamRef.current);
            });
        }

        peerConnectionsRef.current[targetId] = peerConnection;
        return peerConnection;
    };

    useEffect(() => {
        const socket = getSocket();
        if (socket) {
            socket.onAny((eventName, ...args) => {
                console.log('🔵 RAW EVENT RECEIVED:', eventName, args);
            });
        }

        getSocket()?.on('meeting-expired', ({ message }) => {
            alert(message);
            navigate(-1);
        });

        const setupMeeting = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });

                localStreamRef.current = stream;

                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                joinMeeting(meetingId);
                console.log('Joined meeting:', meetingId);
            } catch (error) {
                console.error('Error accessing media devices:', error);
            }
        };

        // Setup meeting first
        setupMeeting();

        // Socket listener for user joined
        onUserJoined(async ({ socketId, userName }) => {
            console.log("User joined:", socketId, userName);
            try {
                setParticipants(prev => [...prev, { socketId, userName }]);

                const peerConnection = createPeerConnection(socketId);
                const offer = await peerConnection.createOffer();
                await peerConnection.setLocalDescription(offer);
                sendOffer({ meetingId, offer, targetId: socketId });
            } catch (err) {
                console.error("Offer creation failed:", err);
            }
        });

        // Socket listener for existing participants when joining
        onExistingParticipants(({ participants }) => {
            console.log("Existing participants:", participants);
            participants.forEach(participant => {
                setParticipants(prev => {
                    if (!prev.find(p => p.socketId === participant.socketId)) {
                        return [...prev, participant];
                    }
                    return prev;
                });
            });
        });

        // Socket listener for receiving offer
        onReceiveOffer(async ({ offer, fromId }) => {
            console.log("Offer received from:", fromId);
            try {
                const peerConnection = createPeerConnection(fromId);
                await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(answer);
                sendAnswer({ meetingId, answer, targetId: fromId });
            } catch (err) {
                console.error("Answer creation failed:", err);
            }
        });

        // Socket listener for receiving answer
        onReceiveAnswer(async ({ answer, fromId }) => {
            console.log("Answer received from:", fromId);
            try {
                if (peerConnectionsRef.current[fromId]) {
                    await peerConnectionsRef.current[fromId].setRemoteDescription(
                        new RTCSessionDescription(answer)
                    );
                }
            } catch (err) {
                console.error("Setting remote answer failed:", err);
            }
        });

        // Socket listener for ICE candidates
        onReceiveIceCandidate(async ({ candidate, fromId }) => {
            console.log("ICE candidate received from:", fromId);
            try {
                if (peerConnectionsRef.current[fromId]) {
                    await peerConnectionsRef.current[fromId].addIceCandidate(
                        new RTCIceCandidate(candidate)
                    );
                }
            } catch (err) {
                console.error("Adding ICE candidate failed:", err);
            }
        });

        // Socket listener for chat messages
        onReceiveMeetingMessage((data) => {
            setChatMessages(prev => [...prev, data]);
        });

        // Socket listener for raise hand
        onRaiseHand(({ socketId, userName, userId }) => {
            console.log("Hand raised by:", userName);
            setRaisedHands(prev => {
                if (!prev.find(h => h.userId === userId)) {
                    return [...prev, { socketId, userName, userId }];
                }
                return prev;
            });
        });

        // Socket listener for lower hand
        onLowerHand(({ userId }) => {
            console.log("Hand lowered by:", userId);
            setRaisedHands(prev => prev.filter(h => h.userId !== userId));
        });

        // Cleanup
        return () => {
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
            }
            Object.values(peerConnectionsRef.current).forEach(pc => pc.close());
            offReceiveMeetingMessage();
        };
    }, [meetingId, token, navigate]);

    // Calculate grid columns based on participants count
    const totalParticipants = Object.keys(remoteStreams).length + 1; // +1 for local
    const gridCols = Math.ceil(Math.sqrt(totalParticipants));

    return (
        <div className="w-full h-screen bg-gray-950 flex">
            {/* LEFT SIDE - Videos + Controls */}
            <div className="flex-1 flex flex-col items-center justify-between gap-4 p-6">
                <h1 className="text-white text-lg font-semibold">Meeting Room ({totalParticipants} participants)</h1>

                {/* Dynamic Grid - smaller height */}
                <div
                    className="gap-4 w-full flex-1 overflow-hidden"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
                        maxWidth: '1200px',
                    }}>
                    {/* Local Video */}
                    <div className="relative rounded-xl overflow-hidden">
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-64 bg-black object-cover"
                        />
                        {!isVideoOn && (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                                <span className="text-white text-sm">You (Camera off)</span>
                            </div>
                        )}
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                            {currentUser?.name} (You)  {/* ← Show name with (You) */}
                        </div>
                    </div>

                    {/* Remote Videos */}
                    {/* Remote Videos */}
                    {Object.entries(remoteStreams).map(([socketId, stream]) => {
                        const participant = participants.find(p => p.socketId === socketId);
                        const userName = participant?.userName || 'User';

                        return (
                            <div key={socketId} className="relative rounded-xl overflow-hidden">
                                <video
                                    autoPlay
                                    playsInline
                                    className="w-full h-64 bg-black object-cover"
                                    ref={(el) => {
                                        if (el && stream) el.srcObject = stream;
                                    }}
                                />
                                <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                                    {userName}  {/* ← Display actual name */}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Raised Hands Display */}
                {raisedHands.length > 0 && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Hand size={18} className="text-yellow-600" />
                            <p className="text-sm font-semibold text-yellow-800">
                                Hands Raised ({raisedHands.length})
                            </p>
                        </div>
                        <div className="space-y-1">
                            {raisedHands.map(hand => (
                                <div key={hand.userId} className="text-sm text-yellow-700 flex justify-between items-center">
                                    <span>{hand.userName}</span>
                                    <button
                                        onClick={() => {
                                            if (currentUser?.role === 'manager') {
                                                sendLowerHand({
                                                    meetingId,
                                                    userId: hand.userId,
                                                });
                                            }
                                        }}
                                        className="text-xs bg-yellow-200 hover:bg-yellow-300 px-2 py-1 rounded">
                                        Lower
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Control bar - always visible */}
                <div className="flex gap-4">
                    <button
                        onClick={toggleAudio}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition ${isAudioOn ? 'bg-slate-700 hover:bg-slate-600' : 'bg-red-600 hover:bg-red-700'}`}>
                        {isAudioOn ? <Mic size={24} className="text-white" /> : <MicOff size={24} className="text-white" />}
                    </button>

                    <button
                        onClick={toggleVideo}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition ${isVideoOn ? 'bg-slate-700 hover:bg-slate-600' : 'bg-red-600 hover:bg-red-700'}`}>
                        {isVideoOn ? <Video size={24} className="text-white" /> : <VideoOff size={24} className="text-white" />}
                    </button>

                    <button
                        onClick={toggleRaiseHand}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition ${isHandRaised
                            ? 'bg-yellow-500 hover:bg-yellow-600'
                            : 'bg-slate-700 hover:bg-slate-600'
                            }`}
                        title={isHandRaised ? 'Lower Hand' : 'Raise Hand'}>
                        <Hand size={24} className="text-white" />
                    </button>

                    <button
                        onClick={toggleChat}
                        className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-700 hover:bg-slate-600 transition">
                        <MessageCircle size={24} className="text-white" />
                    </button>

                    <button
                        onClick={endCall}
                        className="w-12 h-12 rounded-full flex items-center justify-center bg-red-600 hover:bg-red-700 transition">
                        <Phone size={24} className="text-white" />
                    </button>
                </div>
            </div>

            {/* RIGHT SIDE - Chat Panel */}
            {showChat && (
                <div className="w-80 bg-gray-900 border-l border-gray-700 flex flex-col">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                        <h2 className="text-white font-semibold">Chat</h2>
                        <button
                            onClick={() => setShowChat(false)}
                            className="text-gray-400 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {chatMessages.map((msg) => (
                            <div key={msg.id} className="text-sm">
                                <p className="text-gray-400 text-xs">{msg.userName}</p>
                                <p className="text-white break-words">{msg.message}</p>
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-gray-700">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (chatInput.trim()) {
                                    sendMeetingMessage({
                                        meetingId,
                                        message: chatInput,
                                        userName: currentUser?.name || 'Anonymous',
                                        userId: currentUser?.id,
                                    });
                                    setChatInput('');
                                }
                            }}
                            className="flex gap-2">
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 bg-gray-800 text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition">
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}