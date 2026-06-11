import { AlertCircle } from 'lucide-react';
export default function DeactivateUserConfirm({ isOpen, onClose, onConfirm, user, loading }) {
    if (!isOpen || !user) return null;
    const isDeactivating = user.status === 'active';
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6">

                <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full ${isDeactivating ? 'bg-yellow-100' : 'bg-green-100'}`}>
                        <AlertCircle className={`w-6 h-6 ${isDeactivating ? 'text-yellow-600' : 'text-green-600'}`} />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">
                    {isDeactivating ? 'Deactivate User?' : 'Activate User?'}
                </h2>
                <p className="text-slate-600 text-center mb-6">
                    Are you sure you want to {isDeactivating ? 'deactivate' : 'activate'}{' '}
                    <span className="font-semibold">{user.name}</span>?
                    {isDeactivating && ' They will not be able to login.'}
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
                        className={`flex-1 px-4 py-2 text-white rounded-lg font-medium disabled:opacity-50 ${isDeactivating
                                ? 'bg-yellow-600 hover:bg-yellow-700'
                                : 'bg-green-600 hover:bg-green-700'
                            }`}
                        disabled={loading}>
                        {loading ? 'Processing...' : isDeactivating ? 'Deactivate' : 'Activate'}
                    </button>
                </div>
            </div>
        </div>
    );
}