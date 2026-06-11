import { useState } from 'react';
import { Globe } from 'lucide-react';
export default function PlatformSettings({ data, onSave }) {
    const [formData, setFormData] = useState(data);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const validate = () => {
        const err = {};
        if (!formData.name.trim()) err.name = 'Platform name required';
        if (!formData.email.trim()) err.email = 'Email required';
        if (!formData.website.trim()) err.website = 'Website URL required';
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
                <Globe className="w-5 h-5 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">Platform Settings</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
                <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-2">Platform Name</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full px-4 py-2 bg-slate-100 rounded-lg border ${errors.name ? 'border-red-500' : 'border-slate-300'}`}
                        disabled={loading} />
                    {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-2">Support Email</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full px-4 py-2 bg-slate-100 rounded-lg border ${errors.email ? 'border-red-500' : 'border-slate-300'}`}
                        disabled={loading} />
                    {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-2">Website URL</label>
                    <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className={`w-full px-4 py-2 bg-slate-100 rounded-lg border ${errors.website ? 'border-red-500' : 'border-slate-300'}`}
                        disabled={loading} />
                    {errors.website && <p className="text-red-600 text-xs mt-1">{errors.website}</p>}
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