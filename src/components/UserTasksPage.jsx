import { useState } from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
const PRIORITY_COLORS = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
};
const STATUS_OPTIONS = ['to-do', 'in-progress', 'done'];
export default function UserTasksPage({ tasks, onUpdateTask }) {
    const [filterStatus, setFilterStatus] = useState('all');
    const filteredTasks = filterStatus === 'all' ? tasks : tasks.filter(t => t.status === filterStatus);
    return (
        <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-1">My Tasks</h1>
            <p className="text-slate-600 mb-8">Manage your assigned tasks</p>
            <div className="mb-6 flex gap-2">
                {['all', 'to-do', 'in-progress', 'done'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 rounded-lg font-medium transition ${filterStatus === status
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Task</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Priority</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Due Date</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Assigned By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTasks.map(task => (
                                <tr key={task.id} className="border-b border-slate-200 hover:bg-slate-50">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-semibold text-slate-900">{task.title}</p>
                                            <p className="text-sm text-slate-600">{task.description}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={task.status}
                                            onChange={(e) => onUpdateTask(task.id, e.target.value)}
                                            className="px-3 py-1 bg-slate-100 rounded-lg border border-slate-300 text-sm font-medium text-slate-900">
                                            {STATUS_OPTIONS.map(status => (
                                                <option key={status} value={status}>
                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${PRIORITY_COLORS[task.priority]}`}>
                                            {task.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{task.dueDate}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{task.assignedBy}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}