'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Users, Filter, Download, Columns, Calendar as CalendarIcon, ChevronLeft } from 'lucide-react';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { Tooltip } from '@/components/ui/Tooltip';
import { cn } from '@/lib/utils';
import { useParams } from 'next/navigation';

export default function EmployeeDetailsPage() {


    const params = useParams();
    // Dynamic Name Handling (Performant: derived from params)
    const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
    const name = rawId ? rawId.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Unknown Employee';
    const email = 'UNKNOWN_EMAIL'; // As per user requirement for mock data

    // State
    const [viewMode, setViewMode] = useState<'day' | 'shift'>('day');

    // Tabs
    const TABS = ['Timesheets', 'Schedules', 'Projects'];
    const [activeTab, setActiveTab] = useState('Timesheets');

    // Table Headers
    const TABLE_HEADERS = [
        "Date", "Location", "Clock-in", "Clock-out",
        "Work Time [h]", "Computer Act. [h]", "Productive [h]",
        "Unproductive [h]", "Neutral [h]"
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
                        {TABS.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "pb-3 text-sm font-medium transition-colors relative",
                                    activeTab === tab
                                        ? "text-brand-orange"
                                        : "text-gray-500 hover:text-brand-dark"
                                )}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-orange" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Controls Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                {/* Left Controls */}
                <div className="flex items-center gap-3">
                    {/* Date Picker Trigger (Mock) */}
                    <button className="flex items-center gap-2 px-3 py-2 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium border border-transparent transition-colors">
                        <CalendarIcon className="w-4 h-4" />
                        <span>Today</span>
                    </button>

                    {/* Add Filter */}
                    <button className="flex items-center gap-2 px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg text-sm font-medium border border-indigo-100 transition-colors">
                        <span className="text-lg leading-none">+</span>
                        <span>Add Filter</span>
                    </button>
                </div>

                {/* Right Controls */}
                <div className="flex items-center gap-3">
                    {/* View Toggle */}
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

                    {/* Action Buttons */}
                    <Tooltip content="Export Data">
                        <button className="p-2 text-gray-500 hover:text-brand-dark border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <Download className="w-4 h-4" />
                        </button>
                    </Tooltip>

                    <Tooltip content="Edit Columns">
                        <button className="p-2 text-gray-500 hover:text-brand-dark border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <Columns className="w-4 h-4" />
                        </button>
                    </Tooltip>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
                <div className="overflow-auto flex-1">
                    <table className="w-full border-collapse text-sm text-center">
                        <thead className="bg-white text-gray-500 font-medium">
                            <tr>
                                {TABLE_HEADERS.map((header, index) => {
                                    let helperClass = "";
                                    if (header.includes("Date")) helperClass = "min-w-[150px]";
                                    if (header.includes("Location")) helperClass = "min-w-[220px]";
                                    if (header.includes("Clock-in") || header.includes("Clock-out")) helperClass = "min-w-[100px]";

                                    return (
                                        <th
                                            key={index}
                                            className={cn(
                                                "p-4 border-b border-gray-100 font-medium whitespace-nowrap bg-white shadow-[0_2px_4px_-2px_rgba(0,0,0,0.05)]",
                                                helperClass,
                                                index === 0 ? "text-left pl-6" : ""
                                            )}
                                        >
                                            {header}
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {/* Empty Body - The instructions imply the empty state is shown immediately or inside body */}
                        </tbody>
                    </table>

                    {/* Empty State Component - Placed here to match the visual of it taking up the table body area */}
                    <div className="w-full">
                        <EmptyState />
                    </div>
                </div>
            </div>
        </div>
    );
}
