import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { adminAPI } from '../../api/adminApi.js';
import { Trash2, Pencil, Eye, Plus } from 'lucide-react';

export default function AdminCompanies() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);
    const [form, setForm] = useState({
        name: '',
        email: '',
        plan: 'FREE',
    });
    const [isAddingCompany, setIsAddingCompany] = useState(false);
    const [newCompanyForm, setNewCompanyForm] = useState({
        name: '',
        email: '',
        plan: 'FREE',
    });
    const [addError, setAddError] = useState('');

    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getAllCompanies(token);
            if (response.companies) {
                setCompanies(response.companies);
            }
        } catch (err) {
            console.error('fetchCompanies error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateCompany = async () => {
        if (!editingCompany || !form.name) return;

        const response = await adminAPI.updateCompany(token, editingCompany.id, {
            name: form.name,
            email: form.email,
            plan: form.plan,
        });

        if (response.company) {
            setCompanies(prev =>
                prev.map(c => c.id === editingCompany.id ? response.company : c)
            );
            resetForm();
            setShowModal(false);
        }
    };

    const openEditModal = (company) => {
        setEditingCompany(company);
        setForm({
            name: company.name,
            email: company.email,
            plan: company.plan,
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setForm({ name: '', email: '', plan: 'FREE' });
        setEditingCompany(null);
    };

    const handleAddCompany = async () => {
        if (!newCompanyForm.name || !newCompanyForm.email) {
            setAddError('Name and email are required');
            return;
        }

        try {
            setAddError('');
            const response = await adminAPI.createCompany(token, newCompanyForm);

            if (response.company) {
                setCompanies(prev => [response.company, ...prev]);
                setNewCompanyForm({ name: '', email: '', plan: 'FREE' });
                setIsAddingCompany(false);
            } else {
                setAddError(response.message || 'Failed to create company');
            }
        } catch (err) {
            setAddError('Error creating company');
            console.error(err);
        }
    };

    const planColor = (plan) => {
        if (plan === 'PREMIUM') return 'bg-purple-100 text-purple-700';
        if (plan === 'PRO') return 'bg-blue-100 text-blue-700';
        return 'bg-slate-100 text-slate-700';
    };

    if (loading) {
        return <AdminLayout><div className="p-8">Loading...</div></AdminLayout>;
    }
    console.log('isAddingCompany state:', isAddingCompany);
    return (
        <AdminLayout>
            <div>
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">Companies</h1>
                        <p className="text-slate-600">Manage all companies on the platform</p>
                    </div>
                    <button
                        onClick={() => {
                            console.log('Before:', isAddingCompany);
                            setIsAddingCompany(true);
                            console.log('After: true');
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                        <Plus className="w-5 h-5" />
                        Add Company
                    </button>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Company Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Email</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Plan</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Users</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Subscription</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {companies.map(company => (
                                <tr key={company.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900">{company.name}</td>
                                    <td className="px-6 py-4 text-slate-600">{company.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${planColor(company.plan)}`}>
                                            {company.plan}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {company.users?.length || 0}
                                    </td>
                                    <td className="px-6 py-4">
                                        {company.subscriptions?.length > 0 ? (
                                            <span className="text-sm text-green-600 font-semibold">Active</span>
                                        ) : (
                                            <span className="text-sm text-slate-400">No subscription</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEditModal(company)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            {/* Add Company Modal */}
                                            {isAddingCompany && (
                                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                                                        <h3 className="text-lg font-bold text-slate-900 mb-4">Add New Company</h3>
                                                        {addError && (
                                                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                                                                {addError}
                                                            </div>
                                                        )}
                                                        <div className="space-y-3">
                                                            <input
                                                                type="text"
                                                                placeholder="Company name"
                                                                value={newCompanyForm.name}
                                                                onChange={e => setNewCompanyForm({ ...newCompanyForm, name: e.target.value })}
                                                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                                                            />
                                                            <input
                                                                type="email"
                                                                placeholder="Email"
                                                                value={newCompanyForm.email}
                                                                onChange={e => setNewCompanyForm({ ...newCompanyForm, email: e.target.value })}
                                                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                                                            />
                                                            <select
                                                                value={newCompanyForm.plan}
                                                                onChange={e => setNewCompanyForm({ ...newCompanyForm, plan: e.target.value })}
                                                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500">
                                                                <option value="FREE">FREE</option>
                                                                <option value="PRO">PRO</option>
                                                                <option value="PREMIUM">PREMIUM</option>
                                                            </select>
                                                        </div>
                                                        <div className="flex gap-3 justify-end mt-4">
                                                            <button
                                                                onClick={() => {
                                                                    setIsAddingCompany(false);
                                                                    setNewCompanyForm({ name: '', email: '', plan: 'FREE' });
                                                                    setAddError('');
                                                                }}
                                                                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                                                                Cancel
                                                            </button>
                                                            <button
                                                                onClick={handleAddCompany}
                                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                                                Add Company
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <button
                                                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 text-sm text-slate-600">
                    Total companies: {companies.length}
                </div>
            </div>

            {/* Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Edit Company</h3>
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Company name"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            <select
                                value={form.plan}
                                onChange={e => setForm({ ...form, plan: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500">
                                <option value="FREE">FREE</option>
                                <option value="PRO">PRO</option>
                                <option value="PREMIUM">PREMIUM</option>
                            </select>
                        </div>
                        <div className="flex gap-3 justify-end mt-4">
                            <button
                                onClick={() => { resetForm(); setShowModal(false); }}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateCompany}
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