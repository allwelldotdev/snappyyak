import { Container } from '../ui/Container';
import { Button } from '../ui/Button';

export const CTA = () => {
    return (
        <section className="py-32 bg-white">
            <Container>
                <div className="bg-brand-dark rounded-[40px] p-12 md:p-24 text-center relative overflow-hidden">
                    {/* Background Accent */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-3xl bg-brand-orange opacity-20 blur-[100px] rounded-full pointer-events-none"></div>

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">
                            Don't Let Time Slips Hold Your Team Back.
                        </h2>
                        <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                            Unlock SnappyYak's privacy-first intelligence now. Reclaim hours, balance workloads, and lead with confidence.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="px-12">Start Your Free Trial</Button>
                            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-brand-dark">Schedule Demo</Button>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};
