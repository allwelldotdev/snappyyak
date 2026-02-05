'use client';

import { Calendar as CalendarIcon, Search, Columns, Info } from 'lucide-react';
import { Tooltip } from '@/components/ui/Tooltip';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { cn } from '@/lib/utils';

export default function ProjectsPage() {
    // Table Headers
    const TABLE_HEADERS = [
        'Project Name',
        'Assignees',
        'Tasks',
        'Total time [h]',
        'Clocked time [h]',
        'Manual time [h]',
        'Created at'
    ];

    return (
        <div className="flex flex-col h-full">
            {/* Controls Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                {/* Left Controls - Date */}
                <div className="flex items-center gap-3">
                    {/* Date Picker Trigger (Mock) */}
                    <button className="flex items-center gap-2 px-3 py-2 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium border border-transparent transition-colors">
                        <CalendarIcon className="w-4 h-4" />
                        <span>Feb 2026</span>
                    </button>
                </div>

                {/* Right Controls - Search */}
                <div className="flex items-center gap-3">
                    {/* Search Box */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search employee"
                            className="bg-gray-50 border-none rounded-lg pl-9 pr-4 py-2 text-sm text-brand-dark focus:ring-1 focus:ring-brand-orange/50 focus:outline-none w-64"
                        />
                    </div>
                </div>
            </div>

            {/* Info Banner */}
            <div className="flex items-center gap-2 mb-6 px-4 py-3 bg-indigo-50/50 rounded-lg text-sm text-brand-dark border border-indigo-100/50">
                <Info className="w-4 h-4 text-indigo-500" />
                <span>Choose task statuses visible to employees.</span>
                <a href="#" className="text-indigo-600 font-medium hover:underline">Learn More</a>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
                <div className="overflow-auto flex-1">
                    <table className="w-full border-collapse text-sm text-center">
                        <thead className="bg-white text-gray-500 font-medium">
                            <tr>
                                {TABLE_HEADERS.map((header, index) => (
                                    <th
                                        key={index}
                                        className={cn(
                                            "p-4 border-b border-gray-100 font-medium whitespace-nowrap bg-white shadow-[0_2px_4px_-2px_rgba(0,0,0,0.05)]",
                                            index === 0 ? "text-left pl-6 w-[250px] min-w-[250px]" : ""
                                        )}
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {/* Empty Body */}
                        </tbody>
                    </table>

                    {/* Empty State Component */}
                    <div className="w-full">
                        <EmptyState />
                    </div>
                </div>
            </div>
        </div>
    );
}
