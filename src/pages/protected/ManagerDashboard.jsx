import { useState, useEffect } from 'react';
import ManagerLayout from '../../components/ManagerLayout';
import { Users, UserCheck, UserX, ClipboardList } from 'lucide-react';
import ManagerSidebar from '../../components/ManagerSidebar';
import EmailPage from './EmailPage';

export default function ManagerDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        pendingTasks: 0,
    });
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('overview');

    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('https://workspace-backend-pyb2.onrender.com/api/users', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await response.json();

            if (data.users) {
                const total = data.users.length;
                const active = data.users.filter(u => u.isActive).length;
                const inactive = data.users.filter(u => !u.isActive).length;
                setStats(prev => ({
                    ...prev,
                    totalUsers: total,
                    activeUsers: active,
                    inactiveUsers: inactive,
                }));
            }
        } catch (err) {
            console.error('fetchStats error:', err);
        } finally {
            setLoading(false);
        }
    };

    const renderSection = () => {
        switch (activeSection) {
            case 'email':
                return <EmailPage />;
            case 'overview':
            default:
                return (
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">Manager Dashboard</h1>
                        <p className="text-slate-600 mb-8">Manage your team, tasks, roles, and company operations from one place.</p>

                        {loading ? (
                            <p className="text-slate-500">Loading...</p>
                        ) : (
                            <div className="grid md:grid-cols-4 gap-6 mb-8">
                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-blue-50 rounded-lg">
                                            <Users className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-slate-600 text-sm font-medium">Total Users</p>
                                            <p className="text-3xl font-bold text-slate-900">{stats.totalUsers}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-green-50 rounded-lg">
                                            <UserCheck className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-slate-600 text-sm font-medium">Active Users</p>
                                            <p className="text-3xl font-bold text-slate-900">{stats.activeUsers}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-red-50 rounded-lg">
                                            <UserX className="w-6 h-6 text-red-600" />
                                        </div>
                                        <div>
                                            <p className="text-slate-600 text-sm font-medium">Inactive Users</p>
                                            <p className="text-3xl font-bold text-slate-900">{stats.inactiveUsers}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-yellow-50 rounded-lg">
                                            <ClipboardList className="w-6 h-6 text-yellow-600" />
                                        </div>
                                        <div>
                                            <p className="text-slate-600 text-sm font-medium">Pending Tasks</p>
                                            <p className="text-3xl font-bold text-slate-900">{stats.pendingTasks}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
        }
    };

    return (
        <div className="flex h-screen bg-slate-100">
            <ManagerSidebar activeSection={activeSection} onSelectSection={setActiveSection} />
            <main className="flex-1 overflow-auto ml-64 p-8">
                {renderSection()}
            </main>
        </div>
    );
}