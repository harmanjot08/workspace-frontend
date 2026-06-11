import Manager Navbar from './Manager Navbar';
import ManagerSidebar from './ManagerSidebar';
export default function ManagerLayout({ children }) {
    return (
        <div className="bg-slate-100 min-h-screen">
            <Manager Navbar />
            <ManagerSidebar />
            <main className="ml-64 mt-20 p-8">
                {children}
            </main>
        </div>
    );
}