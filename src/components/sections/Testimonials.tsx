import { Container } from '../ui/Container';
import { Star } from 'lucide-react';

export const Testimonials = () => {
    const reviews = [
        {
            quote: "SnappyYak gave us 28% more billable hours and ended burnout debates. Privacy-first is a game-changer.",
            author: "Sarah L.",
            role: "Ops Lead, Remote Agency",
            stat: "+25% output"
        },
        {
            quote: "Reclaimed $150K/year in wasted time. Integrations with Jira are seamless—trust skyrocketed.",
            author: "Mike R.",
            role: "CTO, Distributed Dev Team",
            stat: "122x ROI"
        },
        {
            quote: "Workload insights prevented 3 key resignations. Transparent, empowering—our new standard.",
            author: "Elena K.",
            role: "HR Director, Global Startup",
            stat: "Retention High"
        }
    ];

    return (
        <section className="py-32 bg-bg-alt">
            <Container>
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-heading font-bold text-brand-dark mb-4">Real Teams, Real Results</h2>
                    <p className="text-xl text-text-body">Join 1,000+ remote teams boosting productivity 30%+</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {reviews.map((review, i) => (
                        <div key={i} className="bg-white p-8 rounded-[30px] shadow-sm border border-gray-100 flex flex-col justify-between">
                            <div>
                                <div className="flex gap-1 text-brand-orange mb-4">
                                    {[1, 2, 3, 4, 5].map(n => <Star key={n} fill="currentColor" size={16} />)}
                                </div>
                                <p className="text-lg text-text-heading font-medium italic mb-6">"{review.quote}"</p>
                            </div>
                            <div>
                                <div className="font-bold text-brand-dark">{review.author}</div>
                                <div className="text-sm text-text-muted">{review.role}</div>
                                <div className="mt-4 inline-block bg-orange-100 text-brand-orange px-3 py-1 rounded-full text-sm font-bold">
                                    {review.stat}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
};
