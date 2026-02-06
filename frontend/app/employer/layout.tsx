'use client';

import { useRequireAuth } from '@/components/providers/useRequireAuth';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    Activity,
    BarChart3,
    Bell,
    Users,
    Layers,
    Image,
    Video,
    CalendarDays,
    Zap,
    Briefcase,
    FileText,
    Settings,
    ChevronDown,
    ChevronRight
} from 'lucide-react';
import { UserMenu } from '@/components/dashboard/UserMenu';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function EmployerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useRequireAuth(['employer']);
    const pathname = usePathname();
    const [reportsOpen, setReportsOpen] = useState(false);

    if (loading || !user) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-brand-dark">Loading...</div>;
    }

    const navItems = [
        { href: '/employer', label: 'Productivity Trends', icon: BarChart3 },
        { href: '/employer/real-time', label: 'Real-Time Insights', icon: Activity },
        { href: '/employer/alerts', label: 'Alerts', icon: Bell },
        { href: '/employer/employees', label: 'Employees', icon: Users },
        { href: '/employer/teams', label: 'Teams', icon: Layers },
        { href: '/employer/screenshots', label: 'Screenshots', icon: Image },
        { href: '/employer/screen-recording', label: 'Screen Recording', icon: Video },
        { href: '/employer/time', label: 'Time and Attendance', icon: CalendarDays },
        { href: '/employer/activities', label: 'Activities', icon: Zap },
        { href: '/employer/projects', label: 'Projects', icon: Briefcase },
    ];

    const reportsSubItems = [
        { href: '/employer/reports/work-type', label: 'Work Type' },
        { href: '/employer/reports/schedule-adherence', label: 'Schedule Adherence' },
        { href: '/employer/reports/workload-distribution', label: 'Workload Distribution' },
        { href: '/employer/reports/apps-websites', label: 'Apps & Websites' },
        { href: '/employer/reports/location-insights', label: 'Location Insights' },
    ];

    return (
        <div className="flex h-screen bg-gray-50 font-body text-brand-dark">
            {/* Sidebar */}
            <aside className="w-64 bg-brand-dark text-white hidden md:flex flex-col">
                <div className="p-6">
                    <Link href="/employer" className="text-2xl font-bold font-heading text-brand-orange">SnappyYak</Link>
                </div>
                <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
                    {navItems.map((link) => {
                        const Icon = link.icon;
                        const isActive = link.href === pathname || (pathname.startsWith(link.href) && link.href !== '/employer');

                        return (
                            <Link
                                key={link.label}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group text-sm",
                                    isActive
                                        ? "bg-white/10 text-white font-medium"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <Icon className={cn("w-5 h-5", isActive ? "text-brand-orange" : "text-gray-400 group-hover:text-white")} />
                                <span>{link.label}</span>
                            </Link>
                        );
                    })}

                    {/* Reports Dropdown */}
                    <div>
                        <button
                            onClick={() => setReportsOpen(!reportsOpen)}
                            className={cn(
                                "w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group text-sm",
                                pathname.startsWith('/employer/reports')
                                    ? "bg-white/10 text-white font-medium"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <FileText className={cn("w-5 h-5", pathname.startsWith('/employer/reports') ? "text-brand-orange" : "text-gray-400 group-hover:text-white")} />
                                <span>Reports</span>
                            </div>
                            <ChevronRight className={cn("w-4 h-4 transition-transform duration-200", reportsOpen ? "rotate-90" : "")} />
                        </button>

                        <div className={cn(
                            "overflow-hidden transition-all duration-300 ease-in-out pl-12 space-y-1",
                            reportsOpen ? "max-h-64 mt-1 opacity-100" : "max-h-0 opacity-0"
                        )}>
                            {reportsSubItems.map((subItem) => (
                                <Link
                                    key={subItem.label}
                                    href={subItem.href}
                                    className={cn(
                                        "block py-2 text-sm transition-colors",
                                        pathname === subItem.href
                                            ? "text-brand-orange"
                                            : "text-gray-500 hover:text-white"
                                    )}
                                >
                                    {subItem.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <Link
                        href="/employer/settings"
                        className={cn(
                            "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group text-sm",
                            pathname.startsWith('/employer/settings')
                                ? "bg-white/10 text-white font-medium"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <Settings className={cn("w-5 h-5", pathname.startsWith('/employer/settings') ? "text-brand-orange" : "text-gray-400 group-hover:text-white")} />
                        <span>Settings</span>
                    </Link>

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
