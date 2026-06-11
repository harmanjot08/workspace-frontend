import { useState, useEffect } from 'react';
import { User, Mail, Phone, Building2, Calendar, Lock } from 'lucide-react';

export default function UserProfilePage() {
    const [profile, setProfile] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState(null);
    const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            const profileData = {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone || '+91 98765 43210',
                role: user.role,
                department: user.department || 'Engineering',
                manager: user.manager || 'Manager',
                joinedDate: user.joinedDate || '2024-01-15',
                status: 'active',
            };
            setProfile(profileData);
            setFormData(profileData);
            setLoading(false);
        }
    }, []);

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Update localStorage
            const user = JSON.parse(localStorage.getItem('user'));
            localStorage.setItem('user', JSON.stringify({ ...user, ...formData }));
            setProfile(formData);
            setEditMode(false);
        } catch (err) {
            console.error('Save profile error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) {
            alert('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            // Password change API call (backend endpoint needed)
            const response = await fetch('http://localhost:5000/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentPassword: passwordData.current,
                    newPassword: passwordData.new,
                }),
            });

            if (response.ok) {
                alert('Password updated successfully!');
                setPasswordData({ current: '', new: '', confirm: '' });
            } else {
                alert('Failed to update password');
            }
        } catch (err) {
            console.error('Password change error:', err);
            alert('Error changing password');
        } finally {
            setLoading(false);
        }
    };

    if (!profile) return <div className="p-8">Loading...</div>;

    return (
        <div className="max-w-2xl">
            <h1 className="text-4xl font-bold text-slate-900 mb-1">My Profile</h1>
            <p className="text-slate-600 mb-8">View and manage your profile</p>

            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Profile Information</h2>
                    <button
                        onClick={() => setEditMode(!editMode)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                        {editMode ? 'Cancel' : 'Edit'}
                    </button>
                </div>

                {editMode ? (
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-slate-700 text-sm font-semibold mb-2">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <label className="block text-slate-700 text-sm font-semibold mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full px-4 py-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-600"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-700 text-sm font-semibold mb-2">Phone</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <label className="block text-slate-700 text-sm font-semibold mb-2">Department</label>
                                <input
                                    type="text"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
                            disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                            <User className="w-5 h-5 text-slate-600" />
                            <div>
                                <p className="text-sm text-slate-600">Name</p>
                                <p className="font-semibold text-slate-900">{profile.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                            <Mail className="w-5 h-5 text-slate-600" />
                            <div>
                                <p className="text-sm text-slate-600">Email</p>
                                <p className="font-semibold text-slate-900">{profile.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                            <Phone className="w-5 h-5 text-slate-600" />
                            <div>
                                <p className="text-sm text-slate-600">Phone</p>
                                <p className="font-semibold text-slate-900">{profile.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                            <Building2 className="w-5 h-5 text-slate-600" />
                            <div>
                                <p className="text-sm text-slate-600">Department</p>
                                <p className="font-semibold text-slate-900">{profile.department}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                            <User className="w-5 h-5 text-slate-600" />
                            <div>
                                <p className="text-sm text-slate-600">Role</p>
                                <p className="font-semibold text-slate-900">{profile.role}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Lock className="w-6 h-6" />
                    Change Password
                </h2>
                <form onSubmit={handleChangePassword} className="space-y-4 max-w-sm">
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">Current Password</label>
                        <input
                            type="password"
                            value={passwordData.current}
                            onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">New Password</label>
                        <input
                            type="password"
                            value={passwordData.new}
                            onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label className="block text-slate-700 text-sm font-semibold mb-2">Confirm Password</label>
                        <input
                            type="password"
                            value={passwordData.confirm}
                            onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                            disabled={loading}
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50"
                        disabled={loading}>
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}