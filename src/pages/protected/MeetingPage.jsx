import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

export default function MeetingPage() {
    const { meetingId } = useParams();

    useEffect(() => {
        // Load Jitsi Meet API
        const script = document.createElement('script');
        script.src = 'https://meet.jitsi.org/external_api.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            const options = {
                roomName: meetingId,
                parentNode: document.querySelector('#jitsi-container'),
                configOverrides: {
                    startWithAudioMuted: false,
                    startWithVideoMuted: false,
                },
                interfaceConfigOverrides: {
                    DEFAULT_LANGUAGE: 'en',
                    DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                },
                userInfo: {
                    email: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).email : '',
                    displayName: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).name : 'Guest',
                },
            };

            new window.JitsiMeetExternalAPI('meet.jitsi.org', options);
        };

        return () => {
            document.body.removeChild(script);
        };
    }, [meetingId]);

    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <div id="jitsi-container" style={{ width: '100%', height: '100%' }} />
        </div>
    );
}