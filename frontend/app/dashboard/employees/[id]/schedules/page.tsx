'use client';

import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function EmployeeSchedulesPage() {
    // Days of the week
    const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    // Calendar data for Feb 2025 (Feb 1st is a Saturday)
    const CALENDAR_DAYS = [
        // Week 1: Jan 26 - Feb 1
        { display: 'Jan 26', isCurrentMonth: false },
        { display: 'Jan 27', isCurrentMonth: false },
        { display: 'Jan 28', isCurrentMonth: false },
        { display: 'Jan 29', isCurrentMonth: false },
        { display: 'Jan 30', isCurrentMonth: false },
        { display: 'Jan 31', isCurrentMonth: false },
        { display: 'Feb 1', isCurrentMonth: true },

        // Week 2: Feb 2 - Feb 8
        { display: 'Feb 2', isCurrentMonth: true },
        { display: 'Feb 3', isCurrentMonth: true },
        { display: 'Feb 4', isCurrentMonth: true },
        { display: 'Feb 5', isCurrentMonth: true },
        { display: 'Feb 6', isCurrentMonth: true },
        { display: 'Feb 7', isCurrentMonth: true },
        { display: 'Feb 8', isCurrentMonth: true },

        // Week 3: Feb 9 - Feb 15
        { display: 'Feb 9', isCurrentMonth: true },
        { display: 'Feb 10', isCurrentMonth: true },
        { display: 'Feb 11', isCurrentMonth: true },
        { display: 'Feb 12', isCurrentMonth: true },
        { display: 'Feb 13', isCurrentMonth: true },
        { display: 'Feb 14', isCurrentMonth: true },
        { display: 'Feb 15', isCurrentMonth: true },

        // Week 4: Feb 16 - Feb 22
        { display: 'Feb 16', isCurrentMonth: true },
        { display: 'Feb 17', isCurrentMonth: true },
        { display: 'Feb 18', isCurrentMonth: true },
        { display: 'Feb 19', isCurrentMonth: true },
        { display: 'Feb 20', isCurrentMonth: true },
        { display: 'Feb 21', isCurrentMonth: true },
        { display: 'Feb 22', isCurrentMonth: true },

        // Week 5: Feb 23 - Mar 1
        { display: 'Feb 23', isCurrentMonth: true },
        { display: 'Feb 24', isCurrentMonth: true },
        { display: 'Feb 25', isCurrentMonth: true },
        { display: 'Feb 26', isCurrentMonth: true },
        { display: 'Feb 27', isCurrentMonth: true },
        { display: 'Feb 28', isCurrentMonth: true },
        { display: 'Mar 1', isCurrentMonth: false },
    ];

    return (
        <div className="flex flex-col h-full">
            {/* Controls Toolbar - matching Timesheets page style */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                {/* Left Controls */}
                <div className="flex items-center gap-3">
                    {/* Date Picker Trigger */}
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

            {/* Calendar Grid Container - outer clips, inner scrolls */}
            <div className="flex-1 border border-gray-200 rounded-lg overflow-hidden flex flex-col">
                {/* Scrollable wrapper */}
                <div className="overflow-x-auto flex-1">
                    {/* Inner content with minimum width (7 columns × 210px = 1470px) */}
                    <div className="min-w-[1470px] h-full flex flex-col">
                        {/* Calendar Header Row */}
                        <div className="grid grid-cols-7 border-b border-gray-200 bg-white">
                            {DAYS.map((day) => (
                                <div
                                    key={day}
                                    className="min-w-[210px] px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide border-r border-gray-100 last:border-r-0"
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Body - fills remaining space */}
                        <div className="bg-white flex-1 flex flex-col">
                            {[0, 1, 2, 3, 4].map((weekIndex) => (
                                <div key={weekIndex} className="grid grid-cols-7 border-b border-gray-100 last:border-b-0 flex-1">
                                    {CALENDAR_DAYS.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day, dayIndex) => (
                                        <div
                                            key={dayIndex}
                                            className="min-w-[210px] px-4 py-3 border-r border-gray-100 last:border-r-0 hover:bg-gray-50 transition-colors"
                                        >
                                            <span
                                                className={cn(
                                                    "text-sm",
                                                    day.isCurrentMonth
                                                        ? "text-brand-dark font-medium"
                                                        : "text-gray-300"
                                                )}
                                            >
                                                {day.display}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
