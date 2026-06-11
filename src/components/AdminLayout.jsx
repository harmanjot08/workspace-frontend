import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
export default function AdminLayout({ children }) {
    return (
        <div className="bg-slate-100 min-h-screen">
            <AdminNavbar />
            <AdminSidebar />
            <main className="ml-64 mt-20 p-8">
                {children}
            </main>
        </div>
    );
}