import { Trash2, Edit, ToggleLeft, ToggleRight } from 'lucide-react';
export default function ManagerUsersTable({ users, onEdit, onDelete, onToggleStatus }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Name</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Email</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Role</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Department</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Joined</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.id} className="border-b border-slate-200 hover:bg-slate-50">
                                    <td className="px-6 py-4 font-semibold text-slate-900">{user.name}</td>
                                    <td className="px-6 py-4 text-slate-600">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{user.department}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${user.status === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 text-sm">{user.joinedDate}</td>
                                    <td className="px-6 py-4 flex gap-3">
                                        <button
                                            onClick={() => onEdit(user)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                            title="Edit user">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onToggleStatus(user)}
                                            className={`p-2 rounded-lg ${user.status === 'active'
                                                    ? 'text-yellow-600 hover:bg-yellow-50'
                                                    : 'text-green-600 hover:bg-green-50'
                                                }`}
                                            title={user.status === 'active' ? 'Deactivate user' : 'Activate user'}>
                                            {user.status === 'active' ? (
                                                <ToggleRight className="w-4 h-4" />
                                            ) : (
                                                <ToggleLeft className="w-4 h-4" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => onDelete(user)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                            title="Delete user">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-8 text-center text-slate-500">
                                    No users found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}