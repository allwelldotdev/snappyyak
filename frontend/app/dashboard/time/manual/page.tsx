'use client';

import { Download, Columns, Calendar as CalendarIcon, Search } from 'lucide-react';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { Tooltip } from '@/components/ui/Tooltip';
import { cn } from '@/lib/utils';

export default function ManualTimePage() {
    // Table Headers
    const TABLE_HEADERS = [
        "Employee Name",
        "Task",
        "Date",
        "Start Time",
        "End Time",
        "Duration [h]",
        "Location",
        "Status"
    ];

    return (
        <div className="flex flex-col h-full flex-1">
            {/* Controls Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                {/* Left Controls - Date, Filter */}
                <div className="flex items-center gap-3">
                    {/* Date Picker Trigger (Mock) */}
                    <button className="flex items-center gap-2 px-3 py-2 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium border border-transparent transition-colors">
                        <CalendarIcon className="w-4 h-4" />
                        <span>Feb 2025</span>
                    </button>

                    {/* Add Filter */}
                    <button className="flex items-center gap-2 px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg text-sm font-medium border border-indigo-100 transition-colors">
                        <span className="text-lg leading-none">+</span>
                        <span>Add Filter</span>
                    </button>
                </div>

                {/* Right Controls - Search & Actions */}
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
                        <thead className="bg-white text-gray-500 font-medium sticky top-0 z-10">
                            <tr>
                                {TABLE_HEADERS.map((header, index) => {
                                    // Helper classes for column widths based on usage in other files
                                    let helperClass = "";
                                    if (header === "Employee Name") helperClass = "min-w-[180px] text-left pl-6";
                                    if (header === "Task") helperClass = "min-w-[150px]";
                                    if (header === "Date") helperClass = "min-w-[120px]";
                                    if (header === "Start Time" || header === "End Time") helperClass = "min-w-[100px]";
                                    if (header === "Location") helperClass = "min-w-[150px]";
                                    if (header === "Status") helperClass = "min-w-[120px]";

                                    return (
                                        <th
                                            key={index}
                                            className={cn(
                                                "p-4 border-b border-gray-100 font-medium whitespace-nowrap bg-white shadow-[0_2px_4px_-2px_rgba(0,0,0,0.05)]",
                                                helperClass,
                                            )}
                                        >
                                            {header}
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {/* Empty Body - showing only logic for now since we have no data */}
                        </tbody>
                    </table>

                    {/* Empty State Component - Placed here to match the visual of it taking up the table body area */}
                    <div className="w-full flex-1 flex flex-col bg-white min-h-[400px]">
                        <EmptyState />
                    </div>
                </div>
            </div>
        </div>
    );
}
