import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    Calendar,
    CheckSquare,
    MessageSquare,
    Mail,
    Settings,
} from 'lucide-react';

export default function ManagerSidebar() {
    const location = useLocation();

    const menuItems = [
        {
            icon: LayoutDashboard,
            label: 'Overview',
            path: '/manager',
            badge: null,
        },
        {
            icon: Users,
            label: 'Users',
            path: '/manager/users',
            badge: null,
        },
        {
            icon: Briefcase,
            label: 'Roles',
            path: '/manager/roles',
            badge: null,
        },
        {
            icon: Calendar,
            label: 'Calendar',
            path: '/manager/calendar',
            badge: null,
        },
        {
            icon: CheckSquare,
            label: 'Tasks',
            path: '/manager/tasks',
            badge: null,
        },
        {
            icon: MessageSquare,
            label: 'Chat Groups',
            path: '/manager/chat',
            badge: null,
        },
        {
            icon: Mail,
            label: 'Emails',
            path: '/manager/emails',
            badge: null
        },
        {
            icon: Settings,
            label: 'Settings',
            path: '/manager/settings',
            badge: null,
        },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <aside className="fixed left-0 top-16 bottom-0 w-64 bg-slate-50 border-r border-slate-200 overflow-y-auto">
            <div className="px-6 pt-2 pb-6">
                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${active
                                    ? 'bg-blue-100 text-blue-600 font-semibold'
                                    : 'text-slate-700 hover:bg-slate-200'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="flex-1">{item.label}</span>

                                {item.badge && (
                                    <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full font-bold">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}