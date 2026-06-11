import { ArrowRight } from 'lucide-react';
export default function HowItWorks() {
    const steps = [
        {
            number: "1",
            title: "Create Workspace",
            description: "Sign up and set up your team workspace in minutes"
        },
        {
            number: "2",
            title: "Invite Team",
            description: "Add team members with bulk import or manual invite"
        },
        {
            number: "3",
            title: "Start Collaborating",
            description: "Use chat, calendar, and tasks right away"
        },
        {
            number: "4",
            title: "Grow & Scale",
            description: "Analytics show how your team grows over time"
        }
    ];
    return (
        <section id="how-it-works" className="py-24 bg-slate-50">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-slate-900 mb-4">How it works</h2>
                    <p className="text-lg text-slate-600">Get your team up and running in four simple steps</p>
                </div>
                <div className="grid md:grid-cols-4 gap-4">
                    {steps.map((step, idx) => (
                        <div key={idx} className="relative">
                            <div className="bg-white p-8 rounded-xl border border-slate-200">
                                <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold mb-4">
                                    {step.number}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                                <p className="text-slate-600 text-sm">{step.description}</p>
                            </div>
                            {idx < steps.length - 1 && (
                                <div className="hidden md:flex absolute top-16 -right-4 w-4 h-4 items-center justify-center">
                                    <ArrowRight className="w-5 h-5 text-slate-300" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}