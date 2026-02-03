'use client';

import { Calendar as CalendarIcon, Search } from 'lucide-react';
import { EmptyState } from '@/components/dashboard/EmptyState';

export default function IntegratedProjectsPage() {
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

            {/* Empty State Container */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 flex flex-col items-center justify-center p-8">
                <EmptyState />
            </div>
        </div>
    );
}
