import { useState, useEffect } from 'react';
import ManagerLayout from '../../components/ManagerLayout';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { taskAPI } from '../../api/taskApi.js';

export default function ManagerTasksPage() {
    const [tasks, setTasks] = useState([]);

    const [stats, setStats] = useState({
        totalTasks: 0,
        inProgress: 0,
        completed: 0,
        pending: 0,
    });

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [form, setForm] = useState({
        title: '', description: '', priority: 'Medium',
        status: 'Pending', dueDate: '', assignedTo: ''
    });

    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        fetchTasks();
        fetchUsers();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await taskAPI.getTasks(token);
            if (response.tasks) {
                setTasks(response.tasks);
                setStats({
                    totalTasks: response.tasks.length,
                    inProgress: response.tasks.filter(t => t.status === 'In Progress').length,
                    completed: response.tasks.filter(t => t.status === 'Completed').length,
                    pending: response.tasks.filter(t => t.status === 'Pending').length,
                });
            }
        } catch (err) {
            console.error('fetchTasks error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch('https://workspace-backend-pyb2.onrender.com/api/users', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.users) setUsers(data.users);
        } catch (err) {
            console.error('fetchUsers error:', err);
        }
    };

    const handleCreateTask = async () => {
        if (!form.title.trim()) return;
        const response = await taskAPI.createTask(token, form);
        if (response.task) {
            setTasks(prev => [response.task, ...prev]);
            setForm({ title: '', description: '', priority: 'Medium', status: 'Pending', dueDate: '', assignedTo: '' });
            setShowCreateModal(false);
        }
    };

    const handleEditTask = async () => {
        if (!selectedTask) return;
        const response = await taskAPI.updateTask(token, selectedTask.id, form);
        if (response.task) {
            setTasks(prev => prev.map(t => t.id === selectedTask.id ? response.task : t));
            setShowEditModal(false);
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!confirm('Delete this task?')) return;
        await taskAPI.deleteTask(token, taskId);
        setTasks(prev => prev.filter(t => t.id !== taskId));
    };

    const openEditModal = (task) => {
        setSelectedTask(task);
        setForm({
            title: task.title,
            description: task.description || '',
            priority: task.priority,
            status: task.status,
            dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
            assignedTo: task.assignedTo || ''
        });
        setShowEditModal(true);
    };

    const priorityColor = (p) => {
        if (p === 'Critical') return 'bg-red-100 text-red-700';
        if (p === 'High') return 'bg-orange-100 text-orange-700';
        if (p === 'Medium') return 'bg-yellow-100 text-yellow-700';
        return 'bg-slate-100 text-slate-700';
    };

    const statusColor = (s) => {
        if (s === 'Completed') return 'bg-green-100 text-green-700';
        if (s === 'In Progress') return 'bg-blue-100 text-blue-700';
        return 'bg-yellow-100 text-yellow-700';
    };

    if (loading) return <ManagerLayout><div className="p-8">Loading...</div></ManagerLayout>;

    return (
        <ManagerLayout>
            <div>
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">Tasks</h1>
                        <p className="text-slate-600">Manage and track your team's work</p>
                    </div>
                    <button
                        onClick={() => { setForm({ title: '', description: '', priority: 'Medium', status: 'Pending', dueDate: '', assignedTo: '' }); setShowCreateModal(true); }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Create Task
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white border border-slate-200 rounded-xl p-6">
                        <h3 className="text-slate-500 text-sm mb-2">Total Tasks</h3>
                        <p className="text-3xl font-bold text-slate-900">{tasks.length}</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-6">
                        <h3 className="text-slate-500 text-sm mb-2">In Progress</h3>
                        <p className="text-3xl font-bold text-blue-600">{tasks.filter(t => t.status === 'In Progress').length}</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-6">
                        <h3 className="text-slate-500 text-sm mb-2">Completed</h3>
                        <p className="text-3xl font-bold text-green-600">{tasks.filter(t => t.status === 'Completed').length}</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-6">
                        <h3 className="text-slate-500 text-sm mb-2">Pending</h3>
                        <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Team Tasks</h2>
                    {tasks.length === 0 ? (
                        <p className="text-slate-500 text-center py-8">No tasks yet. Create your first task!</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="text-left py-3 text-sm text-slate-500">Task</th>
                                        <th className="text-left py-3 text-sm text-slate-500">Assignee</th>
                                        <th className="text-left py-3 text-sm text-slate-500">Priority</th>
                                        <th className="text-left py-3 text-sm text-slate-500">Due Date</th>
                                        <th className="text-left py-3 text-sm text-slate-500">Status</th>
                                        <th className="text-left py-3 text-sm text-slate-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.map(task => (
                                        <tr key={task.id} className="border-b border-slate-100">
                                            <td className="py-4 font-medium text-slate-900">{task.title}</td>
                                            <td className="py-4 text-slate-600">{task.assignee?.name || '—'}</td>
                                            <td className="py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColor(task.priority)}`}>
                                                    {task.priority}
                                                </span>
                                            </td>
                                            <td className="py-4 text-slate-600">
                                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
                                            </td>
                                            <td className="py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(task.status)}`}>
                                                    {task.status}
                                                </span>
                                            </td>
                                            <td className="py-4">
                                                <div className="flex gap-2">
                                                    <button onClick={() => openEditModal(task)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDeleteTask(task.id)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {showCreateModal && <TaskModal title="Create New Task" onSubmit={handleCreateTask} onClose={() => setShowCreateModal(false)} form={form} setForm={setForm} users={users} />}
            {showEditModal && <TaskModal title="Edit Task" onSubmit={handleEditTask} onClose={() => setShowEditModal(false)} form={form} setForm={setForm} users={users} />}
        </ManagerLayout>
    );
    const TaskModal = ({ onSubmit, onClose, title, form, setForm, users }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
                <h3 className="text-lg font-bold text-slate-900 mb-4">{title}</h3>
                <div className="space-y-3">
                    <input
                        type="text"
                        placeholder="Task title*"
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <textarea
                        placeholder="Description (optional)"
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 h-20 resize-none"
                    />
                    <select
                        value={form.priority}
                        onChange={e => setForm({ ...form, priority: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500">
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Critical</option>
                    </select>
                    <select
                        value={form.status}
                        onChange={e => setForm({ ...form, status: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500">
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                    </select>
                    <input
                        type="date"
                        value={form.dueDate}
                        onChange={e => setForm({ ...form, dueDate: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <select
                        value={form.assignedTo}
                        onChange={e => setForm({ ...form, assignedTo: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500">
                        <option value="">Assign to (optional)</option>
                        {users.map(u => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex gap-3 justify-end mt-4">
                    <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                    <button onClick={onSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
                </div>
            </div>
        </div>
    );

    export default ManagerTasksPage;
}