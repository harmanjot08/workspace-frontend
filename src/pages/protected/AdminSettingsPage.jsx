import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Lock, Bell, Shield } from 'lucide-react';

export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState('security');
    const [settings, setSettings] = useState({
        emailNotifications: true,
        systemAlerts: true,
        weeklyReport: true,
        subscriptionAlerts: true,
        userActivityAlerts: true,
        maintenanceAlerts: true,
        twoFactorAuth: false,
    });
    const [passwordData, setPasswordData] = useState({
        current: '',
        new: '',
        confirm: '',
    });
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('accessToken');

    const handleSettingChange = (key) => {
        setSettings(prev => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwordData.new !== passwordData.confirm) {
            alert('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
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

    return (
        <AdminLayout>
            <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">Settings</h1>
                <p className="text-slate-600 mb-8">Manage platform settings and preferences</p>

                <div className="flex gap-4 mb-8 border-b border-slate-200">
                    {[
                        { id: 'security', label: 'Security', icon: Shield },
                        { id: 'notifications', label: 'Notifications', icon: Bell },
                    ].map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-3 border-b-2 font-medium transition flex items-center gap-2 ${activeTab === tab.id
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-slate-600 hover:text-slate-900'
                                    }`}>
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Security Tab */}
                {activeTab === 'security' && (
                    <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-2xl">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Lock className="w-6 h-6" />
                            Security Settings
                        </h2>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div>
                                    <p className="font-semibold text-slate-900">Two-Factor Authentication</p>
                                    <p className="text-sm text-slate-600">Add an extra layer of security</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.twoFactorAuth}
                                        onChange={() => handleSettingChange('twoFactorAuth')}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <form onSubmit={handlePasswordChange} className="space-y-4 pt-4 border-t border-slate-200">
                                <h3 className="font-semibold text-slate-900">Change Admin Password</h3>
                                <div>
                                    <label className="block text-slate-700 text-sm font-semibold mb-2">Current Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.current}
                                        onChange={e => setPasswordData({ ...passwordData, current: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                                        disabled={loading}
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-700 text-sm font-semibold mb-2">New Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.new}
                                        onChange={e => setPasswordData({ ...passwordData, new: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                                        disabled={loading}
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-700 text-sm font-semibold mb-2">Confirm Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.confirm}
                                        onChange={e => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                                        disabled={loading}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                                    disabled={loading}>
                                    {loading ? 'Updating...' : 'Update Password'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                    <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-2xl">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Bell className="w-6 h-6" />
                            Notification Settings
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div>
                                    <p className="font-semibold text-slate-900">Email Notifications</p>
                                    <p className="text-sm text-slate-600">Receive email updates on important events</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.emailNotifications}
                                        onChange={() => handleSettingChange('emailNotifications')}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div>
                                    <p className="font-semibold text-slate-900">System Alerts</p>
                                    <p className="text-sm text-slate-600">Get alerts for critical system issues</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.systemAlerts}
                                        onChange={() => handleSettingChange('systemAlerts')}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div>
                                    <p className="font-semibold text-slate-900">Weekly Report</p>
                                    <p className="text-sm text-slate-600">Receive weekly platform analytics report</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.weeklyReport}
                                        onChange={() => handleSettingChange('weeklyReport')}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div>
                                    <p className="font-semibold text-slate-900">Subscription Alerts</p>
                                    <p className="text-sm text-slate-600">Get notified about subscription renewals</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.subscriptionAlerts}
                                        onChange={() => handleSettingChange('subscriptionAlerts')}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div>
                                    <p className="font-semibold text-slate-900">User Activity Alerts</p>
                                    <p className="text-sm text-slate-600">Track new user registrations and logins</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.userActivityAlerts}
                                        onChange={() => handleSettingChange('userActivityAlerts')}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div>
                                    <p className="font-semibold text-slate-900">Maintenance Alerts</p>
                                    <p className="text-sm text-slate-600">Get notified about system maintenance</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.maintenanceAlerts}
                                        onChange={() => handleSettingChange('maintenanceAlerts')}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}