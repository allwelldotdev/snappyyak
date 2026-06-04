'use client';

import { Calendar as CalendarIcon, Download, ChevronDown } from 'lucide-react';
import { Tooltip } from '@/components/ui/Tooltip';
import { EmptyState } from '@/components/dashboard/EmptyState';

export default function AlertLogsPage() {
    return (
        <div className="flex flex-col h-full">
            {/* Controls Row - Replicated from Overview page */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    {/* Date Button */}
                    <button className="flex items-center gap-2 px-3 py-2 bg-indigo-50/50 hover:bg-indigo-50 text-brand-indigo rounded-lg text-sm font-medium border border-transparent transition-colors shadow-sm">
                        <CalendarIcon className="w-4 h-4" />
                        <span>Jan 26, 2026</span>
                    </button>

                    {/* Compare To Dropdown */}
                    <button className="flex items-center gap-2 px-3 py-2 bg-indigo-50/50 hover:bg-indigo-50 text-brand-indigo rounded-lg text-sm font-medium border border-transparent transition-colors shadow-sm">
                        <span>Compare to</span>
                        <ChevronDown className="w-4 h-4" />
                    </button>

                    {/* Add Filter */}
                    <button className="flex items-center gap-2 px-3 py-2 text-brand-indigo hover:bg-indigo-50 rounded-lg text-sm font-medium border border-indigo-100 transition-colors">
                        <span className="text-lg leading-none">+</span>
                        <span>Add Filter</span>
                    </button>
                </div>

                {/* Export Button */}
                <div className="flex items-center gap-3">
                    <Tooltip content="Export Data">
                        <button className="p-2 text-gray-500 hover:text-brand-dark border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white shadow-sm">
                            <Download className="w-4 h-4" />
                        </button>
                    </Tooltip>
                </div>
            </div>

            {/* Main Content - Empty State */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 flex flex-col justify-center overflow-hidden min-h-[400px]">
                <EmptyState
                    title="No logs available"
                    description="Alert logs will appear here once activity is recorded."
                />
            </div>
        </div>
    );
}
