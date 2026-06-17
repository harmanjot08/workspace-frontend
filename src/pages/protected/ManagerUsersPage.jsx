import { useState, useEffect } from 'react';
import { userApi } from '../../api/userApi.js';
import useAuthStore from '../../store/authStore.js';
import { Plus, Upload } from 'lucide-react';
import ManagerLayout from '../../components/ManagerLayout';
export default function ManagerUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuthStore();
    useEffect(() => {
        fetchUsers();
    }, []);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        role: 'user',
        department: '',
    });
    const [csvFile, setCsvFile] = useState(null);
    const [addLoading, setAddLoading] = useState(false);
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            const response = await userApi.getAllUsers(token);
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
    const handleAddUser = async () => {
        if (!newUser.name || !newUser.email) {
            setError('Name and email required');
            return;
        }

        try {
            setAddLoading(true);
            const token = localStorage.getItem('accessToken');
            const response = await userApi.createUser(token, newUser);

            if (response.user) {
                setUsers(prev => [...prev, response.user]);
                setNewUser({ name: '', email: '', role: 'user', department: '' });
                setShowAddModal(false);
            }
        } catch (err) {
            setError('Failed to add user');
            console.error(err);
        } finally {
            setAddLoading(false);
        }
    };

    const handleBulkUpload = async () => {
        if (!csvFile) {
            setError('Please select a file');
            return;
        }

        try {
            setAddLoading(true);
            const formData = new FormData();
            formData.append('file', csvFile);

            const token = localStorage.getItem('accessToken');
            const response = await userApi.bulkUploadUsers(token, formData);

            if (response.users) {
                setUsers(prev => [...prev, ...response.users]);
                setCsvFile(null);
                setShowBulkModal(false);
            }
        } catch (err) {
            setError('Failed to upload users');
            console.error(err);
        } finally {
            setAddLoading(false);
        }
    };
    const handleToggleUserStatus = async (userId, currentStatus) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await userApi.updateUser(token, userId, {
                isActive: !currentStatus
            });

            if (response.user) {
                setUsers(prev =>
                    prev.map(u => u.id === userId ? response.user : u)
                );
            }
        } catch (err) {
            setError('Failed to update user status');
            console.error(err);
        }
    };
    if (loading) return <div className="p-8">Loading users...</div>;
    return (
        <ManagerLayout>
            <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-slate-900">Team Members</h1>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                            <Plus className="w-5 h-5" />
                            Add User
                        </button>
                        <button
                            onClick={() => setShowBulkModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                            <Upload className="w-5 h-5" />
                            Bulk Upload
                        </button>
                    </div>
                </div>
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
                                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Actions</th>
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
                                    <td className="px-6 py-4 text-sm">
                                        <button
                                            onClick={() => handleToggleUserStatus(user.id, user.isActive)}
                                            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${user.isActive
                                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                }`}>
                                            {user.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 text-sm text-slate-600">
                    Total users: {users.length}
                </div>
                {/* Add User Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Add New User</h3>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="Full name"
                                    value={newUser.name}
                                    onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={newUser.email}
                                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                                />
                                <select
                                    value={newUser.role}
                                    onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500">
                                    <option value="user">User</option>
                                    <option value="manager">Manager</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Department (optional)"
                                    value={newUser.department}
                                    onChange={e => setNewUser({ ...newUser, department: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div className="flex gap-3 justify-end mt-4">
                                <button
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setNewUser({ name: '', email: '', role: 'user', department: '' });
                                    }}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddUser}
                                    disabled={addLoading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                                    {addLoading ? 'Adding...' : 'Add User'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bulk Upload Modal */}
                {showBulkModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Bulk Upload Users</h3>
                            <div className="space-y-3">
                                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                                    <input
                                        type="file"
                                        accept=".csv"
                                        onChange={e => setCsvFile(e.target.files?.[0] || null)}
                                        className="hidden"
                                        id="csv-upload"
                                    />
                                    <label htmlFor="csv-upload" className="cursor-pointer">
                                        <p className="text-slate-600 font-medium">Click to upload CSV</p>
                                        <p className="text-xs text-slate-500 mt-1">{csvFile?.name || 'No file selected'}</p>
                                    </label>
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end mt-4">
                                <button
                                    onClick={() => {
                                        setShowBulkModal(false);
                                        setCsvFile(null);
                                    }}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                                    Cancel
                                </button>
                                <button
                                    onClick={handleBulkUpload}
                                    disabled={addLoading || !csvFile}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
                                    {addLoading ? 'Uploading...' : 'Upload'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ManagerLayout >
    );
}