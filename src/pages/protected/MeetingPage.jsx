import { useParams } from 'react-router-dom';

export default function MeetingPage() {
    const { meetingId } = useParams();

    return (
        <div style={{
            height: '100vh',
            background: 'white',
            color: 'black',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '30px'
        }}>
            Meeting ID: {meetingId}
        </div>
    );
}