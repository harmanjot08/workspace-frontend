import { Activity } from 'lucide-react';
export default function SystemLogs({ logs }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-6">
                <Activity className="w-5 h-5 text-orange-600" />
                <h2 className="text-2xl font-bold text-slate-900">System Activity Logs</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-200">
                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Action</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">User</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Time</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">IP Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map(log => (
                            <tr key={log.id} className="border-b border-slate-200 hover:bg-slate-50">
                                <td className="px-6 py-3 text-slate-900">{log.action}</td>
                                <td className="px-6 py-3 text-slate-600 text-sm">{log.user}</td>
                                <td className="px-6 py-3 text-slate-600 text-sm">{log.time}</td>
                                <td className="px-6 py-3 text-slate-600 text-sm">{log.ip}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600">
                    Showing {logs.length} recent activities
                </p>
            </div>
        </div>
    );
}