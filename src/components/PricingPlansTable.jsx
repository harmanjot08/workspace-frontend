import { Edit, DollarSign, Users } from 'lucide-react';
export default function PricingPlansTable({ plans, onEditPlan }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-slate-200">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Plan Name</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Price/Month</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Features</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Companies</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Monthly Revenue</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {plans.map(plan => (
                        <tr key={plan.id} className="border-b border-slate-200 hover:bg-slate-50">
                            <td className="px-6 py-4 font-semibold text-slate-900">{plan.name}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-green-600" />
                                    <span className="font-bold text-slate-900">{plan.price}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">{plan.features.length} features</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-blue-600" />
                                    <span className="text-slate-900">{plan.companiesCount}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 font-bold text-green-600">${plan.price * plan.companiesCount}</td>
                            <td className="px-6 py-4">
                                <button
                                    onClick={() => onEditPlan(plan)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                    <Edit className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}