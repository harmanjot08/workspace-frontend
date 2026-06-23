import ManagerNavbar from './ManagerNavbar';
import ManagerSidebar from '../components/ManagerSidebar';

export default function ManagerLayout({ children }) {
    return (
        <div className="bg-slate-100 min-h-screen">
            <ManagerNavbar />
            <ManagerSidebar />
            <main className="ml-64 p-8 pt-20">
                {children}
            </main>
        </div>
    );
}