'use client';

import { useRequireAuth } from '@/components/providers/useRequireAuth';
import { Logo } from '@/components/ui/Logo';

export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // We don't strictly enforce 'employee' role here via hook because the hook redirects TO onboarding if needed.
    // Just ensure auth.
    const { user, loading } = useRequireAuth();

    if (loading || !user) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-20">
            <div className="mb-8">
                <Logo />
            </div>
            <main className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                {children}
            </main>
        </div>
    );
}
