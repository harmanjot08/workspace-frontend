import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
export default function CTASection() {
    return (
        <section className="py-24 bg-slate-50">
            <div className="max-w-2xl mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold text-slate-900 mb-6">
                    Ready to transform how your team works?
                </h2>
                <p className="text-lg text-slate-600 mb-8">
                    Join teams that are already collaborating smarter with Workspace.
                </p>
                <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold">
                    Start your free workspace
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
        </section>
    );
}