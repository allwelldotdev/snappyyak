'use client';

import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Placeholder logic - just show success state
        setIsSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-bg-main flex flex-col font-body">
            <nav className="p-6 absolute top-0 left-0 w-full z-10">
                <Container>
                    <Logo />
                </Container>
            </nav>

            <div className="flex-grow flex items-center justify-center p-4 pt-20">
                <div className="bg-white w-full max-w-[480px] rounded-[30px] shadow-2xl overflow-hidden border border-gray-100">
                    <div className="p-8 sm:p-12">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold font-heading text-brand-dark mb-3">
                                Reset Password
                            </h1>
                            <p className="text-text-body text-lg">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>
                        </div>

                        {!isSubmitted ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-brand-dark mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all"
                                        placeholder="name@company.com"
                                        autoFocus
                                    />
                                </div>

                                <Button fullWidth size="lg">
                                    Send Reset Link
                                </Button>
                            </form>
                        ) : (
                            <div className="text-center space-y-6">
                                <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-3 justify-center">
                                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                                    <p className="font-medium">Check your email for the reset link</p>
                                </div>
                                <p className="text-sm text-text-muted">
                                    Did not receive the email? <button onClick={() => setIsSubmitted(false)} className="text-brand-orange hover:underline font-medium">Click to resend</button>
                                </p>
                            </div>
                        )}

                        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                            <Link href="/auth?mode=login" className="text-brand-orange font-medium hover:underline">
                                Back to Log in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background decoration */}
            <div className="fixed top-0 left-0 w-full h-full -z-10 bg-[#FAF9F6]">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-orange opacity-5 blur-[120px] rounded-full"></div>
            </div>
        </div>
    );
}
