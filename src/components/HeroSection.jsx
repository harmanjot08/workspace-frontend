import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
export default function HeroSection() {
    return (
        <section className="pt-32 pb-20 bg-gradient-to-b from-slate-50 to-white">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-6">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-600 font-medium">The complete team workspace</span>
                    </div>
                    <h1 className="text-6xl font-bold text-slate-900 mb-6 leading-tight">
                        Everything your team needs, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">in one place</span>
                    </h1>
                    <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                        Chat, schedule meetings, manage tasks, and collaborate in real-time. Built for teams that want to get things done.
                    </p>
                    <div className="flex gap-4 justify-center mb-12">
                        { /* when the user will click "get started free" , it will navigate to register page. */}
                        <Link to="/register" className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2">
                            Get started free  
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        
                    </div>
                    <p className="text-sm text-slate-500">
                        No credit card required - Free forever plan available
                    </p>
                </div>
            </div>
        </section>
    );
}