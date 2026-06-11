import { X } from 'lucide-react';
export default function SubscriptionModal({ isOpen, onClose, subscription, onUpgrade, onRenew, onCancel }) {
    if (!isOpen || !subscription) return null;
    const upgradePlans = {
        Free: 'Pro',
        Pro: 'Enterprise',
        Enterprise: 'Enterprise',
    };
    const downgradeOptions = {
        Enterprise: 'Pro',
        Pro: 'Free',
        Free: 'Free',
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">{subscription.company}</h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="space-y-4 mb-6 pb-6 border-b border-slate-200">
                    <div>
                        <p className="text-slate-600 text-sm">Current Plan</p>
                        <p className="text-xl font-bold text-slate-900">{subscription.plan}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-slate-600 text-xs">Users</p>
                            <p className="text-lg font-bold">{subscription.users}</p>
                        </div>
                        <div>
                            <p className="text-slate-600 text-xs">Monthly Price</p>
                            <p className="text-lg font-bold">${subscription.price}</p>
                        </div>
                        <div>
                            <p className="text-slate-600 text-xs">Start Date</p>
                            <p className="text-sm">{subscription.startDate}</p>
                        </div>
                        <div>
                            <p className="text-slate-600 text-xs">End Date</p>
                            <p className="text-sm">{subscription.endDate}</p>
                        </div>
                    </div>
                </div>
                <div className="space-y-3">
                    {subscription.plan !== 'Enterprise' && (
                        <button
                            onClick={() => onUpgrade(subscription.id, upgradePlans[subscription.plan])}
                            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm">
                            Upgrade to {upgradePlans[subscription.plan]}
                        </button>
                    )}
                    {subscription.plan !== 'Free' && (
                        <button
                            onClick={() => onUpgrade(subscription.id, downgradeOptions[subscription.plan])}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                            Downgrade to {downgradeOptions[subscription.plan]}
                        </button>
                    )}
                    <button
                        onClick={() => onRenew(subscription.id)}
                        className="w-full px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm">
                        Renew Subscription
                    </button>
                    <button
                        onClick={() => onCancel(subscription.id)}
                        className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-medium text-sm">
                        Cancel Subscription
                    </button>
                </div>
            </div>
        </div>
    );
}