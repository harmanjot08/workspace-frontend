import { Eye } from 'lucide-react';
const STATUS_COLORS = {
    active: 'bg-green-100 text-green-800',
    expired: 'bg-red-100 text-red-800',
    expiring: 'bg-yellow-100 text-yellow-800',
};
export default function SubscriptionTable({ subscriptions, onViewDetails }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-slate-200">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Company</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Plan</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Users</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">End Date</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Price</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {subscriptions.map(sub => (
                        <tr key={sub.id} className="border-b border-slate-200 hover:bg-slate-50">
                            <td className="px-6 py-4 font-medium text-slate-900">{sub.company}</td>
                            <td className="px-6 py-4 text-slate-600">{sub.plan}</td>
                            <td className="px-6 py-4 text-slate-600">{sub.users}</td>
                            <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[sub.status]}`}>
                                    {sub.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">{sub.endDate}</td>
                            <td className="px-6 py-4 font-semibold text-slate-900">${sub.price}</td>
                            <td className="px-6 py-4">
                                <button
                                    onClick={() => onViewDetails(sub)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                    <Eye className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}