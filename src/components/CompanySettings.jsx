import { useState } from 'react';
import { Building2 } from 'lucide-react';
export default function CompanySettings({ data, onSave }) {
    const [formData, setFormData] = useState(data);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const validate = () => {
        const err = {};
        if (!formData.name.trim()) err.name = 'Company name is required';
        if (!formData.email.trim()) err.email = 'Company email is required';
        if (!formData.industry.trim()) err.industry = 'Industry is required';
        setErrors(err);
        return Object.keys(err).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        await new Promise(r => setTimeout(r, 300));
        onSave(formData);
        setLoading(false);
    };
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-6">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">Company Settings</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-2">Company Name</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full px-4 py-2 bg-slate-100 rounded-lg border ${errors.name ? 'border-red-500' : 'border-slate-300'}`} />
                    {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-2">Company Email</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full px-4 py-2 bg-slate-100 rounded-lg border ${errors.email ? 'border-red-500' : 'border-slate-300'}`} />
                    {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-2">Industry</label>
                    <input
                        type="text"
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        className={`w-full px-4 py-2 bg-slate-100 rounded-lg border ${errors.industry ? 'border-red-500' : 'border-slate-300'}`} />
                    {errors.industry && <p className="text-red-600 text-xs mt-1">{errors.industry}</p>}
                </div>
                <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                    disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
}