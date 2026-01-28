import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { Check } from 'lucide-react';

export const PricingTeaser = () => {
    return (
        <section className="py-24" id="pricing">
            <Container>
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-heading font-bold text-brand-dark mb-4">Start Free—Scale Smart</h2>
                    <p className="text-xl text-text-body">Simple pricing for teams of all sizes.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* Free */}
                    <div className="p-8 rounded-[30px] border border-gray-100 flex flex-col items-center">
                        <h3 className="text-2xl font-heading font-bold text-brand-dark mb-2">Free</h3>
                        <div className="text-4xl font-bold mb-6">$0</div>
                        <ul className="mb-8 space-y-3 w-full">
                            <li className="flex gap-2 text-text-body"><Check className="text-brand-orange w-5" /> Up to 5 users</li>
                            <li className="flex gap-2 text-text-body"><Check className="text-brand-orange w-5" /> Core insights</li>
                        </ul>
                        <Button variant="outline" fullWidth>Get Started</Button>
                    </div>

                    {/* Pro - Featured */}
                    <div className="p-8 rounded-[30px] border-2 border-brand-orange bg-orange-50/30 flex flex-col items-center relative transform md:-translate-y-4 shadow-xl">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-orange text-black px-4 py-1 rounded-full text-sm font-bold">MOST POPULAR</div>
                        <h3 className="text-2xl font-heading font-bold text-brand-dark mb-2">Pro</h3>
                        <div className="text-4xl font-bold mb-6">$8<span className="text-lg font-normal text-text-muted">/mo</span></div>
                        <ul className="mb-8 space-y-3 w-full">
                            <li className="flex gap-2 text-text-body"><Check className="text-brand-orange w-5" /> Everything in Free</li>
                            <li className="flex gap-2 text-text-body"><Check className="text-brand-orange w-5" /> Full workloads</li>
                            <li className="flex gap-2 text-text-body"><Check className="text-brand-orange w-5" /> Integrations</li>
                        </ul>
                        <Button fullWidth>Start Free Trial</Button>
                    </div>

                    {/* Enterprise */}
                    <div className="p-8 rounded-[30px] border border-gray-100 flex flex-col items-center">
                        <h3 className="text-2xl font-heading font-bold text-brand-dark mb-2">Enterprise</h3>
                        <div className="text-4xl font-bold mb-6">Custom</div>
                        <ul className="mb-8 space-y-3 w-full">
                            <li className="flex gap-2 text-text-body"><Check className="text-brand-orange w-5" /> Advanced analytics</li>
                            <li className="flex gap-2 text-text-body"><Check className="text-brand-orange w-5" /> Dedicated support</li>
                        </ul>
                        <Button variant="outline" fullWidth>Contact Sales</Button>
                    </div>
                </div>
            </Container>
        </section>
    );
};
