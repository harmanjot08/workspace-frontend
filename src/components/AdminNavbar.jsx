import { Link } from 'react-router-dom';
import { useAuthStore } from '../store';
import { Zap, LogOut } from 'lucide-react';
export default function AdminNavbar() {
    const { user, logout } = useAuthStore();
    const handleLogout = () => {
        logout();
    };
    return (
        <nav className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-40 py-4 px-8">
            <div className="flex items-center justify-between">

                <Link to="/admin" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-slate-900">Workspace Admin</span>
                </Link>

                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900">{user?.name || 'Admin'}</p>
                        <p className="text-xs text-slate-500">Admin</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 text-sm font-medium flex items-center gap-2">
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}