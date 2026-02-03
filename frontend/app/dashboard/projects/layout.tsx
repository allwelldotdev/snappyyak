'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function ProjectsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const TABS = [
        { name: 'Insightful', href: '/dashboard/projects' },
        { name: 'Integrated', href: '/dashboard/projects/integrated' },
    ];

    return (
        <div className="flex flex-col h-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold font-heading text-brand-dark mb-6">Projects</h1>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <div className="flex gap-8">
                        {TABS.map((tab) => {
                            const isActive = tab.name === 'Insightful'
                                ? pathname === tab.href
                                : pathname.startsWith(tab.href);

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
            <div className="flex-1 flex flex-col min-h-0">
                {children}
            </div>
        </div>
    );
}
