import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, Calendar, CheckSquare, MessageSquare, Settings } from 'lucide-react';

export default function ManagerSidebar({ activeSection, onSelectSection }) {
    const menuItems = [
        {
            icon: LayoutDashboard,
            label: 'Overview',
            id: 'overview',
        },
        {
            icon: Users,
            label: 'Users',
            id: 'users',
        },
        {
            icon: Briefcase,
            label: 'Roles',
            id: 'roles',
        },
        {
            icon: Calendar,
            label: 'Calendar',
            id: 'calendar',
        },
        {
            icon: CheckSquare,
            label: 'Tasks',
            id: 'tasks',
        },
        {
            icon: MessageSquare,
            label: 'Chat Groups',
            id: 'chat',
        },
        {
            icon: Settings,
            label: 'Settings',
            id: 'settings',
        }
    ];

    return (
        <aside className="fixed left-0 top-20 bottom-0 w-64 bg-slate-50 border-r border-slate-200 overflow-y-auto">
            <div className="p-6">
                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = activeSection === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => onSelectSection(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${active
                                    ? 'bg-blue-100 text-blue-600 font-semibold'
                                    : 'text-slate-700 hover:bg-slate-200'
                                    }`}>
                                <Icon className="w-5 h-5" />
                                <span className="flex-1">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}