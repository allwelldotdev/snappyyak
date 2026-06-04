'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon, Download, Bell, ArrowRightLeft } from 'lucide-react';
import { Tooltip } from '@/components/ui/Tooltip';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { AddEmployeeModal } from '@/components/employer/AddEmployeeModal';

export default function EmployerDashboard() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="flex flex-col h-full">
            {/* Header with Title and Add Employee Button */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h1 className="text-2xl font-bold font-heading text-brand-dark">Productivity Trends</h1>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-brand-orange hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                    >
                        Add New Employee
                    </button>

                    {/* Alert Icon with Notification Badge */}
                    <button className="relative p-2 text-gray-500 hover:text-brand-dark transition-colors group">
                        <span className="sr-only">Notifications</span>
                        <Bell className="w-6 h-6 text-gray-600 group-hover:text-brand-dark transition-colors" />
                        <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white border-2 border-white">
                            3
                        </span>
                    </button>
                </div>
            </div>

            {/* Controls Row */}
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
                {/* Left Controls - Periods */}
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-start gap-1">
                        <span className="text-sm font-medium text-gray-500">Reference Period:</span>
                        <button className="flex items-center gap-2 px-3 py-2 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium border border-transparent transition-colors shadow-sm">
                            <CalendarIcon className="w-4 h-4" />
                            <span>Jan 26, 2026</span>
                        </button>
                    </div>

                    <div className="flex items-center justify-center pt-6">
                        <ArrowRightLeft className="w-5 h-5 text-indigo-600" />
                    </div>

                    <div className="flex flex-col items-start gap-1">
                        <span className="text-sm font-medium text-gray-500">Compared Period:</span>
                        <button className="flex items-center gap-2 px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg text-sm font-medium border border-indigo-100 transition-colors shadow-sm">
                            <CalendarIcon className="w-4 h-4" />
                            <span>Jan 19, 2026</span>
                        </button>
                    </div>

                    {/* Add Filter */}
                    <button className="flex items-center gap-2 px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg text-sm font-medium border border-indigo-100 transition-colors self-end">
                        <span className="text-lg leading-none">+</span>
                        <span>Add Filter</span>
                    </button>
                </div>

                {/* Right Controls - Actions */}
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
                    title="No data for the selected period"
                // description="There is no productivity data available for the reference period you have selected. Try selecting a different date range or invite employees to start tracking time."
                />
            </div>

            {/* Add Employee Modal */}
            <AddEmployeeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
