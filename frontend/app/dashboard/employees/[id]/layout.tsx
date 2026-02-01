'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { Mail, Users, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function EmployeeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const params = useParams();
    const pathname = usePathname();

    // Dynamic Name Handling (Performant: derived from params)
    const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
    const name = rawId ? rawId.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Unknown Employee';
    const email = 'UNKNOWN_EMAIL'; // As per user requirement for mock data

    const TABS = [
        { name: 'Timesheets', href: `/dashboard/employees/${rawId}` },
        { name: 'Schedules', href: `/dashboard/employees/${rawId}/schedules` },
        { name: 'Projects', href: `/dashboard/employees/${rawId}/projects` },
    ];

    return (
        <div className="flex flex-col h-full">
            {/* Header Section (Not Sticky) */}
            <div className="bg-gray-50 pb-4 pt-1 mb-2">
                {/* Breadcrumb / Back Link */}
                <div className="mb-2">
                    <Link href="/dashboard" className="text-xs font-medium text-gray-400 hover:text-brand-orange inline-flex items-center gap-1">
                        <ChevronLeft className="w-3 h-3" />
                        Employees
                    </Link>
                </div>

                <div className="mb-6">
                    <h1 className="text-3xl font-bold font-heading text-brand-dark mb-2">{name}</h1>
                    <div className="flex items-center gap-6 text-sm text-gray-500 font-medium">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span>Default team</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="uppercase">{email}</span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <div className="flex gap-8">
                        {TABS.map((tab) => {
                            const isActive = tab.name === 'Timesheets'
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
            <div className="flex-1 flex flex-col">
                {children}
            </div>
        </div>
    );
}
