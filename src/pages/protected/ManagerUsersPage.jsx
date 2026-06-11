import { useState, useEffect } from 'react';
import { userAPI } from '../../api/userApi.js';
import useAuthStore from '../../store/authStore.js';
export default function ManagerUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuthStore();
    useEffect(() => {
        fetchUsers();
    }, []);
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            const response = await userAPI.getAllUsers(token);
            if (response.users) {
                setUsers(response.users);
            } else {
                setError(response.message || 'Failed to fetch users');
            }
        } catch (err) {
            setError('Failed to fetch users');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    if (loading) return <div className="p-8">Loading users...</div>;
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-6">Team Members</h1>
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                    {error}
                </div>
            )}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Name</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Email</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Role</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Department</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 text-sm text-slate-900">{user.name}</td>
                                <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                                <td className="px-6 py-4 text-sm">
                                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">{user.department || '-'}</td>
                                <td className="px-6 py-4 text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.isActive
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {user.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 text-sm text-slate-600">
                Total users: {users.length}
            </div>
        </div>
    );
}