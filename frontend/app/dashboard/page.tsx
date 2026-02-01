'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Download, Columns } from 'lucide-react';
import { Tooltip } from '@/components/ui/Tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DateRangePicker } from '@/components/dashboard/DateRangePicker';
import { type DateRange } from '@/components/ui/calendar';

export default function Dashboard() {
    // Auth check is now handled in layout.tsx
    const router = useRouter();
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

    // Column Definitions
    const COLUMN_DEFINITIONS = [
        { key: 'team', label: 'Team', headerClass: "min-w-[220px] whitespace-nowrap" },
        { key: 'location', label: 'Location', headerClass: "min-w-[220px] whitespace-nowrap" },
        { key: 'workTime', label: 'Work Time [h]', headerClass: "whitespace-nowrap" },
        { key: 'computerAct', label: 'Computer Act. [h]', headerClass: "whitespace-nowrap" },
        { key: 'productive', label: 'Productive [h]', headerClass: "whitespace-nowrap" },
        { key: 'unproductive', label: 'Unproductive [h]', headerClass: "whitespace-nowrap" },
        { key: 'neutral', label: 'Neutral [h]', headerClass: "whitespace-nowrap" },
        { key: 'breakTime', label: 'Break Time [h]', headerClass: "whitespace-nowrap" },
    ];

    // Visibility State
    const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};
        COLUMN_DEFINITIONS.forEach(col => initial[col.key] = true);
        return initial;
    });

    const toggleColumn = (key: string) => {
        setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }));
    };

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
                    <DateRangePicker
                        selectedRange={dateRange}
                        onUpdate={setDateRange}
                    />
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

                    {/* Columns Popover */}
                    <Popover>
                        <Tooltip content="Edit Columns">
                            <PopoverTrigger asChild>
                                <button className="p-2 text-gray-500 hover:text-brand-dark border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                    <Columns className="w-4 h-4" />
                                </button>
                            </PopoverTrigger>
                        </Tooltip>

                        <PopoverContent align="end" className="w-[300px] p-4">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-2">
                                    <h4 className="font-heading font-bold text-brand-dark">Edit Columns</h4>
                                </div>
                                <p className="text-xs text-gray-500 mb-3">Select columns to display in the table.</p>
                                <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto">
                                    {COLUMN_DEFINITIONS.map((col) => (
                                        <label key={col.key} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={visibleColumns[col.key]}
                                                onChange={() => toggleColumn(col.key)}
                                                className="rounded border-gray-300 text-brand-orange focus:ring-brand-orange"
                                            />
                                            <span className="text-sm text-brand-dark">{col.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
                <div className="overflow-auto flex-1 relative">
                    <table className="border-collapse text-sm text-left">
                        <thead className="bg-white sticky top-0 z-20">
                            <tr>
                                {/* Sticky Column Header */}
                                <th className="sticky left-0 bg-white z-20 p-4 font-medium text-gray-500 border-b border-gray-100 min-w-[250px] whitespace-nowrap shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                    Employee Name
                                </th>
                                {/* Scrollable Headers */}
                                {COLUMN_DEFINITIONS.map(col => visibleColumns[col.key] && (
                                    <th key={col.key} className={`p-4 font-medium text-gray-500 border-b border-gray-100 ${col.headerClass}`}>
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {/* Mock Data Row */}
                            <tr className="hover:bg-gray-50 transition-colors group">
                                {/* Sticky Column Data */}
                                <td
                                    onClick={() => router.push('/dashboard/employees/allwell')}
                                    className="sticky left-0 bg-white group-hover:bg-gray-50 z-10 p-4 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] cursor-pointer"
                                >
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
                                {visibleColumns['team'] && <td className="p-4 font-medium text-brand-dark">Default team</td>}
                                {visibleColumns['location'] && <td className="p-4 font-medium text-brand-dark">Undetermined</td>}
                                {visibleColumns['workTime'] && <td className="p-4 font-medium text-brand-dark">00:00</td>}
                                {visibleColumns['computerAct'] && <td className="p-4 font-medium text-brand-dark">00:00</td>}
                                {visibleColumns['productive'] && <td className="p-4 font-medium text-emerald-500">00:00</td>}
                                {visibleColumns['unproductive'] && <td className="p-4 font-medium text-red-500">00:00</td>}
                                {visibleColumns['neutral'] && <td className="p-4 font-medium text-brand-dark">00:00</td>}
                                {visibleColumns['breakTime'] && <td className="p-4 font-medium text-brand-dark">00:00</td>}
                            </tr>

                            {/* Detailed Placeholder Row (User 1) */}
                            <tr className="hover:bg-gray-50 transition-colors group">
                                <td
                                    onClick={() => router.push('/dashboard/employees/john-doe')}
                                    className="sticky left-0 bg-white group-hover:bg-gray-50 z-10 p-4 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                            JD
                                        </div>
                                        <div>
                                            <div className="font-medium text-brand-dark">John Doe</div>
                                        </div>
                                    </div>
                                </td>
                                {visibleColumns['team'] && <td className="p-4 font-medium text-brand-dark">Engineering</td>}
                                {visibleColumns['location'] && <td className="p-4 font-medium text-brand-dark">New York, USA</td>}
                                {visibleColumns['workTime'] && <td className="p-4 font-medium text-brand-dark">07:45</td>}
                                {visibleColumns['computerAct'] && <td className="p-4 font-medium text-brand-dark">07:30</td>}
                                {visibleColumns['productive'] && <td className="p-4 font-medium text-emerald-500">06:45</td>}
                                {visibleColumns['unproductive'] && <td className="p-4 font-medium text-red-500">00:30</td>}
                                {visibleColumns['neutral'] && <td className="p-4 font-medium text-brand-dark">00:15</td>}
                                {visibleColumns['breakTime'] && <td className="p-4 font-medium text-brand-dark">01:00</td>}
                            </tr>

                            {/* Detailed Placeholder Row (User 2) */}
                            <tr className="hover:bg-gray-50 transition-colors group">
                                <td
                                    onClick={() => router.push('/dashboard/employees/jane-smith')}
                                    className="sticky left-0 bg-white group-hover:bg-gray-50 z-10 p-4 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
                                            JS
                                        </div>
                                        <div>
                                            <div className="font-medium text-brand-dark">Jane Smith</div>
                                        </div>
                                    </div>
                                </td>
                                {visibleColumns['team'] && <td className="p-4 font-medium text-brand-dark">Design</td>}
                                {visibleColumns['location'] && <td className="p-4 font-medium text-brand-dark">London, UK</td>}
                                {visibleColumns['workTime'] && <td className="p-4 font-medium text-brand-dark">08:00</td>}
                                {visibleColumns['computerAct'] && <td className="p-4 font-medium text-brand-dark">07:50</td>}
                                {visibleColumns['productive'] && <td className="p-4 font-medium text-emerald-500">07:00</td>}
                                {visibleColumns['unproductive'] && <td className="p-4 font-medium text-red-500">00:20</td>}
                                {visibleColumns['neutral'] && <td className="p-4 font-medium text-brand-dark">00:30</td>}
                                {visibleColumns['breakTime'] && <td className="p-4 font-medium text-brand-dark">01:00</td>}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div >
        </div >
    );
}
