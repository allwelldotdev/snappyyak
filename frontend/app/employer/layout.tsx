'use client';

import { useRequireAuth } from '@/components/providers/useRequireAuth';
import { Logo } from '@/components/ui/Logo';
import { Container } from '@/components/ui/Container';

export default function EmployerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useRequireAuth(['employer']);

    if (loading || !user) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <nav className="bg-white border-b border-gray-200 px-6 py-4">
                <Container>
                    <div className="flex items-center justify-between">
                        <Logo />
                        <span className="text-sm font-medium">Employer Portal</span>
                    </div>
                </Container>
            </nav>
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}
