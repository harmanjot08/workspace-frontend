import { useState } from 'react';
import { X } from 'lucide-react';
export default function AssignEmploymentTypeModal({ isOpen, onClose, onSubmit, employmentType, users }) {
    const [selectedUserId, setSelectedUserId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const assignedUserIds = users.filter(u => u.employmentType === employmentType?.name).map(u => u.id);
    const availableUsers = users.filter(u => !assignedUserIds.includes(u.id));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedUserId) {
            setError('Please select a user');
            return;
        }

        setLoading(true);
        try {
            await onSubmit(parseInt(selectedUserId), employmentType.name);
            setSelectedUserId('');
            setError('');
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !employmentType) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Assign to {employmentType.name}</h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {availableUsers.length === 0 ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-green-800 text-sm">All users already assigned</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-slate-700 text-sm font-semibold mb-2">Select User</label>
                            <select
                                value={selectedUserId}
                                onChange={(e) => { setSelectedUserId(e.target.value); setError(''); }}
                                className="w-full px-4 py-2 bg-slate-100 rounded-lg border border-slate-300 focus:border-green-500 focus:outline-none"
                                disabled={loading}>
                                <option value="">Choose a user...</option>
                                {availableUsers.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.email})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {error && <p className="text-red-600 text-sm">{error}</p>}

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
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                                disabled={loading}>
                                {loading ? 'Assigning...' : 'Assign'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}