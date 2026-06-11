import AdminLayout from '../../components/AdminLayout';
export default function AdminDashboard() {
    return (
        <AdminLayout>
            <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
                <p className="text-slate-600 mb-8">Welcome to Workspace Admin Panel</p>

                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-slate-600 text-sm font-medium mb-2">Total Companies</p>
                        <p className="text-3xl font-bold text-slate-900">-</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-slate-600 text-sm font-medium mb-2">Active Users</p>
                        <p className="text-3xl font-bold text-slate-900">-</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-slate-600 text-sm font-medium mb-2">Monthly Revenue</p>
                        <p className="text-3xl font-bold text-slate-900">-</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-slate-600 text-sm font-medium mb-2">Growth Rate</p>
                        <p className="text-3xl font-bold text-slate-900">-</p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}