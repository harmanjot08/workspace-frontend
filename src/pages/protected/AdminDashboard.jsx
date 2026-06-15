import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { adminAPI } from '../../api/adminApi.js';
import { Building2, Users, CreditCard, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await adminAPI.getAnalytics(token);
            if (response.analytics) {
                setAnalytics(response.analytics);
            }
        } catch (err) {
            console.error('fetchAnalytics error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
                <p className="text-slate-600 mb-8">Welcome to Workspace Admin Panel</p>

                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <Building2 className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-slate-600 text-sm font-medium">Total Companies</p>
                                <p className="text-3xl font-bold text-slate-900">{analytics?.totalCompanies || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-50 rounded-lg">
                                <Users className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-slate-600 text-sm font-medium">Total Users</p>
                                <p className="text-3xl font-bold text-slate-900">{analytics?.totalUsers || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-50 rounded-lg">
                                <CreditCard className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-slate-600 text-sm font-medium">Active Subscriptions</p>
                                <p className="text-3xl font-bold text-slate-900">{analytics?.activeSubscriptions || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-50 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-slate-600 text-sm font-medium">Total Revenue</p>
                                <p className="text-3xl font-bold text-slate-900">${(analytics?.totalRevenue || 0).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}