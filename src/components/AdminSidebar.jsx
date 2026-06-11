import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Building2, CreditCard, Settings, Users, DollarSign } from 'lucide-react';
export default function AdminSidebar() {
    const location = useLocation();
    const menuItems = [
        {
            icon: BarChart3,
            label: 'Dashboard',
            path: '/admin',
            badge: null
        },
        {
            icon: Building2,
            label: 'Companies',
            path: '/admin/companies',
            badge: null
        },
        {
            icon: Users,
            label: 'Revenue Analytics',
            path: '/admin/analytics',
            badge: null
        },
        {
            icon: CreditCard,
            label: 'Subscriptions',
            path: '/admin/subscriptions',
            badge: null
        },
        {
            icon: Settings,
            label: 'Settings',
            path: '/admin/settings',
            badge: null
        },
        {
            icon: DollarSign,
            label: 'Pricing',
            path: '/admin/pricing',
        }
    ];
    const isActive = (path) => location.pathname === path;
    return (
        <aside className="fixed left-0 top-20 bottom-0 w-64 bg-slate-50 border-r border-slate-200 overflow-y-auto">
            <div className="p-6">
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
                                    }`}>
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