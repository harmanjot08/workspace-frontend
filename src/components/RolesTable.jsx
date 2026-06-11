import { Edit, Trash2, Users } from 'lucide-react';
export default function RolesTable({ roles, onEdit, onDelete }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="bg-slate-50 border-b">
                        <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Description</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Permissions</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Users</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {roles.map(role => (
                        <tr key={role.id} className="border-b hover:bg-slate-50">
                            <td className="px-6 py-4 font-semibold">{role.name}</td>
                            <td className="px-6 py-4 text-slate-600 text-sm">{role.description}</td>
                            <td className="px-6 py-4"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">{role.permissions.length}</span></td>
                            <td className="px-6 py-4 flex items-center gap-1"><Users className="w-4 h-4" />{role.usersCount}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2 justify-end">
                                    <button onClick={() => onEdit(role)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => onDelete(role)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}