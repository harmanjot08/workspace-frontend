import { Trash2, Plus } from 'lucide-react';
export default function EmploymentTypesTable({ employmentTypes, users, onAssignUser, onRemoveUser }) {
    return (
        <div className="space-y-6">
            {employmentTypes.map(empType => {
                const assignedUsers = users.filter(u => u.employmentType === empType.name);
                return (
                    <div key={empType.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">{empType.name}</h3>
                                    <p className="text-slate-600 text-sm">{empType.description}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-green-600">{assignedUsers.length}</p>
                                    <p className="text-slate-600 text-sm">users</p>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">User Name</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Email</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Functional Role</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Department</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assignedUsers.length > 0 ? (
                                        assignedUsers.map(user => (
                                            <tr key={user.id} className="border-b border-slate-200 hover:bg-slate-50">
                                                <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                                                <td className="px-6 py-4 text-slate-600 text-sm">{user.email}</td>
                                                <td className="px-6 py-4 text-slate-600 text-sm">{user.functionalRole}</td>
                                                <td className="px-6 py-4 text-slate-600 text-sm">{user.department}</td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => onRemoveUser(user.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                        title="Remove employment type">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                                                No users assigned
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4">
                            <button
                                onClick={() => onAssignUser(empType)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium text-sm">
                                <Plus className="w-4 h-4" />
                                Assign User
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}