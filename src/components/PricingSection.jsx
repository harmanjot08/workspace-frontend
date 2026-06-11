import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function PricingSection() {
    const plans = [
        {
            name: "Free",
            price: "$0",
            description: "For small teams getting started",
            features: ["Up to 10 users", "Basic chat", "Calendar", "Community support"],
            popular: false
        },
        {
            name: "Pro",
            price: "$99",
            description: "For growing teams",
            features: ["Up to 100 users", "All features", "Advanced analytics", "Priority support"],
            popular: true
        },
        {
            name: "Enterprise",
            price: "Custom",
            description: "For large organizations",
            features: ["Unlimited users", "Custom features", "Dedicated support", "SLA guarantee"],
            popular: false
        }
    ];
    return (
        <section id="pricing" className="py-24 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-slate-900 mb-4">Simple, transparent pricing</h2>
                    <p className="text-lg text-slate-600">Choose the plan that fits your team</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {plans.map((plan, idx) => (
                        <div
                            key={idx}
                            className={`p-8 rounded-xl border transition ${plan.popular
                                ? 'border-blue-600 bg-blue-50 shadow-xl'
                                : 'border-slate-200 hover:border-slate-300'
                                }`}>
                            {plan.popular && (
                                <div className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full mb-4">
                                    Most Popular
                                </div>
                            )}
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                            <p className="text-slate-600 text-sm mb-4">{plan.description}</p>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                                {plan.price !== "Custom" && <span className="text-slate-600">/month</span>}
                            </div>
                            <Link
                                to="/register"
                                className={`w-full py-2 rounded-lg font-medium transition block text-center mb-8 ${plan.popular
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'border border-slate-300 text-slate-900 hover:bg-slate-50'
                                    }`}>
                                Get started
                            </Link>
                            <ul className="space-y-3">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-600 text-sm">
                                        <Check className="w-4 h-4 text-green-600" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}