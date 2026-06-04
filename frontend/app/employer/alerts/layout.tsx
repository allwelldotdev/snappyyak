'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Bell } from 'lucide-react';

export default function AlertsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const TABS = [
        { name: 'Overview', href: '/employer/alerts' },
        { name: 'Logs', href: '/employer/alerts/logs' },
    ];

    return (
        <div className="flex flex-col h-full">
            {/* Header Section */}
            <div className="bg-gray-50 mb-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-2xl font-bold font-heading text-brand-dark">Alerts</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="bg-brand-orange hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                            New Alert
                        </button>

                        {/* Alert Icon with Notification Badge */}
                        <button className="relative p-2 text-gray-500 hover:text-brand-dark transition-colors group">
                            <span className="sr-only">Notifications</span>
                            <Bell className="w-6 h-6 text-gray-600 group-hover:text-brand-dark transition-colors" />
                            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white border-2 border-white">
                                1
                            </span>
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <div className="flex gap-8">
                        {TABS.map((tab) => {
                            const isActive = pathname === tab.href;

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
            <div className="flex-1 flex flex-col">
                {children}
            </div>
        </div>
    );
}
