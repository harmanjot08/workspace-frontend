import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    joinMeeting,
    onUserJoined,
    sendOffer,
    sendAnswer,
    sendIceCandidate,
    onReceiveOffer,
    onReceiveAnswer,
    onReceiveIceCandidate,
    sendMeetingMessage,
    onReceiveMeetingMessage,
    offReceiveMeetingMessage,
} from '../../services/socketService';
import { getSocket } from '../../services/socketService';
import { Mic, MicOff, Video, VideoOff, Phone, Send, X } from 'lucide-react';

export default function MeetingPage() {
    const { meetingId } = useParams();

    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isAudioOn, setIsAudioOn] = useState(true);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [showChat, setShowChat] = useState(true);

    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('user'));

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    const localStreamRef = useRef(null);
    const peerConnectionRef = useRef(null);

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
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
        }
        offReceiveMeetingMessage();
        navigate(-1);
    };

    useEffect(() => {
        const socket = getSocket();
        if (socket) {
            socket.onAny((eventName, ...args) => {
                console.log('🔵 RAW EVENT RECEIVED:', eventName, args);
            });
        }

        const setupMeeting = async () => {
            try {
                // Get camera + mic 
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });

                localStreamRef.current = stream;

                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                // Join meeting room 
                joinMeeting(meetingId);

                console.log('Joined meeting:', meetingId);
            } catch (error) {
                console.error('Error accessing media devices:', error);
            }
        };

        setupMeeting();

        const createPeerConnection = () => {
            const peerConnection = new RTCPeerConnection(servers);

            peerConnection.ontrack = (event) => {
                console.log("Remote stream received");

                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = event.streams[0];
                }
            };

            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    sendIceCandidate({
                        meetingId,
                        candidate: event.candidate,
                    });
                }
            };

            peerConnection.onconnectionstatechange = () => {
                console.log("Connection state:", peerConnection.connectionState);
            };

            peerConnection.oniceconnectionstatechange = () => {
                console.log("ICE connection state:", peerConnection.iceConnectionState);
            };

            localStreamRef.current.getTracks().forEach(track => {
                peerConnection.addTrack(track, localStreamRef.current);
            });

            peerConnectionRef.current = peerConnection;

            return peerConnection;
        };

        onUserJoined(async () => {
            console.log("Another user joined");
            try {
                const peerConnection = createPeerConnection();
                const offer = await peerConnection.createOffer();
                await peerConnection.setLocalDescription(offer);
                sendOffer({ meetingId, offer });
            } catch (err) {
                console.error("Offer creation failed:", err);
            }
        });

        onReceiveOffer(async ({ offer }) => {
            console.log("Offer received");
            try {
                const peerConnection = createPeerConnection();
                await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(answer);
                sendAnswer({ meetingId, answer });
            } catch (err) {
                console.error("Answer creation failed:", err);
            }
        });

        onReceiveAnswer(async ({ answer }) => {
            console.log("Answer received");
            try {
                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
            } catch (err) {
                console.error("Setting remote answer failed:", err);
            }
        });

        onReceiveIceCandidate(async ({ candidate }) => {
            console.log("ICE candidate received");
            try {
                if (peerConnectionRef.current) {
                    await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                }
            } catch (err) {
                console.error("Adding ICE candidate failed:", err);
            }
        });

        onReceiveMeetingMessage((data) => {
            setChatMessages(prev => [...prev, data]);
        });

        return () => {
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
            }
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
            }
            offReceiveMeetingMessage();
        };
    }, [meetingId]);

    return (
        <div className="w-full h-screen bg-gray-950 flex">
            {/* LEFT SIDE - Videos + Controls */}
            <div className="flex-1 flex flex-col items-center justify-center gap-8">
                <h1 className="text-white text-lg font-semibold">Meeting Room</h1>

                <div className="grid grid-cols-2 gap-6 w-[900px] h-[500px]">
                    {/* Local Video */}
                    <div className="relative">
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-[400px] bg-black rounded-xl object-cover"
                        />
                        {!isVideoOn && (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-800 rounded-xl">
                                <span className="text-white text-sm">Camera off</span>
                            </div>
                        )}
                    </div>

                    {/* Remote Video */}
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="w-full h-[400px] bg-black rounded-xl object-cover"
                    />
                </div>

                {/* Control bar */}
                <div className="flex gap-4">
                    <button
                        onClick={toggleAudio}
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${isAudioOn ? 'bg-slate-700 hover:bg-slate-600' : 'bg-red-600 hover:bg-red-700'}`}>
                        {isAudioOn ? <Mic size={24} className="text-white" /> : <MicOff size={24} className="text-white" />}
                    </button>

                    <button
                        onClick={toggleVideo}
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${isVideoOn ? 'bg-slate-700 hover:bg-slate-600' : 'bg-red-600 hover:bg-red-700'}`}>
                        {isVideoOn ? <Video size={24} className="text-white" /> : <VideoOff size={24} className="text-white" />}
                    </button>

                    <button
                        onClick={endCall}
                        className="w-12 h-12 rounded-full flex items-center justify-center bg-red-600 hover:bg-red-700">
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
                                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded">
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );

}