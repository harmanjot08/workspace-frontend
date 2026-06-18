import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

export default function MeetingPage() {
    const { meetingId } = useParams();

    useEffect(() => {
        let api = null;

        const script = document.createElement('script');
        script.src = 'https://meet.jitsi.org/external_api.js';
        script.async = true;

        script.onload = () => {
            if (!window.JitsiMeetExternalAPI) {
                console.error('Jitsi failed to load');
                return;
            }

            const container = document.getElementById('jitsi-container');

            if (!container) {
                console.error('Jitsi container not found');
                return;
            }

            const user = JSON.parse(localStorage.getItem('user') || '{}');

            const options = {
                roomName: meetingId,
                parentNode: container,
                width: '100%',
                height: '100%',
                userInfo: {
                    email: user?.email || '',
                    displayName: user?.name || 'Guest',
                },
                configOverwrite: {
                    startWithAudioMuted: false,
                    startWithVideoMuted: false,
                },
            };

            api = new window.JitsiMeetExternalAPI('meet.jitsi.org', options);
        };

        script.onerror = () => {
            console.error('Failed to load Jitsi script');
        };

        document.body.appendChild(script);

        return () => {
            if (api) api.dispose();
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, [meetingId]);

    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <div id="jitsi-container" style={{ width: '100%', height: '100%' }} />
        </div>
    );
}