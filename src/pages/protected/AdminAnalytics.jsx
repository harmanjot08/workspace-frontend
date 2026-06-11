import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { adminAPI } from '../../api/adminApi.js';
import { Users, Building2, CreditCard, TrendingUp } from 'lucide-react';

export default function AdminAnalytics() {
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
        return <AdminLayout><div className="p-8">Loading...</div></AdminLayout>;
    }

    return (
        <AdminLayout>
            <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">Analytics</h1>
                <p className="text-slate-600 mb-8">Platform overview and metrics</p>

                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white border border-slate-200 rounded-xl p-6">
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

                    <div className="bg-white border border-slate-200 rounded-xl p-6">
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

                    <div className="bg-white border border-slate-200 rounded-xl p-6">
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

                    <div className="bg-white border border-slate-200 rounded-xl p-6">
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

                <div className="bg-white border border-slate-200 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Subscriptions by Plan</h2>
                    <div className="space-y-3">
                        {analytics?.subscriptionsByPlan?.length > 0 ? (
                            analytics.subscriptionsByPlan.map(item => (
                                <div key={item.planId} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                    <p className="text-slate-600">Plan ID: {item.planId}</p>
                                    <p className="font-bold text-slate-900">{item._count} subscriptions</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-500 text-center py-8">No subscription data</p>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}