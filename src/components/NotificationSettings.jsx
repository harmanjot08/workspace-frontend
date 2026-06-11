import { Bell } from 'lucide-react';
export default function NotificationSettings({ data, onChange }) {
    const settings = [
        { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive email updates' },
        { key: 'chatNotifications', label: 'Chat Notifications', description: 'Get notified for new messages' },
        { key: 'taskReminders', label: 'Task Reminders', description: 'Remind about pending tasks' },
        { key: 'meetingReminders', label: 'Meeting Reminders', description: 'Notify before meetings' },
    ];
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-6">
                <Bell className="w-5 h-5 text-purple-600" />
                <h2 className="text-2xl font-bold text-slate-900">Notification Settings</h2>
            </div>
            <div className="space-y-4">
                {settings.map(setting => (
                    <div key={setting.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div>
                            <p className="font-semibold text-slate-900">{setting.label}</p>
                            <p className="text-sm text-slate-600">{setting.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data[setting.key]}
                                onChange={() => onChange(setting.key)}
                                className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}