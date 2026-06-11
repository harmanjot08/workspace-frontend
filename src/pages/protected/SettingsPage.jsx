import { useState, useEffect } from 'react';
import ManagerLayout from '../../components/ManagerLayout';
import CompanySettings from '../../components/CompanySettings';
import ManagerProfile from '../../components/ManagerProfile';
import NotificationSettings from '../../components/NotificationSettings';
import SecuritySettings from '../../components/SecuritySettings';

export default function SettingsPage() {
    const [managerData, setManagerData] = useState(null);
    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        chatNotifications: true,
        taskReminders: true,
        meetingReminders: true,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setManagerData({
                id: user.id,
                name: user.name,
                email: user.email,
                jobTitle: user.jobTitle || 'Manager',
                phone: user.phone || '+91 98765 43210',
                department: user.department || 'Management',
            });
        }
        setLoading(false);
    }, []);

    const handleManagerSave = (data) => {
        setManagerData(data);
        // Save to localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        localStorage.setItem('user', JSON.stringify({ ...user, ...data }));
    };

    const handleNotificationChange = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (loading) {
        return <ManagerLayout><div className="p-8">Loading...</div></ManagerLayout>;
    }

    return (
        <ManagerLayout>
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-slate-900 mb-1">Settings</h1>
                <p className="text-slate-600 mb-8">Manage your account and settings</p>
                <div className="space-y-8">
                    {managerData && <ManagerProfile data={managerData} onSave={handleManagerSave} />}
                    <NotificationSettings data={notifications} onChange={handleNotificationChange} />
                    <SecuritySettings />
                </div>
            </div>
        </ManagerLayout>
    );
}