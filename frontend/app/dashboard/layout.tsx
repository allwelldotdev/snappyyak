'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, Clock, Settings } from 'lucide-react';
import { UserMenu } from '@/components/dashboard/UserMenu';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, logout, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-brand-dark">Loading...</div>;
    }

    return (
        <div className="flex h-screen bg-gray-50 font-body text-brand-dark">
            {/* Sidebar */}
            <aside className="w-64 bg-brand-dark text-white hidden md:flex flex-col">
                <div className="p-6">
                    <div className="text-2xl font-bold font-heading text-brand-orange">SnappyYak</div>
                </div>
                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {[
                        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
                        { href: '#', label: 'Teams', icon: Users },
                        { href: '#', label: 'Time Logs', icon: Clock },
                        { href: '/dashboard/settings', label: 'Settings', icon: Settings },
                    ].map((link) => {
                        const Icon = link.icon;
                        const isActive = link.href === pathname || (link.href !== '/dashboard' && pathname.startsWith(link.href) && link.href !== '#');

                        return (
                            <Link
                                key={link.label}
                                href={link.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-white/10 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{link.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Menu in Sidebar */}
                <div className="p-4 border-t border-white/10 flex justify-center">
                    <UserMenu />
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
