import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

export default function MeetingPage() {
    const { meetingId } = useParams();

    useEffect(() => {
        console.log("Meeting page mounted");
        console.log("Meeting ID:", meetingId);

        let api = null;

        const script = document.createElement('script');
        script.src = 'https://meet.jitsi.org/external_api.js';
        script.async = true;

        console.log("Appending script...");

        script.onload = () => {
            console.log("Script loaded");
            console.log("Jitsi object:", window.JitsiMeetExternalAPI);

            const container = document.getElementById('jitsi-container');
            console.log("Container:", container);

            if (!window.JitsiMeetExternalAPI) {
                console.error("Jitsi API missing");
                return;
            }

            api = new window.JitsiMeetExternalAPI('meet.jitsi.org', {
                roomName: meetingId,
                parentNode: container,
                width: '100%',
                height: '100%',
            });

            console.log("Jitsi initialized");
        };

        script.onerror = () => {
            console.error("Script failed to load");
        };

        document.body.appendChild(script);

        return () => {
            if (api) api.dispose();
        };
    }, [meetingId]);

    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <div id="jitsi-container" style={{ width: '100%', height: '100%' }} />
        </div>
    );
}