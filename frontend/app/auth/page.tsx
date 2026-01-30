'use client';

import { useState, Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { Logo } from '@/components/ui/Logo';
import { GoogleLogo } from '@/components/ui/GoogleLogo';
import { SlackLogo } from '@/components/ui/SlackLogo';

function AuthContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
    const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

    // Simple state to handle form interaction
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useAuth();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const emailRef = useRef<HTMLInputElement>(null);

    // Auto-focus the email field whenever mode changes
    useEffect(() => {
        if (emailRef.current) {
            emailRef.current.focus();
        }
    }, [mode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const endpoint = mode === 'login' ? 'http://localhost:8080/api/auth/login' : 'http://localhost:8080/api/auth/signup';
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Authentication failed');
            }

            login(data.token, data.user);
            // Router push is handled in login context but good to have safety
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
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
                                {mode === 'login' ? 'Welcome back' : 'Start your free trial'}
                            </h1>
                            <p className="text-text-body text-lg">
                                {mode === 'login'
                                    ? 'Enter your details to access your dashboard.'
                                    : 'Join 10,000+ teams boosting productivity.'}
                            </p>
                            {error && (
                                <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                                    {error}
                                </div>
                            )}
                        </div>

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
                                    ref={emailRef}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-brand-dark mb-2">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {mode === 'login' && (
                                <div className="flex justify-end -mt-4">
                                    <Link href="/auth/forgot-password" className="text-brand-orange text-sm font-medium hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                            )}

                            <Button fullWidth size="lg" disabled={isLoading}>
                                {isLoading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
                            </Button>
                        </form>

                        {mode === 'signup' && (
                            <div className="mt-8 space-y-3">
                                <div className="flex items-center gap-2 text-sm text-text-muted justify-center">
                                    <CheckCircle2 className="w-4 h-4 text-brand-orange" />
                                    <span>No credit card required</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-text-muted justify-center">
                                    <CheckCircle2 className="w-4 h-4 text-brand-orange" />
                                    <span>14-day free trial</span>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 relative flex items-center justify-center">
                            <div className="absolute inset-0 border-t border-gray-100 top-1/2"></div>
                            <span className="relative bg-white px-3 text-sm text-text-muted font-medium uppercase">or</span>
                        </div>

                        <div className="mt-8 flex gap-4">
                            <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-lg text-sm font-medium text-brand-dark hover:bg-gray-50 transition-colors">
                                <GoogleLogo className="w-5 h-5" />
                                {mode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-lg text-sm font-medium text-brand-dark hover:bg-gray-50 transition-colors">
                                <SlackLogo className="w-5 h-5" />
                                {mode === 'login' ? 'Sign in with Slack' : 'Sign up with Slack'}
                            </button>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                            <p className="text-text-muted">
                                {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                                <button
                                    onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                                    className="text-brand-orange font-medium hover:underline"
                                >
                                    {mode === 'login' ? 'Sign up' : 'Log in'}
                                </button>
                            </p>
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

export default function AuthPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AuthContent />
        </Suspense>
    );
}
