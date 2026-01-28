import { Navbar } from '../components/layout/Navbar';
import { Hero } from '../components/sections/Hero';
import { Benefits } from '../components/sections/Benefits';
import { Features } from '../components/sections/Features';
import { Integrations } from '../components/sections/Integrations';
import { Testimonials } from '../components/sections/Testimonials';
import { PricingTeaser } from '../components/sections/PricingTeaser';
import { CTA } from '../components/sections/CTA';
import { Footer } from '../components/layout/Footer';

export const Home = () => {
    return (
        <div className="min-h-screen flex flex-col font-body">
            <Navbar />
            <main className="flex-grow">
                <Hero />
                <Benefits />
                <Features />
                <Integrations />
                <Testimonials />
                <PricingTeaser />
                <CTA />
            </main>
            <Footer />
        </div>
    );
};
