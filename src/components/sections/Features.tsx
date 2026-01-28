import { Container } from '../ui/Container';
import { AlignLeft, Activity, Users, FileText } from 'lucide-react';

export const Features = () => {
    const features = [
        {
            title: "Time Intelligence Engine",
            tagline: "Turn raw activity into actionable trends.",
            items: ["Effortless app/web categorization", "Project & task breakdowns", "Expected vs. actual time insights"],
            icon: Activity
        },
        {
            title: "Workload Optimizer",
            tagline: "Balance your team's capacity before burnout hits.",
            items: ["Real-time overload detection", "Trend forecasting", "Wellness nudges"],
            icon: Users
        },
        {
            title: "Cost & Billing Intelligence",
            tagline: "Maximize profitability with transparent data.",
            items: ["Billable hours automation", "Cost-per-project visibility", "Idle time recovery"],
            icon: FileText
        },
        {
            title: "Unified Dashboards",
            tagline: "Your single source of truth—customize on the fly.",
            items: ["Team-wide productivity trends", "Export-ready reports (PDF/CSV)", "Mobile-first for leaders"],
            icon: AlignLeft
        }
    ];

    return (
        <section className="py-32" id="features">
            <Container>
                <div className="mb-20">
                    <span className="text-brand-orange font-bold tracking-wider uppercase text-sm mb-2 block">Key Features</span>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-brand-dark max-w-2xl">
                        Intelligence You Can Rely On
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
                    {features.map((feature, idx) => (
                        <div key={idx} className="group">
                            <div className="flex items-start gap-6">
                                <div className="shrink-0 w-16 h-16 bg-brand-dark rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-300">
                                    <feature.icon size={32} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-heading font-bold text-brand-dark mb-2">{feature.title}</h3>
                                    <p className="text-lg text-text-body mb-6 font-medium">{feature.tagline}</p>
                                    <ul className="space-y-3">
                                        {feature.items.map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-text-muted">
                                                <span className="w-1.5 h-1.5 bg-brand-orange rounded-full"></span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
};
