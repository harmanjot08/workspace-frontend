import { BarChart3, CheckCircle, XCircle, DollarSign } from 'lucide-react';
export default function SubscriptionStats({ stats }) {
    return (
        <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-slate-600 text-sm">Total Subscriptions</p>
                        <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-blue-600" />
                </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-slate-600 text-sm">Active</p>
                        <p className="text-3xl font-bold text-green-600">{stats.active}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-slate-600 text-sm">Expired</p>
                        <p className="text-3xl font-bold text-red-600">{stats.expired}</p>
                    </div>
                    <XCircle className="w-8 h-8 text-red-600" />
                </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-slate-600 text-sm">Monthly MRR</p>
                        <p className="text-3xl font-bold text-purple-600">${stats.mrr}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-purple-600" />
                </div>
            </div>
        </div>
    );
}