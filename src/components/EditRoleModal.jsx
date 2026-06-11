import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
const PERMISSIONS = ['addUsers', 'editUsers', 'deleteUsers', 'viewReports', 'manageRoles', 'manageSettings', 'viewChat', 'viewCalendar'];
export default function EditRoleModal({ isOpen, onClose, onSubmit, role }) {
    const [data, setData] = useState({ name: '', description: '', permissions: [] });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (role) {
            setData({ name: role.name, description: role.description, permissions: role.permissions });
            setErrors({});
        }
    }, [role, isOpen]);

    const validate = () => {
        const err = {};
        if (!data.name.trim()) err.name = 'Required';
        if (!data.description.trim()) err.description = 'Required';
        if (data.permissions.length === 0) err.permissions = 'Select at least one';
        setErrors(err);
        return Object.keys(err).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        await onSubmit({ ...role, ...data });
        onClose();
        setLoading(false);
    };

    if (!isOpen || !role) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md p-6 overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Edit Role</h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Role Name"
                            value={data.name}
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                            className={`w-full px-4 py-2 bg-slate-100 rounded-lg border ${errors.name ? 'border-red-500' : 'border-slate-300'}`}
                        />
                        {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <textarea
                            placeholder="Description"
                            value={data.description}
                            onChange={(e) => setData({ ...data, description: e.target.value })}
                            rows="2"
                            className={`w-full px-4 py-2 bg-slate-100 rounded-lg border resize-none ${errors.description ? 'border-red-500' : 'border-slate-300'}`} />
                        {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-slate-700 mb-2">Permissions</p>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {PERMISSIONS.map(p => (
                                <label key={p} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.permissions.includes(p)}
                                        onChange={(e) => setData({
                                            ...data,
                                            permissions: e.target.checked ? [...data.permissions, p] : data.permissions.filter(x => x !== p)
                                        })}
                                        className="w-4 h-4 rounded" />
                                    <span className="text-sm text-slate-700">{p}</span>
                                </label>
                            ))}
                        </div>
                        {errors.permissions && <p className="text-red-600 text-xs mt-2">{errors.permissions}</p>}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 disabled:opacity-50" disabled={loading}>Cancel</button>
                        <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}