import { MessageSquare, Calendar, Users, BarChart3, Lock, Zap } from 'lucide-react';
export default function FeaturesSection() {
    const features = [
        {
            icon: MessageSquare,
            title: "Real-Time Chat",
            description: "Instant messaging with 1-on-1 and group conversations. Reactions, threading, and file sharing built-in."
        },
        {
            icon: Calendar,
            title: "Calendar & Meetings",
            description: "Schedule meetings, set reminders, and coordinate with your team. Integrates with your calendar."
        },
        {
            icon: Users,
            title: "User Management",
            description: "Bulk invite team members, set roles, and organize by departments. Auto-send login credentials."
        },
        {
            icon: BarChart3,
            title: "Analytics & Insights",
            description: "Track team activity, growth metrics, and productivity analytics in real-time dashboards."
        },
        {
            icon: Lock,
            title: "Enterprise Security",
            description: "End-to-end encryption, role-based access control, and compliance with industry standards."
        },
        {
            icon: Zap,
            title: "Lightning Fast",
            description: "Optimized for speed with instant syncing across all devices. No lag, no delays."
        }
    ];
    return (
        <section id="features" className="py-24 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-slate-900 mb-4">Powerful features, simple design</h2>
                    <p className="text-lg text-slate-600">Everything you need to collaborate effectively</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                            <div key={idx} className="p-8 border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                    <Icon className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}