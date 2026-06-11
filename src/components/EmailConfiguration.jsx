import { useState } from 'react';
import { Mail } from 'lucide-react';
export default function EmailConfiguration({ data, onSave }) {
    const [formData, setFormData] = useState(data);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const validate = () => {
        const err = {};
        if (!formData.smtpHost.trim()) err.smtpHost = 'SMTP host required';
        if (!formData.smtpPort) err.smtpPort = 'SMTP port required';
        if (!formData.fromEmail.trim()) err.fromEmail = 'From email required';
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
                <Mail className="w-5 h-5 text-green-600" />
                <h2 className="text-2xl font-bold text-slate-900">Email Configuration</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
                <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-2">SMTP Host</label>
                    <input
                        type="text"
                        value={formData.smtpHost}
                        onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })}
                        placeholder="smtp.gmail.com"
                        className={`w-full px-4 py-2 bg-slate-100 rounded-lg border ${errors.smtpHost ? 'border-red-500' : 'border-slate-300'}`}
                        disabled={loading} />
                    {errors.smtpHost && <p className="text-red-600 text-xs mt-1">{errors.smtpHost}</p>}
                </div>
                <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-2">SMTP Port</label>
                    <input
                        type="number"
                        value={formData.smtpPort}
                        onChange={(e) => setFormData({ ...formData, smtpPort: parseInt(e.target.value) || 0 })}
                        placeholder="587"
                        className={`w-full px-4 py-2 bg-slate-100 rounded-lg border ${errors.smtpPort ? 'border-red-500' : 'border-slate-300'}`}
                        disabled={loading} />
                    {errors.smtpPort && <p className="text-red-600 text-xs mt-1">{errors.smtpPort}</p>}
                </div>
                <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-2">From Email</label>
                    <input
                        type="email"
                        value={formData.fromEmail}
                        onChange={(e) => setFormData({ ...formData, fromEmail: e.target.value })}
                        className={`w-full px-4 py-2 bg-slate-100 rounded-lg border ${errors.fromEmail ? 'border-red-500' : 'border-slate-300'}`}
                        disabled={loading} />
                    {errors.fromEmail && <p className="text-red-600 text-xs mt-1">{errors.fromEmail}</p>}
                </div>
                <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-2">From Name</label>
                    <input
                        type="text"
                        value={formData.fromName}
                        onChange={(e) => setFormData({ ...formData, fromName: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-100 rounded-lg border border-slate-300"
                        disabled={loading} />
                </div>
                <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
                    disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
}