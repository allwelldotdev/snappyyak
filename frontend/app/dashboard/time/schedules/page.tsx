'use client';

import { useRouter } from 'next/navigation';
import { Columns, Calendar as CalendarIcon, Search, User } from 'lucide-react';
import { Tooltip } from '@/components/ui/Tooltip';
import { cn } from '@/lib/utils';

export default function SchedulesPage() {
    const router = useRouter();
    // Generate dates for Feb 2025 (Feb 1 to Feb 28)
    // Feb 1, 2025 is a Saturday
    const DATES = Array.from({ length: 28 }, (_, i) => {
        const date = new Date(2025, 1, i + 1); // Feb is month 1
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        const dayNum = date.getDate();
        return { display: `${dayName} ${monthName} ${dayNum}` };
    });

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

                    <Tooltip content="Edit Columns">
                        <button className="p-2 text-gray-500 hover:text-brand-dark border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <Columns className="w-4 h-4" />
                        </button>
                    </Tooltip>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 text-sm font-medium mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-400"></div>
                    <span className="text-gray-600">Shifts</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <span className="text-gray-600">Time Off</span>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
                <div className="overflow-auto flex-1">
                    <table className="border-collapse text-sm text-center">
                        <thead className="bg-white text-gray-500 font-medium sticky top-0 z-30 shadow-[0_2px_4px_-2px_rgba(0,0,0,0.05)]">
                            <tr>
                                {/* Employee Name Column Header - Sticky Left (Optional, but usually expected for this layout type. 
                                    However, the requirement just asked for sticky header row, not necessarily sticky column.
                                    The "screenshot is long in width" note suggests horizontal scrolling.
                                    The requirement "the table header row MUST BE sticky to the vertical scroll" confirms header stickiness.
                                */}
                                {/* Employee Name Column Header - Sticky Left */}
                                <th className="sticky left-0 min-w-[250px] p-4 border-b border-gray-100 font-medium text-left pl-6 bg-white z-20 border-r border-r-gray-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                    Employee Name
                                </th>
                                {/* Date Columns Headers */}
                                {DATES.map((date, index) => (
                                    <th
                                        key={index}
                                        className="min-w-[207px] p-4 border-b border-gray-100 font-medium whitespace-nowrap bg-white border-l border-l-gray-50"
                                    >
                                        {date.display}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {/* Row 1 - Allwell */}
                            <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                                {/* Employee Name Cell - Sticky Left */}
                                <td
                                    onClick={() => router.push('/dashboard/employees/allwell')}
                                    className="sticky left-0 bg-white group-hover:bg-gray-50 z-10 min-w-[250px] p-4 text-left pl-6 h-[60px] cursor-pointer border-r border-gray-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            {/* User Avatar Placeholder */}
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                                <User className="w-4 h-4" />
                                            </div>
                                            {/* Subscript Icon - e.g. a status or role indicator */}
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm">
                                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            </div>
                                        </div>
                                        <span className="font-medium text-brand-dark">Allwell</span>
                                    </div>
                                </td>
                                {/* Empty Date Cells */}
                                {DATES.map((_, index) => (
                                    <td
                                        key={index}
                                        className="min-w-[207px] p-4 border-l border-l-gray-50 h-[62px]"
                                    >
                                        {/* Empty cell content */}
                                    </td>
                                ))}
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
