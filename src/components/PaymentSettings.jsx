import { useState } from 'react';
import { CreditCard } from 'lucide-react';
export default function PaymentSettings({ data, onSave }) {
    const [formData, setFormData] = useState(data);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const validate = () => {
        const err = {};
        if (!formData.currency.trim()) err.currency = 'Currency required';
        if (formData.taxRate < 0 || formData.taxRate > 100) err.taxRate = 'Tax rate 0-100';
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
                <CreditCard className="w-5 h-5 text-purple-600" />
                <h2 className="text-2xl font-bold text-slate-900">Payment Settings</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
                <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-2">Currency</label>
                    <select
                        value={formData.currency}
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                        className={`w-full px-4 py-2 bg-slate-100 rounded-lg border ${errors.currency ? 'border-red-500' : 'border-slate-300'}`}
                        disabled={loading}>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="INR">INR (₹)</option>
                        <option value="GBP">GBP (£)</option>
                    </select>
                    {errors.currency && <p className="text-red-600 text-xs mt-1">{errors.currency}</p>}
                </div>
                <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-2">Tax Rate (%)</label>
                    <input
                        type="number"
                        value={formData.taxRate}
                        onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })}
                        min="0"
                        max="100"
                        step="0.1"
                        className={`w-full px-4 py-2 bg-slate-100 rounded-lg border ${errors.taxRate ? 'border-red-500' : 'border-slate-300'}`}
                        disabled={loading} />
                    {errors.taxRate && <p className="text-red-600 text-xs mt-1">{errors.taxRate}</p>}
                </div>
                <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-2">Invoice Prefix</label>
                    <input
                        type="text"
                        value={formData.invoicePrefix}
                        onChange={(e) => setFormData({ ...formData, invoicePrefix: e.target.value })}
                        placeholder="INV-"
                        className="w-full px-4 py-2 bg-slate-100 rounded-lg border border-slate-300"
                        disabled={loading} />
                </div>
                <button
                    type="submit"
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50"
                    disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
}