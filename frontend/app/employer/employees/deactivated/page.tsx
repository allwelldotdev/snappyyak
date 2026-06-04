'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calendar as CalendarIcon, Search, Columns, Loader2 } from 'lucide-react';
import { Tooltip } from '@/components/ui/Tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { useAuth } from '@/components/providers/AuthProvider';

interface Employee {
    id: number;
    email: string;
    fullname: string;
    status: string;
    onboarded: boolean;
    created_at: string;
    work_time: string;
    manual_time: string;
    computer_activity: string;
    productive_time: string;
    unproductive_time: string;
}

const AVATAR_COLORS = [
    { bg: 'bg-gray-100', text: 'text-gray-500' },
    { bg: 'bg-slate-100', text: 'text-slate-500' },
    { bg: 'bg-zinc-100', text: 'text-zinc-500' },
    { bg: 'bg-neutral-100', text: 'text-neutral-500' },
];

function getAvatarColor(index: number) {
    return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

function getInitials(fullname: string): string {
    const parts = fullname.trim().split(/\s+/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return fullname.slice(0, 2).toUpperCase();
}

export default function DeactivatedEmployeesPage() {
    const { token } = useAuth();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const COLUMN_DEFINITIONS = [
        { key: 'team', label: 'Team', headerClass: "min-w-[150px] whitespace-nowrap" },
        { key: 'location', label: 'Location', headerClass: "min-w-[150px] whitespace-nowrap" },
        { key: 'status', label: 'Status', headerClass: "whitespace-nowrap" },
        { key: 'workTime', label: 'Work Time [h]', headerClass: "whitespace-nowrap" },
        { key: 'computerAct', label: 'Computer Act. [h]', headerClass: "whitespace-nowrap" },
    ];

    const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};
        COLUMN_DEFINITIONS.forEach(col => initial[col.key] = true);
        return initial;
    });

    const toggleColumn = (key: string) => {
        setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const fetchEmployees = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        setError('');
        try {
            const response = await fetch(
                'http://localhost:8080/api/employer/employees?status=deactivated',
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to fetch employees');
            }

            const data = await response.json();
            setEmployees(data.employees || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    const filteredEmployees = employees.filter(emp =>
        emp.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center flex-1 py-20">
                <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
                <p className="text-gray-500 mt-4">Loading deactivated employees...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center flex-1 py-20">
                <div className="bg-red-50 text-red-600 px-6 py-4 rounded-lg text-sm">
                    {error}
                </div>
                <button
                    onClick={fetchEmployees}
                    className="mt-4 text-sm text-brand-orange hover:underline"
                >
                    Try again
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Controls Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-3 py-2 bg-indigo-50/50 hover:bg-indigo-50 text-brand-indigo rounded-lg text-sm font-medium border border-transparent transition-colors shadow-sm">
                        <CalendarIcon className="w-4 h-4" />
                        <span>Today</span>
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-gray-50 border-none rounded-lg pl-9 pr-4 py-2 text-sm text-brand-dark focus:ring-1 focus:ring-brand-orange/50 focus:outline-none w-64"
                        />
                    </div>

                    <Popover>
                        <Tooltip content="Edit Columns">
                            <PopoverTrigger asChild>
                                <button className="p-2 text-gray-500 hover:text-brand-dark border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white shadow-sm">
                                    <Columns className="w-4 h-4" />
                                </button>
                            </PopoverTrigger>
                        </Tooltip>

                        <PopoverContent align="end" className="w-[300px] p-4">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-2">
                                    <h4 className="font-heading font-bold text-brand-dark">Edit Columns</h4>
                                </div>
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

            {/* Content */}
            {filteredEmployees.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 flex flex-col justify-center overflow-hidden min-h-[400px]">
                    <EmptyState
                        title="No deactivated employees"
                        description="Deactivated employees will appear here."
                    />
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
                    <div className="overflow-auto flex-1 relative">
                        <table className="border-collapse text-sm text-left w-full">
                            <thead className="bg-white sticky top-0 z-20">
                                <tr>
                                    <th className="sticky left-0 bg-white z-20 p-4 font-medium text-gray-500 border-b border-gray-100 border-r border-gray-100 min-w-[250px] whitespace-nowrap shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                        Employee Name
                                    </th>
                                    {COLUMN_DEFINITIONS.map(col => visibleColumns[col.key] && (
                                        <th key={col.key} className={`p-4 font-medium text-gray-500 border-b border-gray-100 ${col.headerClass}`}>
                                            {col.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredEmployees.map((emp, idx) => {
                                    const color = getAvatarColor(idx);
                                    const initials = getInitials(emp.fullname);
                                    return (
                                        <tr key={emp.id} className="hover:bg-gray-50 transition-colors group opacity-60">
                                            <td className="sticky left-0 bg-white group-hover:bg-gray-50 z-10 p-4 border-r border-gray-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full ${color.bg} ${color.text} flex items-center justify-center font-bold text-sm`}>
                                                        {initials}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-brand-dark">{emp.fullname}</div>
                                                        <div className="text-xs text-gray-400">{emp.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            {visibleColumns['team'] && <td className="p-4 font-medium text-gray-400">—</td>}
                                            {visibleColumns['location'] && <td className="p-4 font-medium text-gray-400">—</td>}
                                            {visibleColumns['status'] && (
                                                <td className="p-4">
                                                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">Deactivated</span>
                                                </td>
                                            )}
                                            {visibleColumns['workTime'] && <td className="p-4 font-medium text-gray-400">--</td>}
                                            {visibleColumns['computerAct'] && <td className="p-4 font-medium text-gray-400">--</td>}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
