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
} from '../../services/socketService';
import { getSocket } from '../../services/socketService';
import { Mic, MicOff, Video, VideoOff, Phone } from 'lucide-react';

export default function MeetingPage() {
    const { meetingId } = useParams();

    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isAudioOn, setIsAudioOn] = useState(true);

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

        return () => {
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track =>
                    track.stop());
            }
        };
    }, [meetingId]);

    return (
        <div className="w-full h-screen bg-gray-950 flex flex-col items-center justify-center gap-8">
            <h1 className="text-white text-lg font-semibold mb-2">Meeting Room</h1>

            <div className="grid grid-cols-2 gap-6 w-[900px] h-[500px]">

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

                <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-[400px] bg-black rounded-xl object-cover"
                />
            </div>

            {/* Control bar */}
            <div className="flex gap-4 mt-8">
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
    );
}