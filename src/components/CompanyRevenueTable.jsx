export default function CompanyRevenueTable({ companies = [] }) {
    const planPrices = { 'Free': 0, 'Pro': 99, 'Enterprise': 299 };

    const defaultCompanies = [
        { id: 1, name: 'NextGen Solutions', email: 'contact@nextgen.com', plan: 'Pro', users: 45, createdAt: '2024-01-15', status: 'active' },
        { id: 2, name: 'Kisan Seva', email: 'contact@kisanseva.com', plan: 'Enterprise', users: 120, createdAt: '2024-11-20', status: 'active' },
        { id: 3, name: 'HealthSync Systems', email: 'admin@healthsync.com', plan: 'Free', users: 8, createdAt: '2026-02-01', status: 'active' },
        { id: 4, name: 'EduSmart Learning', email: 'help@edusmart.com', plan: 'Pro', users: 82, createdAt: '2022-12-10', status: 'inactive', inactiveDate: '2023-05-15' },
    ];

    const dataToUse = companies.length > 0 ? companies : defaultCompanies;

    const calculateRevenue = (plan) => {
        const prices = { 'Free': 0, 'Pro': 99, 'Enterprise': 299 };
        return prices[plan] || 0;
    };

    const companyRevenue = dataToUse.map(company => ({
        ...company,
        monthlyRevenue: calculateRevenue(company.plan)
    }));

    const totalRevenue = companyRevenue.reduce((sum, c) => sum + c.monthlyRevenue, 0);

    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900">Revenue by Company</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Company</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Plan</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Users</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Monthly Revenue</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Annual Revenue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companyRevenue.map((company) => (
                            <tr key={company.id} className="border-b border-slate-200 hover:bg-slate-50">
                                <td className="px-6 py-4 font-semibold text-slate-900">{company.name}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${company.plan === 'Free' ? 'bg-gray-100 text-gray-800' :
                                            company.plan === 'Pro' ? 'bg-blue-100 text-blue-800' :
                                                'bg-purple-100 text-purple-800'
                                        }`}>
                                        {company.plan}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-900">{company.users}</td>
                                <td className="px-6 py-4 font-bold text-slate-900">${company.monthlyRevenue}</td>
                                <td className="px-6 py-4 text-slate-600">${company.monthlyRevenue * 12}</td>
                            </tr>
                        ))}
                        <tr className="bg-slate-50 border-t-2 border-slate-200">
                            <td colSpan="3" className="px-6 py-4 font-bold text-slate-900">Total Revenue</td>
                            <td className="px-6 py-4 font-bold text-blue-600 text-lg">${totalRevenue}</td>
                            <td className="px-6 py-4 font-bold text-blue-600 text-lg">${totalRevenue * 12}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}