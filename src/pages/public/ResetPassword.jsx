import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { validatePassword } from '../../utils/validation';
export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        if (!password || !confirmPassword) {
            setError('All fields required');
            return;
        }
        const passwordVal = validatePassword(password);
        if (!passwordVal.valid) {
            setError(passwordVal.message);
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    newPassword: password,
                    confirmPassword,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message);
                return;
            }
            setMessage('Password reset successfully! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError('Failed to reset password');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Reset Password</h1>
                <p className="text-slate-600 mb-6">Enter your new password</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded">{error}</p>}
                    {message && <p className="text-green-600 text-sm bg-green-50 p-3 rounded">{message}</p>}
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none"
                            required
                            disabled={loading} />
                    </div>
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none"
                            required
                            disabled={loading} />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                        disabled={loading}>
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}