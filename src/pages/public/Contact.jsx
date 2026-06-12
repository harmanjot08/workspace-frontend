import Navbar from '../../components/Navbar';
import ContactPage from '../../components/ContactPage';

export default function Contact() {
    return (
        <div className="bg-white min-h-screen">
            <Navbar />
            <div className="py-16 bg-slate-50">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">Contact us</h1>
                        <p className="text-lg text-slate-600">Have questions? We'd love to hear from you.</p>
                    </div>
                    <ContactPage />
                </div>
            </div>
        </div>
    );
}