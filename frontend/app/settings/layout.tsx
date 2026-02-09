'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/providers/AuthProvider';
import EmployerLayout from '@/app/employer/layout';
import DashboardLayout from '@/app/dashboard/layout';

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { user } = useAuth();

    // Determine which layout to use based on user role
    const LayoutWrapper = user?.role === 'employer' ? EmployerLayout : DashboardLayout;

    const TABS = [
        { name: 'Info', href: '/settings/info' },
        { name: 'Localization', href: '/settings/localization' },
    ];

    return (
        <LayoutWrapper>
            <div className="flex flex-col">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold font-heading text-brand-dark mb-6">Personal Settings</h1>

                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <div className="flex gap-8">
                            {TABS.map((tab) => {
                                const isActive = pathname === tab.href ||
                                    (tab.href === '/settings/info' && pathname === '/settings');

                                return (
                                    <Link
                                        key={tab.name}
                                        href={tab.href}
                                        className={cn(
                                            "pb-3 text-sm font-medium transition-colors relative",
                                            isActive
                                                ? "text-brand-orange"
                                                : "text-gray-500 hover:text-brand-dark"
                                        )}
                                    >
                                        {tab.name}
                                        {isActive && (
                                            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-orange" />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <div className="">
                    {children}
                </div>
            </div>
        </LayoutWrapper>
    );
}
