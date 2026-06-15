import { Link } from 'react-router-dom';
import { Zap, Target, Users, Heart } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
export default function AboutUs() {
    const values = [
        {
            icon: Target,
            title: 'Our Mission',
            description: 'To simplify how teams communicate and collaborate - giving every company, big or small, the tools to work smarter together.',
        },
        {
            icon: Users,
            title: 'Built for Teams',
            description: 'Workspace is designed from the ground up for teams that need structure, speed, and simplicity - without the bloat.',
        },
        {
            icon: Heart,
            title: 'People First',
            description: 'We believe great software should feel effortless. Every feature we build is driven by real user needs, not trends.',
        },
    ];
    return (
        <div className="bg-white">
            <Navbar />
            {/* Hero */}
            <section className="pt-32 pb-16 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-sm font-medium mb-6">
                        <Zap className="w-4 h-4" />
                        About Workspace
                    </div>
                    <h1 className="text-5xl font-bold text-slate-900 mb-6">
                        We're building the future of teamwork
                    </h1>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Workspace started with a simple idea - teams deserve better tools.
                        Tools that are fast, focused, and actually enjoyable to use every day.
                    </p>
                </div>
            </section>
            {/* Values */}
            <section className="py-16 px-6 bg-slate-50">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">What we stand for</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {values.map((value) => {
                            const Icon = value.icon;
                            return (
                                <div key={value.title} className="bg-white p-8 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                        <Icon className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">{value.title}</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">{value.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
            {/* Story */}
            <section className="py-16 px-6">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6">Our story</h2>
                    <div className="space-y-4 text-slate-600 leading-relaxed">
                        <p>
                            We saw teams struggling with too many disconnected tools - one app for chat, another for tasks, another for meetings.
                            Important things kept falling through the cracks.
                        </p>
                        <p>
                            So we built Workspace - a single platform where managers can onboard their entire team,
                            communicate in real-time, schedule meetings, and track everything from one dashboard.
                        </p>
                        <p>
                            Today, companies across industries use Workspace to run their daily operations with clarity and confidence.
                        </p>
                    </div>
                </div>
            </section>
            {/* CTA */}
            <section className="py-16 px-6 bg-gradient-to-b from-white to-slate-50">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to get started?</h2>
                    <p className="text-slate-600 mb-8">Join teams already using Workspace to collaborate smarter.</p>
                    <div className="flex gap-4 justify-center">
                        <Link to="/register"
                            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition">
                            Get Started Free
                        </Link>
                        <Link to="/contact"
                            className="px-8 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-semibold transition">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}