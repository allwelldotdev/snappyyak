'use client';

import { useRequireAuth } from '@/components/providers/useRequireAuth';
import { Container } from '@/components/ui/Container';
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
        <div className="min-h-screen bg-bg-main flex flex-col font-body">
            <nav className="p-6 absolute top-0 left-0 w-full z-10">
                <Container>
                    <Logo />
                </Container>
            </nav>

            <main className="flex-grow flex items-center justify-center p-4 pt-20">
                {children}
            </main>

            {/* Background decoration */}
            <div className="fixed top-0 left-0 w-full h-full -z-10 bg-[#FAF9F6]">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-orange opacity-5 blur-[120px] rounded-full"></div>
            </div>
        </div>
    );
}
