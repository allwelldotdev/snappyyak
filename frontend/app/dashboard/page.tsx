'use client';

import { useState, useRef } from 'react';
import { Search, Download, Columns, Calendar } from 'lucide-react';
import { Tooltip } from '@/components/ui/Tooltip';
import { Modal } from '@/components/ui/Modal';
import { CalendarModal } from '@/components/dashboard/CalendarModal';

export default function Dashboard() {
    // Auth check is now handled in layout.tsx
    const [isColumnsModalOpen, setIsColumnsModalOpen] = useState(false);
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
    const calendarTriggerRef = useRef<HTMLButtonElement>(null);

    // Modular styling for active tab
    const activeTabClass = "px-1 py-2 text-brand-orange border-b-2 border-brand-orange text-sm font-medium";

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold font-heading text-brand-dark mb-4">Employees</h1>
                <div className="border-b border-gray-200">
                    <button className={activeTabClass}>
                        Active
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2">
                    <button
                        ref={calendarTriggerRef}
                        onClick={() => setIsCalendarModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors"
                    >
                        <Calendar className="w-4 h-4" />
                        Today
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="bg-gray-50 border-none rounded-lg pl-9 pr-4 py-2 text-sm text-brand-dark focus:ring-1 focus:ring-brand-orange/50 focus:outline-none w-64"
                        />
                    </div>

                    <Tooltip content="Export Data">
                        <button className="p-2 text-gray-500 hover:text-brand-dark border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <Download className="w-4 h-4" />
                        </button>
                    </Tooltip>

                    <Tooltip content="Edit Columns">
                        <button
                            onClick={() => setIsColumnsModalOpen(true)}
                            className="p-2 text-gray-500 hover:text-brand-dark border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Columns className="w-4 h-4" />
                        </button>
                    </Tooltip>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
                <div className="overflow-auto flex-1 relative">
                    <table className="w-full min-w-[1500px] border-collapse text-sm text-left">
                        <thead className="bg-white sticky top-0 z-20">
                            <tr>
                                {/* Sticky Column Header */}
                                <th className="sticky left-0 bg-white z-20 p-4 font-medium text-gray-500 border-b border-gray-100 w-[250px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                    Employee Name
                                </th>
                                {/* Scrollable Headers */}
                                <th className="p-4 font-medium text-gray-500 border-b border-gray-100 min-w-[220px]">Team</th>
                                <th className="p-4 font-medium text-gray-500 border-b border-gray-100 min-w-[220px]">Location</th>
                                <th className="p-4 font-medium text-gray-500 border-b border-gray-100">Work Time [h]</th>
                                <th className="p-4 font-medium text-gray-500 border-b border-gray-100">Computer Act. [h]</th>
                                <th className="p-4 font-medium text-gray-500 border-b border-gray-100">Productive [h]</th>
                                <th className="p-4 font-medium text-gray-500 border-b border-gray-100">Unproductive [h]</th>
                                <th className="p-4 font-medium text-gray-500 border-b border-gray-100">Neutral [h]</th>
                                <th className="p-4 font-medium text-gray-500 border-b border-gray-100">Break Time [h]</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {/* Mock Data Row */}
                            <tr className="hover:bg-gray-50 transition-colors group">
                                {/* Sticky Column Data */}
                                <td className="sticky left-0 bg-white group-hover:bg-gray-50 z-10 p-4 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-orange-100 text-brand-orange flex items-center justify-center font-bold text-xs">
                                            AL
                                        </div>
                                        <div>
                                            <div className="font-medium text-brand-dark">Allwell</div>
                                        </div>
                                    </div>
                                </td>
                                {/* Scrollable Data */}
                                <td className="p-4 font-medium text-brand-dark">Default team</td>
                                <td className="p-4 font-medium text-brand-dark">Undetermined</td>
                                <td className="p-4 font-medium text-brand-dark">00:00</td>
                                <td className="p-4 font-medium text-brand-dark">00:00</td>
                                <td className="p-4 font-medium text-emerald-500">00:00</td>
                                <td className="p-4 font-medium text-red-500">00:00</td>
                                <td className="p-4 font-medium text-brand-dark">00:00</td>
                                <td className="p-4 font-medium text-brand-dark">00:00</td>
                            </tr>

                            {/* Detailed Placeholder Row (User 1) */}
                            <tr className="hover:bg-gray-50 transition-colors group">
                                <td className="sticky left-0 bg-white group-hover:bg-gray-50 z-10 p-4 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                            JD
                                        </div>
                                        <div>
                                            <div className="font-medium text-brand-dark">John Doe</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 font-medium text-brand-dark">Engineering</td>
                                <td className="p-4 font-medium text-brand-dark">New York, USA</td>
                                <td className="p-4 font-medium text-brand-dark">07:45</td>
                                <td className="p-4 font-medium text-brand-dark">07:30</td>
                                <td className="p-4 font-medium text-emerald-500">06:45</td>
                                <td className="p-4 font-medium text-red-500">00:30</td>
                                <td className="p-4 font-medium text-brand-dark">00:15</td>
                                <td className="p-4 font-medium text-brand-dark">01:00</td>
                            </tr>

                            {/* Detailed Placeholder Row (User 2) */}
                            <tr className="hover:bg-gray-50 transition-colors group">
                                <td className="sticky left-0 bg-white group-hover:bg-gray-50 z-10 p-4 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
                                            JS
                                        </div>
                                        <div>
                                            <div className="font-medium text-brand-dark">Jane Smith</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 font-medium text-brand-dark">Design</td>
                                <td className="p-4 font-medium text-brand-dark">London, UK</td>
                                <td className="p-4 font-medium text-brand-dark">08:00</td>
                                <td className="p-4 font-medium text-brand-dark">07:50</td>
                                <td className="p-4 font-medium text-emerald-500">07:00</td>
                                <td className="p-4 font-medium text-red-500">00:20</td>
                                <td className="p-4 font-medium text-brand-dark">00:30</td>
                                <td className="p-4 font-medium text-brand-dark">01:00</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Calendar Modal */}
            <CalendarModal
                isOpen={isCalendarModalOpen}
                onClose={() => setIsCalendarModalOpen(false)}
                triggerRef={calendarTriggerRef}
            />

            {/* Filter Columns Modal */}
            <Modal
                isOpen={isColumnsModalOpen}
                onClose={() => setIsColumnsModalOpen(false)}
                title="Edit Columns"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-500 mb-4">Select columns to display in the table.</p>
                    <div className="grid grid-cols-2 gap-3">
                        {['Team', 'Location', 'Work Time', 'Computer Act.', 'Productive', 'Unproductive', 'Neutral', 'Break Time'].map((col) => (
                            <label key={col} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded-lg">
                                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-brand-orange focus:ring-brand-orange" />
                                <span className="text-sm text-brand-dark">{col}</span>
                            </label>
                        ))}
                    </div>
                    <div className="flex justify-end pt-4 border-t border-gray-100 mt-4">
                        <button
                            onClick={() => setIsColumnsModalOpen(false)}
                            className="bg-brand-dark text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                        >
                            Apply Changes
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
