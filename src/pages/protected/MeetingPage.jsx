import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
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

export default function MeetingPage() {
    const { meetingId } = useParams();

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

    useEffect(() => {
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

            localStreamRef.current.getTracks().forEach(track => {
                peerConnection.addTrack(track, localStreamRef.current);
            });

            peerConnectionRef.current = peerConnection;

            return peerConnection;
        };

        onUserJoined(async () => {
            console.log("Another user joined");

            const peerConnection = createPeerConnection();

            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);

            sendOffer({
                meetingId,
                offer,
            });
        });

        onReceiveOffer(async ({ offer }) => {
            console.log("Offer received");

            const peerConnection = createPeerConnection();

            await peerConnection.setRemoteDescription(
                new RTCSessionDescription(offer)
            );

            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            sendAnswer({
                meetingId,
                answer,
            });
        });

        onReceiveAnswer(async ({ answer }) => {
            console.log("Answer received");

            await peerConnectionRef.current.setRemoteDescription(
                new RTCSessionDescription(answer)
            );
        });

        onReceiveIceCandidate(async ({ candidate }) => {
            console.log("ICE candidate received");

            if (peerConnectionRef.current) {
                await peerConnectionRef.current.addIceCandidate(
                    new RTCIceCandidate(candidate)
                );
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
        <div className="w-full h-screen bg-slate-900 flex flex-col items-
            center justify-center">
            <h1 className="text-white text-2xl font-bold mb-6">
                Meeting Room
            </h1>

            <div className="grid grid-cols-2 gap-4 w-[900px]">
                <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-[400px] bg-black rounded-xl object-cover"
                />

                <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-[400px] bg-black rounded-xl object-cover"
                />
            </div>
        </div>
    );
}