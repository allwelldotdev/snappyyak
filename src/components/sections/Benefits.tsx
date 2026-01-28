import { Container } from '../ui/Container';
import { Clock, Heart, DollarSign, Eye, BarChart3 } from 'lucide-react';

export const Benefits = () => {
    const benefits = [
        {
            title: 'Reclaim Lost Hours',
            description: 'Automatic time mapping reveals where time truly goes—recover 20-30% in unproductive gaps.',
            icon: Clock,
        },
        {
            title: 'Prevent Burnout',
            description: 'Spot overloads and underuse early. Promote well-being with intelligent alerts—no manual oversight needed.',
            icon: Heart,
        },
        {
            title: 'Drive Cost Savings',
            description: 'Tie time to projects/payroll for precise insights. Cut revenue leaks by 25%+ with accurate billing.',
            icon: DollarSign,
        },
        {
            title: 'Seamless Visibility',
            description: 'Distributed teams stay aligned with trend dashboards. Prove productivity without eroding trust.',
            icon: Eye,
        },
        {
            title: 'Optimize Allocation',
            description: 'Data-driven decisions on hiring, tools, and projects. Scale smarter with actionable intelligence.',
            icon: BarChart3,
        },
    ];

    return (
        <section className="py-24 bg-bg-alt">
            <Container>
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-brand-dark">
                        Why Choose SnappyYak?
                    </h2>
                    <p className="text-xl text-text-body">
                        Your remote team deserves better than guesswork or micromanagement. Here's what we unlock:
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="bg-white p-8 rounded-[30px] border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 text-brand-orange">
                                <benefit.icon size={28} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-2xl font-heading font-bold mb-3 text-brand-dark">{benefit.title}</h3>
                            <p className="text-text-body leading-relaxed">{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
};
