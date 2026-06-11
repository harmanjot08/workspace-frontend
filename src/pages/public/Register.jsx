import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store';
import {
    validateEmail,
    validatePassword,
    validateName,
    validateCompanyName
} from '../../utils/validation';
export default function Register() {
    const [companyName, setCompanyName] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('user'); // Add this
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        if (!companyName || !name || !email || !password || !confirmPassword) {
            setError('All fields required');
            return;
        }
        const companyNameVal = validateCompanyName(companyName);
        if (!companyNameVal.valid) {
            setError(companyNameVal.message);
            return;
        }
        const nameVal = validateName(name);
        if (!nameVal.valid) {
            setError(nameVal.message);
            return;
        }
        if (!validateEmail(email)) {
            setError('Please enter valid email');
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
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    companyName,
                    name,
                    email,
                    password,
                    confirmPassword,
                    role,   
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message);
                setLoading(false);
                return;
            }
            alert('Registration successful! Check console for verification token.');
            navigate('/login');
        } catch (error) {
            setError('Registration failed');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl w-96 border border-slate-200 shadow-lg">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Register</h2>
                    <p className="text-slate-600 text-sm">Create your account</p>
                </div>
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">
                            Company Name
                        </label>
                        <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="w-full px-4 py-2 bg-slate-100 text-slate-900 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none"
                            disabled={loading}
                            required />
                    </div>
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">
                            Your Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 bg-slate-100 text-slate-900 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none"
                            disabled={loading}
                            required />
                    </div>
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 bg-slate-100 text-slate-900 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none"
                            disabled={loading}
                            required />
                    </div>
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 bg-slate-100 text-slate-900 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none"
                            disabled={loading}
                            required />
                    </div>
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 bg-slate-100 text-slate-900 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none"
                            disabled={loading}
                            required />
                    </div>
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">
                            Register As
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-2 bg-slate-100 text-slate-900 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none"
                            disabled={loading}>
                            <option value="user">User</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
                        disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <p className="text-slate-600 text-sm text-center mt-6">
                    Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
}