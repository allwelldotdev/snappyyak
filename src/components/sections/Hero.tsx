import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { TiltImage } from './TiltImage';
import { Link } from 'react-router-dom';

export const Hero = () => {
    return (
        <section className="relative pt-20 pb-32 overflow-hidden">
            {/* Background blobs/accents could go here */}

            <Container className="flex flex-col items-center gap-12 lg:gap-20 text-center">
                {/* Top Content */}
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-[60px] leading-[68px] font-heading font-bold text-brand-dark mb-6">
                        Reclaim 20+ hours per employee weekly. <span className="text-brand-orange">Optimize workloads.</span>
                    </h1>
                    <p className="text-[18px] leading-[27px] font-ui font-light mb-10 max-w-2xl mx-auto text-text-body">
                        SnappyYak delivers real-time employee productivity intelligence without privacy-invasive methods like; keystroke logging or surveillance scoring. Screenshots are optional.<br />
                        <span className="font-bold">Build trust with your staff.</span>
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center">
                        <Link to="/auth?mode=signup">
                            <Button size="lg" className="group">
                                Start Free Trial <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Button variant="outline" size="lg">
                            Book a Demo
                        </Button>
                    </div>

                    <div className="flex items-center justify-center gap-6 text-sm font-medium text-text-muted">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-brand-orange" />
                            <span>No credit card required</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-brand-orange" />
                            <span>Cancel anytime</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-brand-orange" />
                            <span>GDPR Compliant</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Visual */}
                <div className="relative w-full max-w-4xl mx-auto perspective-1000">
                    <TiltImage />
                    {/* Decorative background blob */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-orange opacity-10 blur-[100px] rounded-full -z-10"></div>
                </div>
            </Container>
        </section>
    );
};
