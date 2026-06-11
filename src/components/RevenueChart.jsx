import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
export default function RevenueChart() {
    const [selectedYear, setSelectedYear] = useState(2024);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const companies = [
        { id: 1, name: 'NextGen Solutions', plan: 'Pro', createdAt: '2024-01-15', status: 'active' },
        { id: 2, name: 'Kisan Seva', plan: 'Enterprise', createdAt: '2024-11-20', status: 'active' },
        { id: 3, name: 'HealthSync Systems', plan: 'Free', createdAt: '2026-02-01', status: 'active' },
        { id: 4, name: 'EduSmart Learning', plan: 'Pro', createdAt: '2022-12-10', status: 'inactive', inactiveDate: '2023-05-15' },
    ];
    const planPrices = { 'Free': 0, 'Pro': 99, 'Enterprise': 299 };
    const calculateYearlyRevenue = (year) => {
        const monthlyRevenue = new Array(12).fill(0);
        companies.forEach(company => {
            const createdDate = new Date(company.createdAt);
            const createdYear = createdDate.getFullYear();
            const createdMonth = createdDate.getMonth();
            const monthlyPrice = planPrices[company.plan];
            let inactiveMonth = 12;
            if (company.status === 'inactive' && company.inactiveDate) {
                const inactiveDateObj = new Date(company.inactiveDate);
                const inactiveYear = inactiveDateObj.getFullYear();
                const inactiveMonthNum = inactiveDateObj.getMonth();
                if (inactiveYear === year) {
                    inactiveMonth = inactiveMonthNum;
                } else if (inactiveYear < year) {
                    return;
                }
            }
            if (createdYear <= year) {
                const startMonth = createdYear === year ? createdMonth : 0;

                for (let i = startMonth; i < inactiveMonth; i++) {
                    monthlyRevenue[i] += monthlyPrice;
                }
            }
        });
        return monthlyRevenue;
    };
    const data = calculateYearlyRevenue(selectedYear);
    const maxValue = Math.max(...data, 1);
    const years = [2022, 2023, 2024, 2025, 2026];
    const CHART_HEIGHT = 300;
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900">Monthly Revenue</h3>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setSelectedYear(prev => Math.max(2022, prev - 1))}
                        disabled={selectedYear === 2022}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-50">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex gap-2">
                        {years.map(year => (
                            <button
                                key={year}
                                onClick={() => setSelectedYear(year)}
                                className={`px-4 py-2 rounded-lg font-medium transition ${selectedYear === year
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`} >
                                {year}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setSelectedYear(prev => Math.min(2026, prev + 1))}
                        disabled={selectedYear === 2026}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-50">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <div style={{ height: CHART_HEIGHT }} className="flex items-end justify-between gap-2 mb-6 bg-slate-50 rounded-lg p-4">
                {data.map((value, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full gap-2">
                        <div
                            className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg hover:from-blue-700 hover:to-blue-500 transition cursor-pointer"
                            style={{ height: `${maxValue > 0 ? (value / maxValue) * (CHART_HEIGHT - 40) : 0}px` }}
                            title={`${months[idx]}: $${value}`} />
                    </div>
                ))}
            </div>
            <div className="flex justify-between gap-2 text-xs text-slate-600 mb-6">
                {months.map(month => (
                    <div key={month} className="flex-1 text-center">{month}</div>
                ))}
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-slate-600 text-sm">Total</p>
                        <p className="text-xl font-bold text-slate-900">${data.reduce((a, b) => a + b, 0)}</p>
                    </div>
                    <div>
                        <p className="text-slate-600 text-sm">Average</p>
                        <p className="text-xl font-bold text-slate-900">${Math.round(data.reduce((a, b) => a + b, 0) / 12)}</p>
                    </div>
                    <div>
                        <p className="text-slate-600 text-sm">Highest</p>
                        <p className="text-xl font-bold text-slate-900">${Math.max(...data)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}