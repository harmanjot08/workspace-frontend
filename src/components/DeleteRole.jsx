import { AlertCircle } from 'lucide-react';
export default function DeleteRoleConfirm({ isOpen, onClose, onConfirm, role, loading }) {
    if (!isOpen || !role) return null;

    const canDelete = role.usersCount === 0;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-full max-w-sm p-6">
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-red-100 rounded-full">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">Delete Role?</h2>

                {canDelete ? (
                    <p className="text-slate-600 text-center mb-6">Are you sure you want to delete <span className="font-semibold">{role.name}</span>? This cannot be undone.</p>
                ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <p className="text-yellow-800 text-sm">Cannot delete. <span className="font-semibold">{role.usersCount} users</span> assigned to this role.</p>
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium disabled:opacity-50"
                        disabled={loading || !canDelete}>
                        Cancel
                    </button>
                    {canDelete && (
                        <button
                            onClick={() => onConfirm(role.id)}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50"
                            disabled={loading}>
                            {loading ? 'Deleting...' : 'Delete'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}