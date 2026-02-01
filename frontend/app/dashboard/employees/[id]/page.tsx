'use client';

import { useState } from 'react';
import { Filter, Download, Columns, Calendar as CalendarIcon } from 'lucide-react';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { Tooltip } from '@/components/ui/Tooltip';
import { cn } from '@/lib/utils';

export default function EmployeeTimesheetsPage() {
    // State
    const [viewMode, setViewMode] = useState<'day' | 'shift'>('day');

    // Table Headers
    const TABLE_HEADERS = [
        "Date", "Location", "Clock-in", "Clock-out",
        "Work Time [h]", "Computer Act. [h]", "Productive [h]",
        "Unproductive [h]", "Neutral [h]"
    ];

    return (
        <div className="flex flex-col h-full">
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
