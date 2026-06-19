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
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });

            localStreamRef.current = stream;
            localVideoRef.current.srcObject = stream;

            const peerConnection = new RTCPeerConnection(servers);
            peerConnectionRef.current = peerConnection;

            stream.getTracks().forEach(track => {
                peerConnection.addTrack(track, stream);
            });

            peerConnection.ontrack = (event) => {
                remoteVideoRef.current.srcObject = event.streams[0];
            };

            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    sendIceCandidate({
                        meetingId,
                        candidate: event.candidate,
                    });
                }
            };

            joinMeeting(meetingId);
        };

        setupMeeting();

        onUserJoined(async () => {
            const offer = await peerConnectionRef.current.createOffer();
            await peerConnectionRef.current.setLocalDescription(offer);

            sendOffer({
                meetingId,
                offer,
            });
        });

        onReceiveOffer(async ({ offer }) => {
            await peerConnectionRef.current.setRemoteDescription(
                new RTCSessionDescription(offer)
            );

            const answer = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(answer);

            sendAnswer({
                meetingId,
                answer,
            });
        });

        onReceiveAnswer(async ({ answer }) => {
            await peerConnectionRef.current.setRemoteDescription(
                new RTCSessionDescription(answer)
            );
        });

        onReceiveIceCandidate(async ({ candidate }) => {
            if (candidate) {
                await peerConnectionRef.current.addIceCandidate(
                    new RTCIceCandidate(candidate)
                );
            }
        });

        return () => {
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [meetingId]);

    return (
        <div className="w-full h-screen bg-slate-900 flex flex-col items-center justify-center">
            <h1 className="text-white text-2xl font-bold mb-6">
                Meeting Room
            </h1>

            <div className="flex gap-4">
                <div className="w-[500px] h-[350px] bg-black rounded-xl overflow-hidden">
                    <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="w-[500px] h-[350px] bg-black rounded-xl overflow-hidden">
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
}