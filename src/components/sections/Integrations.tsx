import { Container } from '../ui/Container';

export const Integrations = () => {
    // Placeholder logos via text or simple styling since we don't have SVGs
    const tools = ["Asana", "Jira", "Trello", "ClickUp", "Slack", "Zoom", "Github", "QuickBooks"];

    return (
        <section className="py-24 bg-brand-dark overflow-hidden" id="integrations">
            <Container className="text-center">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
                    Seamless Integrations: <span className="text-brand-orange">Works With Your Stack</span>
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto mb-16 text-lg">
                    Track time intelligently within tools your team already loves. No rip-and-replace.
                    Setup in minutes. Insights in hours.
                </p>

                {/* Carousel-like grid */}
                <div className="flex flex-wrap justify-center gap-8 md:gap-12 opacity-80">
                    {tools.map((tool) => (
                        <div key={tool} className="text-2xl font-heading font-bold text-white/50 hover:text-white hover:scale-110 transition-all cursor-default">
                            {tool}
                        </div>
                    ))}
                    <div className="text-2xl font-heading font-bold text-brand-orange">+ 40 More</div>
                </div>
            </Container>
        </section>
    );
};
