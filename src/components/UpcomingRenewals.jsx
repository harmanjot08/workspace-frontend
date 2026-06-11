import { AlertCircle } from 'lucide-react';
export default function UpcomingRenewals({ subscriptions, onViewDetails }) {
    const today = new Date();
    const upcoming = subscriptions
        .filter(s => {
            const endDate = new Date(s.endDate);
            const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
            return daysLeft > 0 && daysLeft <= 30 && s.status === 'active';
        })
        .sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 h-fit">
            <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg font-bold text-slate-900">Upcoming Renewals</h2>
            </div>
            <div className="space-y-3">
                {upcoming.length === 0 ? (
                    <p className="text-slate-500 text-sm">No renewals in next 30 days</p>
                ) : (
                    upcoming.map(sub => {
                        const daysLeft = Math.ceil((new Date(sub.endDate) - today) / (1000 * 60 * 60 * 24));
                        return (
                            <div
                                key={sub.id}
                                onClick={() => onViewDetails(sub)}
                                className="p-3 bg-orange-50 border border-orange-200 rounded-lg cursor-pointer hover:bg-orange-100 transition">
                                <p className="font-semibold text-slate-900 text-sm">{sub.company}</p>
                                <p className="text-xs text-orange-700 mt-1">{daysLeft} days left</p>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}