export default function StatCard({ icon: Icon, label, value, color = 'blue' }) {
    const colors = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600'
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${colors[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-slate-600 text-sm font-medium">{label}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
                </div>
            </div>
        </div>
    );
}