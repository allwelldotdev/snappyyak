import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Auth = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
    const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

    // Simple state to handle form interaction
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { login } = useAuth();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
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
            navigate('/dashboard');
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
                    <Link to="/" className="text-2xl font-bold font-heading text-brand-dark hover:opacity-80 transition-opacity w-fit block">
                        SnappyYak
                    </Link>
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
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-brand-dark mb-2">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>

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
};
