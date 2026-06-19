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
        let peerConnection;

        const setupMeeting = async () => {
            try {
                // 1. Get user media
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });

                localStreamRef.current = stream;

                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                // 2. Create peer connection
                peerConnection = new RTCPeerConnection(servers);
                peerConnectionRef.current = peerConnection;

                // 3. Add tracks to peer connection
                stream.getTracks().forEach((track) => {
                    peerConnection.addTrack(track, stream);
                });

                // 4. Remote stream handler
                peerConnection.ontrack = (event) => {
                    console.log("REMOTE STREAM RECEIVED");
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = event.streams[0];
                    }
                };

                // 5. ICE candidate handler
                peerConnection.onicecandidate = (event) => {
                    if (event.candidate) {
                        sendIceCandidate({
                            meetingId,
                            candidate: event.candidate,
                        });
                    }
                };

                // 6. Join meeting room
                joinMeeting(meetingId);

                // =========================
                // SOCKET EVENTS (ALL INSIDE)
                // =========================

                onUserJoined(async () => {
                    console.log("USER JOINED EVENT FIRED");

                    const pc = peerConnectionRef.current;
                    if (!pc) return;

                    const offer = await pc.createOffer();
                    await pc.setLocalDescription(offer);

                    console.log("SENDING OFFER");

                    sendOffer({
                        meetingId,
                        offer,
                    });
                });

                onReceiveOffer(async ({ offer }) => {
                    console.log("OFFER RECEIVED");

                    const pc = peerConnectionRef.current;
                    if (!pc) return;

                    await pc.setRemoteDescription(
                        new RTCSessionDescription(offer)
                    );

                    const answer = await pc.createAnswer();
                    await pc.setLocalDescription(answer);

                    console.log("SENDING ANSWER");

                    sendAnswer({
                        meetingId,
                        answer,
                    });
                });

                onReceiveAnswer(async ({ answer }) => {
                    console.log("ANSWER RECEIVED");

                    const pc = peerConnectionRef.current;
                    if (!pc) return;

                    await pc.setRemoteDescription(
                        new RTCSessionDescription(answer)
                    );
                });

                onReceiveIceCandidate(async ({ candidate }) => {
                    console.log("ICE RECEIVED");

                    const pc = peerConnectionRef.current;
                    if (!pc) return;

                    if (candidate) {
                        await pc.addIceCandidate(
                            new RTCIceCandidate(candidate)
                        );
                    }
                });

            } catch (error) {
                console.error("Error in setupMeeting:", error);
            }
        };

        setupMeeting();

        // =========================
        // CLEANUP
        // =========================
        return () => {
            if (localStreamRef.current) {
                localStreamRef.current
                    .getTracks()
                    .forEach((track) => track.stop());
            }

            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
            }
        };
    }, [meetingId]);

    return () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
        }

        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
        }
    };

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