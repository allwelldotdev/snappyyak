'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { AddNewEmployeeButton } from '@/components/employer/AddNewEmployeeButton';

export default function EmployeesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const TABS = [
        { name: 'Active', href: '/employer/employees' },
        { name: 'Pending', href: '/employer/employees/pending' },
        { name: 'Deactivated', href: '/employer/employees/deactivated' },
    ];

    return (
        <div className="flex flex-col h-full">
            {/* Header Section */}
            <div className="bg-gray-50 mb-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-2xl font-bold font-heading text-brand-dark">Employees</h1>
                    </div>

                    <AddNewEmployeeButton />
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
