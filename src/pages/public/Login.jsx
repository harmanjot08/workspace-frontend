import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { ChevronDown } from 'lucide-react';
import { validateEmail, validatePassword } from '../../utils/validation';
import { useEffect } from 'react';
export default function Login() {
    const [email, setEmail] = useState(''); // stores user email
    const [password, setPassword] = useState(''); // stores user password
    const navigate = useNavigate();
    const { login, loading, error, clearError } = useAuthStore(); // fetching data from zustand store
    const { setUser } = useAuthStore();
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get('accessToken');
        const user = params.get('user');
        if (accessToken && user) {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('user', user);
            const userData = JSON.parse(user);
            setUser(userData);
            if (userData.role === 'admin') {
                navigate('/admin');
            } else if (userData.role === 'manager') {
                navigate('/manager');
            } else {
                navigate('/user');
            }
        }
    }, [navigate, setUser]);
    const handleLogin = async (e) => {
        e.preventDefault();
        clearError();
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }
        if (!validateEmail(email)) {
            alert('Please enter valid email');
            return;
        }
        try {
            const res = await fetch('https://workspace-backend-pyb2.onrender.com/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data.message);
                return;
            }
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            if (data.user.role === 'admin') {
                navigate('/admin');
            } else if (data.user.role === 'manager') {
                navigate('/manager');
            } else {
                navigate('/user');
            }
        } catch (error) {
            alert('Login failed');
        }
    };
    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl w-96 border border-slate-200 shadow-lg">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Login to Workspace</h2>
                    <p className="text-slate-600 text-sm">Welcome back!</p>
                </div>
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 bg-slate-100 text-slate-900 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none transition"
                            disabled={loading}
                            required />
                    </div>
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 bg-slate-100 text-slate-900 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none transition"
                            disabled={loading}
                            required />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}>
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="animate-spin">⏳</span>
                                Logging in...
                            </span>
                        ) : (
                            'Login'
                        )}
                    </button>
                </form>
                <div className="mt-6 space-y-4">
                    <div className="text-center">
                        <p className="text-slate-600 text-sm mb-4">Or continue with</p>
                        <a
                            href="https://workspace-backend-pyb2.onrender.com/api/auth/google"
                            className="w-full px-4 py-2 bg-white border border-slate-300 text-slate-900 font-semibold rounded-lg hover:bg-slate-50 transition flex items-center justify-center gap-2">
                            <img
                                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%234285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/%3E%3Cpath fill='%3434A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/%3E%3Cpath fill='%23FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'/%3E%3Cpath fill='%23EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'/%3E%3C/svg%3E"
                                alt="Google"
                                className="w-5 h-5" />
                            Login with Google
                        </a>
                    </div>
                    <div className="text-center">
                        <p className="text-slate-600 text-sm">
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                className="text-blue-600 hover:text-blue-700 font-semibold transition">
                                Register here
                            </Link>
                        </p>
                        <p className="text-slate-600 text-sm">
                            Forgot password?{' '}
                            <Link
                                to="/forgot-password"
                                className="text-blue-600 hover:text-blue-700 font-semibold transition">
                                Reset here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}