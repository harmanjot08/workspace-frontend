import { Trash2 } from 'lucide-react';
export default function DeleteUser({ isOpen, onClose, onConfirm, user, loading }) {
    if (!isOpen || !user) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-red-100 rounded-full">
                        <Trash2 className="w-6 h-6 text-red-600" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">Delete User?</h2>
                <p className="text-slate-600 text-center mb-6">
                    Are you sure you want to delete <span className="font-semibold">{user.name}</span>? This action cannot be undone.
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium disabled:opacity-50"
                        disabled={loading}>
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(user.id)}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50"
                        disabled={loading}>
                        {loading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}