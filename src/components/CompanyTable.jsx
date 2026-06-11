import { Eye, Edit, Trash2 } from 'lucide-react';
export default function CompanyTable({ companies }) {
    const getPlanColor = (plan) => {
        const colors = {
            'Free': 'bg-gray-100 text-gray-800',
            'Pro': 'bg-blue-100 text-blue-800',
            'Enterprise': 'bg-purple-100 text-purple-800'
        };
        return colors[plan] || 'bg-gray-100 text-gray-800';
    };

    const getStatusColor = (status) => {
        return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Name</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Email</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Plan</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Users</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Created</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companies.length > 0 ? (
                            companies.map((company) => (
                                <tr key={company.id} className="border-b border-slate-200 hover:bg-slate-50">
                                    <td className="px-6 py-4 font-semibold text-slate-900">{company.name}</td>
                                    <td className="px-6 py-4 text-slate-600 text-sm">{company.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPlanColor(company.plan)}`}>
                                            {company.plan}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-900">{company.users}</td>
                                    <td className="px-6 py-4 text-slate-600 text-sm">{company.createdAt}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(company.status)}`}>
                                            {company.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex gap-3">
                                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-8 text-center text-slate-500">
                                    No companies found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}