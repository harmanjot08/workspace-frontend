import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
export default function EditPlanModal({ isOpen, onClose, plan, onSave }) {
    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        description: '',
        features: [],
    });
    const [newFeature, setNewFeature] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (plan) {
            setFormData({
                name: plan.name,
                price: plan.price,
                description: plan.description,
                features: plan.features,
            });
            setNewFeature('');
            setErrors({});
        }
    }, [plan, isOpen]);
    const validate = () => {
        const err = {};
        if (!formData.name.trim()) err.name = 'Plan name required';
        if (formData.price < 0) err.price = 'Price cannot be negative';
        if (!formData.description.trim()) err.description = 'Description required';
        if (formData.features.length === 0) err.features = 'Add at least one feature';
        setErrors(err);
        return Object.keys(err).length === 0;
    };
    const handleAddFeature = () => {
        if (newFeature.trim()) {
            setFormData(prev => ({
                ...prev,
                features: [...prev.features, newFeature],
            }));
            setNewFeature('');
        }
    };
    const handleRemoveFeature = (idx) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== idx),
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        await new Promise(r => setTimeout(r, 300));
        onSave({ ...plan, ...formData });
        setLoading(false);
    };
    if (!isOpen || !plan) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Edit {plan.name} Plan</h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">Plan Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={`w-full px-4 py-2 bg-slate-100 rounded-lg border ${errors.name ? 'border-red-500' : 'border-slate-300'}`}
                            disabled={loading} />
                        {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">Price/Month ($)</label>
                        <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                            className={`w-full px-4 py-2 bg-slate-100 rounded-lg border ${errors.price ? 'border-red-500' : 'border-slate-300'}`}
                            disabled={loading} />
                        {errors.price && <p className="text-red-600 text-xs mt-1">{errors.price}</p>}
                    </div>
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows="2"
                            className={`w-full px-4 py-2 bg-slate-100 rounded-lg border resize-none ${errors.description ? 'border-red-500' : 'border-slate-300'}`}
                            disabled={loading} />
                        {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
                    </div>
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">Features</label>
                        <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                            {formData.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-slate-100 p-2 rounded-lg">
                                    <span className="text-sm text-slate-900">{feature}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFeature(idx)}
                                        className="text-red-600 hover:text-red-800 text-sm font-medium">
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                        {errors.features && <p className="text-red-600 text-xs mb-2">{errors.features}</p>}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newFeature}
                                onChange={(e) => setNewFeature(e.target.value)}
                                placeholder="Add feature..."
                                className="flex-1 px-3 py-2 bg-slate-100 rounded-lg border border-slate-300 text-sm"
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                                disabled={loading} />
                            <button
                                type="button"
                                onClick={handleAddFeature}
                                className="px-3 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 text-sm font-medium"
                                disabled={loading}>
                                Add
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 disabled:opacity-50"
                            disabled={loading}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            disabled={loading}>
                            {loading ? 'Saving...' : 'Save Plan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}