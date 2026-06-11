import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { adminAPI } from '../../api/adminApi.js';
import { Plus, Trash2 } from 'lucide-react';

export default function AdminSubscriptionsPage() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        companyId: '',
        planId: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
    });

    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [subsRes, compRes, planRes] = await Promise.all([
                adminAPI.getAllSubscriptions(token),
                adminAPI.getAllCompanies(token),
                adminAPI.getAllPricingPlans(token),
            ]);

            if (subsRes.subscriptions) setSubscriptions(subsRes.subscriptions);
            if (compRes.companies) setCompanies(compRes.companies);
            if (planRes.plans) setPlans(planRes.plans);
        } catch (err) {
            console.error('fetchData error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSubscription = async () => {
        if (!form.companyId || !form.planId) return;

        const response = await adminAPI.createSubscription(token, {
            companyId: form.companyId,
            planId: form.planId,
            startDate: form.startDate,
            endDate: form.endDate || null,
        });

        if (response.subscription) {
            setSubscriptions(prev => [...prev, response.subscription]);
            resetForm();
            setShowModal(false);
        }
    };

    const handleCancelSubscription = async (subscriptionId) => {
        if (!confirm('Cancel this subscription?')) return;

        const response = await adminAPI.cancelSubscription(token, subscriptionId);
        if (response.subscription) {
            setSubscriptions(prev =>
                prev.map(s => s.id === subscriptionId ? response.subscription : s)
            );
        }
    };

    const resetForm = () => {
        setForm({
            companyId: '',
            planId: '',
            startDate: new Date().toISOString().split('T')[0],
            endDate: '',
        });
    };

    const statusColor = (status) => {
        if (status === 'active') return 'bg-green-100 text-green-700';
        if (status === 'cancelled') return 'bg-red-100 text-red-700';
        return 'bg-yellow-100 text-yellow-700';
    };

    if (loading) {
        return <AdminLayout><div className="p-8">Loading...</div></AdminLayout>;
    }

    return (
        <AdminLayout>
            <div>
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">Subscriptions</h1>
                        <p className="text-slate-600">Manage company subscriptions</p>
                    </div>
                    <button
                        onClick={() => { resetForm(); setShowModal(true); }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
                        <Plus className="w-4 h-4" /> New Subscription
                    </button>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Company</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Plan</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Price</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Start Date</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Renewal</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {subscriptions.map(sub => (
                                <tr key={sub.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900">{sub.company?.name}</td>
                                    <td className="px-6 py-4 text-slate-600">{sub.plan?.name}</td>
                                    <td className="px-6 py-4 text-slate-600">${sub.plan?.price}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor(sub.status)}`}>
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {new Date(sub.startDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {sub.renewalDate ? new Date(sub.renewalDate).toLocaleDateString() : '—'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {sub.status === 'active' && (
                                            <button
                                                onClick={() => handleCancelSubscription(sub.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 text-sm text-slate-600">
                    Total subscriptions: {subscriptions.length}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Create Subscription</h3>
                        <div className="space-y-3">
                            <select
                                value={form.companyId}
                                onChange={e => setForm({ ...form, companyId: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500">
                                <option value="">Select Company</option>
                                {companies.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>

                            <select
                                value={form.planId}
                                onChange={e => setForm({ ...form, planId: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500">
                                <option value="">Select Plan</option>
                                {plans.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} - ${p.price}</option>
                                ))}
                            </select>

                            <input
                                type="date"
                                value={form.startDate}
                                onChange={e => setForm({ ...form, startDate: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                            />

                            <input
                                type="date"
                                placeholder="End date (optional)"
                                value={form.endDate}
                                onChange={e => setForm({ ...form, endDate: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="flex gap-3 justify-end mt-4">
                            <button
                                onClick={() => { resetForm(); setShowModal(false); }}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateSubscription}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}