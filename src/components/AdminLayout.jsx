import Admin Navbar from './Admin Navbar';
import AdminSidebar from './AdminSidebar';
export default function AdminLayout({ children }) {
    return (
        <div className="bg-slate-100 min-h-screen">
            <Admin Navbar />
            <AdminSidebar />
            <main className="ml-64 mt-20 p-8">
                {children}
            </main>
        </div>
    );
}