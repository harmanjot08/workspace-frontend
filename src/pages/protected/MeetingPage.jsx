import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
    joinMeeting,
    onUserJoined,
} from '../../services/socketService';

export default function MeetingPage() {
    const { meetingId } = useParams();

    const localVideoRef = useRef(null);
    const localStreamRef = useRef(null);

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

        onUserJoined((userId) => {
            console.log('Another user joined:', userId);
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

            <div className="w-[700px] h-[450px] bg-black rounded-xl overflow-hidden shadow-lg">
                <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
}