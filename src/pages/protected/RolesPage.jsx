import { useState, useEffect } from 'react';
import ManagerLayout from '../../components/ManagerLayout';
import { Plus, Trash2, UserPlus, UserMinus } from 'lucide-react';
import { roleAPI } from '../../api/roleApi.js';

export default function RolesPage() {
    const [roles, setRoles] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [newRoleName, setNewRoleName] = useState('');
    const [newRoleDesc, setNewRoleDesc] = useState('');

    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        fetchRoles();
        fetchUsers();
    }, []);

    const fetchRoles = async () => {
        try {
            const response = await roleAPI.getRoles(token);
            if (response.roles) setRoles(response.roles);
        } catch (err) {
            console.error('fetchRoles error:', err);
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

    const handleCreateRole = async () => {
        if (!newRoleName.trim()) return;
        const response = await roleAPI.createRole(token, {
            name: newRoleName,
            description: newRoleDesc,
        });
        if (response.role) {
            setRoles(prev => [...prev, { ...response.role, userRoles: [] }]);
            setNewRoleName('');
            setNewRoleDesc('');
            setShowCreateModal(false);
        }
    };

    const handleDeleteRole = async (roleId) => {
        if (!confirm('Delete this role?')) return;
        await roleAPI.deleteRole(token, roleId);
        setRoles(prev => prev.filter(r => r.id !== roleId));
    };

    const handleAssignUser = async (userId) => {
        if (!selectedRole) return;
        const response = await roleAPI.assignUser(token, selectedRole.id, userId);
        if (response.userRole) {
            const user = users.find(u => u.id === userId);
            setRoles(prev => prev.map(r => {
                if (r.id === selectedRole.id) {
                    return {
                        ...r,
                        userRoles: [...r.userRoles, { user }]
                    };
                }
                return r;
            }));
            setShowAssignModal(false);
        }
    };

    const handleRemoveUser = async (roleId, userId) => {
        await roleAPI.removeUser(token, roleId, userId);
        setRoles(prev => prev.map(r => {
            if (r.id === roleId) {
                return {
                    ...r,
                    userRoles: r.userRoles.filter(ur => ur.user.id !== userId)
                };
            }
            return r;
        }));
    };

    if (loading) return (
        <ManagerLayout>
            <div className="p-8">Loading...</div>
        </ManagerLayout>
    );

    return (
        <ManagerLayout>
            <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">Roles & Classifications</h1>
                <p className="text-slate-600 mb-8">Manage functional roles for your team</p>

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Functional Roles</h2>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium">
                        <Plus className="w-4 h-4" />
                        Create Role
                    </button>
                </div>

                {roles.length === 0 ? (
                    <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
                        No roles created yet. Create your first role!
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {roles.map(role => (
                            <div key={role.id} className="bg-white rounded-xl border border-slate-200 p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">{role.name}</h3>
                                        {role.description && (
                                            <p className="text-sm text-slate-500 mt-1">{role.description}</p>
                                        )}
                                        <p className="text-sm text-slate-400 mt-1">{role.userRoles.length} users</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => { setSelectedRole(role); setShowAssignModal(true); }}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 text-sm font-medium">
                                            <UserPlus className="w-4 h-4" />
                                            Assign
                                        </button>
                                        <button
                                            onClick={() => handleDeleteRole(role.id)}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm font-medium">
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                {role.userRoles.length > 0 && (
                                    <div className="border-t border-slate-100 pt-4">
                                        <p className="text-xs text-slate-500 mb-2 font-medium">Assigned Users</p>
                                        <div className="flex flex-wrap gap-2">
                                            {role.userRoles.map(ur => (
                                                <div key={ur.user.id} className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg">
                                                    <span className="text-sm text-slate-700">{ur.user.name}</span>
                                                    <button
                                                        onClick={() => handleRemoveUser(role.id, ur.user.id)}
                                                        className="text-slate-400 hover:text-red-500">
                                                        <UserMinus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Create Role Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Create New Role</h3>
                            <input
                                type="text"
                                placeholder="Role name"
                                value={newRoleName}
                                onChange={(e) => setNewRoleName(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-3 focus:outline-none focus:border-blue-500"
                            />
                            <input
                                type="text"
                                placeholder="Description (optional)"
                                value={newRoleDesc}
                                onChange={(e) => setNewRoleDesc(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-4 focus:outline-none focus:border-blue-500"
                            />
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateRole}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    Create
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Assign User Modal */}
                {showAssignModal && selectedRole && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">
                                Assign User to "{selectedRole.name}"
                            </h3>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {users
                                    .filter(u => !selectedRole.userRoles.find(ur => ur.user.id === u.id))
                                    .map(user => (
                                        <button
                                            key={user.id}
                                            onClick={() => handleAssignUser(user.id)}
                                            className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-lg border border-slate-200">
                                            <p className="font-medium text-slate-900">{user.name}</p>
                                            <p className="text-sm text-slate-500">{user.email}</p>
                                        </button>
                                    ))}
                            </div>
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={() => setShowAssignModal(false)}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ManagerLayout>
    );
}