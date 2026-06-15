import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
export default function Footer() {
    const currentYear = new Date().getFullYear();
    const features = [
        { label: 'Real-Time Chat', href: '#features' },
        { label: 'Calendar & Meetings', href: '#features' },
        { label: 'User Management', href: '#features' },
        { label: 'Analytics & Insights', href: '#features' },
        { label: 'Enterprise Security', href: '#features' },
        { label: 'Lightning Fast', href: '#features' },
    ];
    const company = [
        { label: 'About Us', href: '/about', isLink: true },
        { label: 'Contact', href: '/contact', isLink: true },
    ];
    const legal = [
        { label: 'Privacy Policy', href: '/privacy', isLink: true },
        { label: 'Terms of Service', href: '/terms', isLink: true },
    ];
    return (
        <footer className="bg-slate-900 text-slate-400">
            {/* Main Footer */}
            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                <Zap className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">Workspace</span>
                        </Link>
                        <p className="text-sm leading-relaxed mb-6">
                            The all-in-one platform for teams to chat, collaborate, and grow together.
                        </p>
                    </div>
                    {/* Features */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Features</h3>
                        <ul className="space-y-3">
                            {features.map((item) => (
                                <li key={item.label}>
                                    <a href={item.href}
                                        className="text-sm hover:text-white transition">
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Company */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Company</h3>
                        <ul className="space-y-3">
                            {company.map((item) => (
                                <li key={item.label}>
                                    <Link to={item.href}
                                        className="text-sm hover:text-white transition">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Legal */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Legal</h3>
                        <ul className="space-y-3">
                            {legal.map((item) => (
                                <li key={item.label}>
                                    <Link to={item.href}
                                        className="text-sm hover:text-white transition">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            {/* Bottom Bar */}
            <div className="border-t border-slate-800">
                <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm">© {currentYear} Workspace. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}