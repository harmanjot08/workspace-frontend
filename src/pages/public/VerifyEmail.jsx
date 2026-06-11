import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function VerifyEmail() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        verifyEmail();
    }, [token]);

    const verifyEmail = async () => {
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await fetch('http://localhost:5000/api/auth/verify-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message);
                setLoading(false);
                return;
            }

            setMessage('Email verified successfully! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError('Failed to verify email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 text-center">
                <h1 className="text-3xl font-bold text-slate-900 mb-4">Verify Email</h1>

                {loading && (
                    <p className="text-slate-600">Verifying your email...</p>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
                        {message}
                    </div>
                )}

                {!loading && !message && (
                    <button
                        onClick={verifyEmail}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                        disabled={loading}
                    >
                        Verify Email
                    </button>
                )}
            </div>
        </div>
    );
}