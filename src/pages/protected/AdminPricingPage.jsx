import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { adminAPI } from '../../api/adminApi.js';
import { Plus, Trash2, Pencil } from 'lucide-react';

export default function AdminPricingPage() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        billingCycle: 'monthly',
        features: '',
        maxUsers: '',
        maxStorage: '',
    });

    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const response = await adminAPI.getAllPricingPlans(token);
            if (response.plans) {
                setPlans(response.plans);
            }
        } catch (err) {
            console.error('fetchPlans error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePlan = async () => {
        if (!form.name || !form.price) return;

        const response = await adminAPI.createPricingPlan(token, {
            name: form.name,
            description: form.description,
            price: parseFloat(form.price),
            billingCycle: form.billingCycle,
            features: form.features ? form.features.split(',').map(f => f.trim()) : [],
            maxUsers: form.maxUsers ? parseInt(form.maxUsers) : null,
            maxStorage: form.maxStorage ? parseInt(form.maxStorage) : null,
        });

        if (response.plan) {
            setPlans(prev => [...prev, response.plan]);
            resetForm();
            setShowModal(false);
        }
    };

    const handleUpdatePlan = async () => {
        if (!editingPlan) return;

        const response = await adminAPI.updatePricingPlan(token, editingPlan.id, {
            name: form.name,
            description: form.description,
            price: parseFloat(form.price),
            features: form.features ? form.features.split(',').map(f => f.trim()) : [],
            maxUsers: form.maxUsers ? parseInt(form.maxUsers) : null,
            maxStorage: form.maxStorage ? parseInt(form.maxStorage) : null,
        });

        if (response.plan) {
            setPlans(prev => prev.map(p => p.id === editingPlan.id ? response.plan : p));
            resetForm();
            setShowModal(false);
        }
    };

    const handleDeletePlan = async (planId) => {
        if (!confirm('Delete this plan?')) return;
        await adminAPI.deletePricingPlan(token, planId);
        setPlans(prev => prev.filter(p => p.id !== planId));
    };

    const openEditModal = (plan) => {
        setEditingPlan(plan);
        setForm({
            name: plan.name,
            description: plan.description || '',
            price: plan.price.toString(),
            billingCycle: plan.billingCycle,
            features: plan.features?.join(', ') || '',
            maxUsers: plan.maxUsers?.toString() || '',
            maxStorage: plan.maxStorage?.toString() || '',
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setForm({
            name: '',
            description: '',
            price: '',
            billingCycle: 'monthly',
            features: '',
            maxUsers: '',
            maxStorage: '',
        });
        setEditingPlan(null);
    };

    if (loading) {
        return <AdminLayout><div className="p-8">Loading...</div></AdminLayout>;
    }

    return (
        <AdminLayout>
            <div>
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">Pricing Plans</h1>
                        <p className="text-slate-600">Manage subscription pricing</p>
                    </div>
                    <button
                        onClick={() => { resetForm(); setShowModal(true); }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
                        <Plus className="w-4 h-4" /> New Plan
                    </button>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {plans.map(plan => (
                        <div key={plan.id} className="bg-white border border-slate-200 rounded-xl p-6">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                            <p className="text-slate-600 text-sm mb-4">{plan.description}</p>

                            <div className="mb-4">
                                <p className="text-4xl font-bold text-slate-900">${plan.price}</p>
                                <p className="text-slate-600 text-sm">per {plan.billingCycle}</p>
                            </div>

                            {plan.features?.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-sm font-semibold text-slate-900 mb-2">Features:</p>
                                    <ul className="text-sm text-slate-600 space-y-1">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx}>✓ {feature}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {plan.maxUsers && <p className="text-sm text-slate-600 mb-1">Max Users: {plan.maxUsers}</p>}
                            {plan.maxStorage && <p className="text-sm text-slate-600 mb-4">Storage: {plan.maxStorage}GB</p>}

                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEditModal(plan)}
                                    className="flex-1 p-2 text-blue-600 hover:bg-blue-50 rounded-lg flex items-center justify-center gap-2">
                                    <Pencil className="w-4 h-4" /> Edit
                                </button>
                                <button
                                    onClick={() => handleDeletePlan(plan.id)}
                                    className="flex-1 p-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center justify-center gap-2">
                                    <Trash2 className="w-4 h-4" /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">
                            {editingPlan ? 'Edit Plan' : 'Create Plan'}
                        </h3>
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Plan name"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            <textarea
                                placeholder="Description"
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 h-20 resize-none"
                            />
                            <input
                                type="number"
                                placeholder="Price"
                                value={form.price}
                                onChange={e => setForm({ ...form, price: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            <select
                                value={form.billingCycle}
                                onChange={e => setForm({ ...form, billingCycle: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500">
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Features (comma separated)"
                                value={form.features}
                                onChange={e => setForm({ ...form, features: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            <input
                                type="number"
                                placeholder="Max Users (optional)"
                                value={form.maxUsers}
                                onChange={e => setForm({ ...form, maxUsers: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            <input
                                type="number"
                                placeholder="Max Storage GB (optional)"
                                value={form.maxStorage}
                                onChange={e => setForm({ ...form, maxStorage: e.target.value })}
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
                                onClick={editingPlan ? handleUpdatePlan : handleCreatePlan}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}