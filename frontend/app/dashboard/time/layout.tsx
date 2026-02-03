'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function TimeAttendanceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [viewMode, setViewMode] = useState<'day' | 'shift'>('day');

    const TABS = [
        { name: 'Timesheets', href: '/dashboard/time' },
        { name: 'Manual Time', href: '/dashboard/time/manual' },
        { name: 'Schedules', href: '/dashboard/time/schedules' },
    ];

    // Configuration for where to hide the view toggle
    // If we add pages later that shouldn't show this, add their paths here.
    const HIDE_VIEW_TOGGLE_PATHS: string[] = ['/dashboard/time/manual', '/dashboard/time/schedules'];
    const showViewToggle = !HIDE_VIEW_TOGGLE_PATHS.some(path => pathname.startsWith(path));

    return (
        <div className="flex flex-col h-full">
            {/* Header Section */}
            <div className="bg-gray-50 mb-6">
                {/* Breadcrumb */}
                {/* <div className="mb-2 flex items-center gap-1 text-xs font-medium text-gray-500">
                    <span>Dashboard</span>
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                    <span className="text-brand-orange">Time and Attendance</span>
                </div> */}

                <div className="flex justify-between items-end mb-6 h-9">
                    <div>
                        <h1 className="text-2xl font-bold font-heading text-brand-dark">Time and Attendance</h1>
                        {/* Optional subtitle if needed, keeping it clean for now matching design */}
                    </div>

                    {/* View Toggle - Inherited by children unless configured otherwise */}
                    {showViewToggle && (
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                            <button
                                onClick={() => setViewMode('day')}
                                className={cn(
                                    "px-3 py-1.5 text-xs font-semibold rounded-md transition-all",
                                    viewMode === 'day'
                                        ? "bg-white text-brand-orange shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                )}
                            >
                                Day View
                            </button>
                            <button
                                onClick={() => setViewMode('shift')}
                                className={cn(
                                    "px-3 py-1.5 text-xs font-semibold rounded-md transition-all",
                                    viewMode === 'shift'
                                        ? "bg-white text-brand-orange shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                )}
                            >
                                Shift View
                            </button>
                        </div>
                    )}
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
