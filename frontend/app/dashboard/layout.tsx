'use client';

import { useRequireAuth } from '@/components/providers/useRequireAuth';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Users, CalendarDays, Briefcase, CloudDownload, Settings } from 'lucide-react';
import { UserMenu } from '@/components/dashboard/UserMenu';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useRequireAuth();
    const pathname = usePathname();

    if (loading || !user) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-brand-dark">Loading...</div>;
    }

    return (
        <div className="flex h-screen bg-gray-50 font-body text-brand-dark">
            {/* Sidebar */}
            <aside className="w-64 bg-brand-dark text-white hidden md:flex flex-col">
                <div className="p-6">
                    <Link href="/dashboard" className="text-2xl font-bold font-heading text-brand-orange">SnappyYak</Link>
                </div>
                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {[
                        { href: '/dashboard', label: 'Employees', icon: Users },
                        { href: '/dashboard/time', label: 'Time and Attendance', icon: CalendarDays },
                        { href: '/dashboard/projects', label: 'Projects', icon: Briefcase },
                        { href: '/dashboard/download', label: 'Download', icon: CloudDownload },
                        { href: '/dashboard/settings', label: 'Settings', icon: Settings },
                    ].map((link) => {
                        const Icon = link.icon;
                        const isActive = link.href === pathname || (link.href !== '/dashboard' && pathname.startsWith(link.href)) || (link.href === '/dashboard' && pathname.startsWith('/dashboard/employees/'));

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
