import { Container } from '../ui/Container';
import { Twitter, Linkedin, Github } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="bg-bg-main border-t border-gray-100 py-20 pb-10">
            <Container>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
                    <div className="col-span-2 lg:col-span-2">
                        <span className="text-2xl font-heading font-bold text-brand-dark tracking-tight">
                            Snappy<span className="text-brand-orange">Yak</span>
                        </span>
                        <p className="mt-4 text-text-body max-w-xs">
                            Privacy-first workforce intelligence for modern distributed teams. Insights without intrusion.
                        </p>
                        <div className="flex gap-4 mt-6">
                            <span className="p-2 rounded-full bg-gray-100 text-brand-dark hover:bg-brand-orange hover:text-black transition-colors cursor-pointer"><Twitter size={20} /></span>
                            <span className="p-2 rounded-full bg-gray-100 text-brand-dark hover:bg-brand-orange hover:text-black transition-colors cursor-pointer"><Linkedin size={20} /></span>
                            <span className="p-2 rounded-full bg-gray-100 text-brand-dark hover:bg-brand-orange hover:text-black transition-colors cursor-pointer"><Github size={20} /></span>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-heading font-bold mb-6">Product</h4>
                        <ul className="space-y-4 text-text-body">
                            <li><a href="#" className="hover:text-brand-orange transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-brand-orange transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-brand-orange transition-colors">Integrations</a></li>
                            <li><a href="#" className="hover:text-brand-orange transition-colors">Security</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-heading font-bold mb-6">Company</h4>
                        <ul className="space-y-4 text-text-body">
                            <li><a href="#" className="hover:text-brand-orange transition-colors">About</a></li>
                            <li><a href="#" className="hover:text-brand-orange transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-brand-orange transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-brand-orange transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-heading font-bold mb-6">Resources</h4>
                        <ul className="space-y-4 text-text-body">
                            <li><a href="#" className="hover:text-brand-orange transition-colors">Demo</a></li>
                            <li><a href="#" className="hover:text-brand-orange transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-brand-orange transition-colors">ROI Calculator</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-muted">
                    <p>© 2025 SnappyYak. GDPR Compliant.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-brand-dark">Privacy Policy</a>
                        <a href="#" className="hover:text-brand-dark">Terms of Service</a>
                    </div>
                </div>
            </Container>
        </footer>
    );
};
