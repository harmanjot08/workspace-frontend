import { useState, useEffect } from 'react';
import DashboardOverview from '../../components/DashboardOverview';
import UserTasksPage from '../../components/UserTasksPage';
import UserCalendarPage from '../../components/UserCalendarPage';
import UserChatPage from '../../components/UserChatPage';
import UserProfilePage from '../../components/UserProfilePage';
import { LayoutDashboard, CheckSquare, Calendar, MessageSquare, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UserDashboard() {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('dashboard');
    const [tasks, setTasks] = useState([]);
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);

    // Get user from localStorage
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);

            // Set profile from user data
            setProfile({
                id: parsedUser.id,
                name: parsedUser.name,
                email: parsedUser.email,
                phone: parsedUser.phone || '+91 98765 43210',
                role: parsedUser.role,
                department: parsedUser.department || 'Engineering',
                manager: parsedUser.manager || 'Manager',
                joinedDate: parsedUser.joinedDate || '2024-01-15',
                status: 'active',
            });
        }
    }, []);

    useEffect(() => {
        const fetchUserTasks = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const res = await fetch('https://workspace-backend-pyb2.onrender.com/api/tasks/my-tasks', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                const data = await res.json();
                if (data.tasks) setTasks(data.tasks);
            } catch (err) {
                console.error('fetchTasks error:', err);
            }
        };
        if (user) fetchUserTasks();
    }, [user]);

    const menuItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
        { id: 'calendar', icon: Calendar, label: 'Calendar' },
        { id: 'chat', icon: MessageSquare, label: 'Chat' },
        { id: 'profile', icon: User, label: 'Profile' },
    ];

    const handleUpdateTask = (taskId, newStatus) => {
        setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    };

    const handleUpdateProfile = (updatedProfile) => {
        setProfile(updatedProfile);
    };

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            await fetch('https://workspace-backend-pyb2.onrender.com/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            navigate('/login');
        }
    };

    const renderSection = () => {
        switch (activeSection) {
            case 'dashboard':
                return <DashboardOverview tasks={tasks} meetings={[]} userName={user?.name} />;
            case 'tasks':
                return <UserTasksPage tasks={tasks} onUpdateTask={handleUpdateTask} />;
            case 'calendar':
                return <UserCalendarPage meetings={[]} tasks={[]} />;
            case 'chat':
                return <UserChatPage />;
            case 'profile':
                return profile ? <UserProfilePage profile={profile} onUpdateProfile={handleUpdateProfile} /> : null;
            default:
                return <DashboardOverview tasks={[]} meetings={[]} userName={user?.name} />;
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex h-screen bg-slate-100">
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
                <div className="p-6 border-b border-slate-200">
                    <h1 className="text-2xl font-bold text-slate-900">Workspace</h1>
                    <p className="text-sm text-slate-600 mt-2">{user.name}</p>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map(item => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeSection === item.id
                                    ? 'bg-blue-100 text-blue-600 font-semibold'
                                    : 'text-slate-700 hover:bg-slate-100'
                                    }`}>
                                <Icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-slate-200">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium">
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
            <main className="flex-1 overflow-auto">
                <div className={activeSection === 'chat' ? 'h-full' : 'p-8'}>
                    {renderSection()}
                </div>
            </main>
        </div>
    );
}