import ManagerNavbar from './ManagerNavbar';
import ManagerSidebar from './ManagerSidebar';
export default function ManagerLayout({ children }) {
    return (
        <div className="bg-slate-100 min-h-screen">
            <ManagerNavbar />
            <ManagerSidebar />
            <main className="ml-64 mt-20 p-8">
                {children}
            </main>
        </div>
    );
}