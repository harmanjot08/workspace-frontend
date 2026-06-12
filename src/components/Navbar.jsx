import { Link } from 'react-router-dom';
import { useAuthStore } from '../store';
import { Zap } from 'lucide-react';
export default function Navbar() {
    const { isAuthenticated } = useAuthStore();
    return (
        <nav className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-50 py-4 px-8">
            <div className="flex items-center justify-between">

                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-slate-900">Workspace</span>
                </Link>

                <div className="flex gap-8">
                    <a href="#features" className="text-slate-600 text-sm font-medium hover:text-slate-900">
                        Features
                    </a>
                    <a href="#how-it-works" className="text-slate-600 text-sm font-medium hover:text-slate-900">
                        How it works
                    </a>
                    <a href="#pricing" className="text-slate-600 text-sm font-medium hover:text-slate-900">
                        Pricing
                    </a>
                    <a href="/contact" className="text-slate-600 text-sm font-medium hover:text-slate-900">
                        Contact
                    </a>
                </div>

                <div className="flex gap-3">
                    {isAuthenticated ? (
                        <Link
                            to="/dashboard"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="px-6 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 text-sm font-medium">
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                                Sign up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}