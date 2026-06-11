import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/validation';
export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        if (!email) {
            setError('Email required');
            setLoading(false);
            return;
        }
        if (!validateEmail(email)) {
            setError('Please enter valid email');
            setLoading(false);
            return;
        }
        try {
            const res = await fetch('https://workspace-backend-pyb2.onrender.com/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message);
                return;
            }
            setMessage('Password reset link sent to your email!');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError('Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Forgot Password?</h1>
                <p className="text-slate-600 mb-6">Enter your email to reset your password</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded">{error}</p>}
                    {message && <p className="text-green-600 text-sm bg-green-50 p-3 rounded">{message}</p>}
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none"
                            required
                            disabled={loading} />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                        disabled={loading}>
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>
                <p className="text-slate-600 text-sm text-center mt-6">
                    Remember your password? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
}