import Navbar from "../../components/Navbar"
import HeroSection from '../../components/HeroSection';
import FeaturesSection from '../../components/FeaturesSection';
import HowItWorks from '../../components/HowItWorks';
import PricingSection from '../../components/PricingSection';
import CTASection from '../../components/CTASection';

export default function Landing() {
    return (
        <div className="bg-white">
            < Navbar />
            <HeroSection />
            <FeaturesSection />
            <HowItWorks />
            <PricingSection />
            <CTASection />
        </div>
    );
}