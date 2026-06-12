import Navbar from "../../components/Navbar"
import HeroSection from '../../components/HeroSection';
import FeaturesSection from '../../components/FeaturesSection';
import HowItWorks from '../../components/HowItWorks';
import PricingSection from '../../components/PricingSection';
import CTASection from '../../components/CTASection';
import ContactPage from '../../components/ContactPage.jsx';

export default function Landing() {
    return (
        <div className="bg-white">
            <Navbar />
            <HeroSection />
            <FeaturesSection />
            <HowItWorks />
            <PricingSection />

            {/* Contact Section */}
            <section id="contact" className="py-16 bg-slate-50">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-8 text-slate-900">Get In Touch</h2>
                    <ContactPage />
                </div>
            </section>

            <CTASection />
        </div>
    );
}