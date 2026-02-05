'use client';

import * as React from 'react';
import { useState } from 'react';
import { Calendar as CalendarIcon, Globe } from 'lucide-react';
import {
    format,
    startOfToday,
    startOfYesterday,
    endOfYesterday,
    subDays,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    subMonths,
} from 'date-fns';

import { cn } from '@/lib/utils';
import { Calendar, type DateRange } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface DateRangePickerProps {
    selectedRange?: DateRange;
    onUpdate: (range: DateRange | undefined) => void;
    className?: string;
}

const presets = [
    {
        label: 'Today',
        getValue: () => ({
            from: startOfToday(),
            to: startOfToday(),
        }),
    },
    {
        label: 'Yesterday',
        getValue: () => ({
            from: startOfYesterday(),
            to: endOfYesterday(),
        }),
    },
    {
        label: 'This Week',
        getValue: () => ({
            from: startOfWeek(new Date(), { weekStartsOn: 0 }),
            to: endOfWeek(new Date(), { weekStartsOn: 0 }),
        }),
    },
    {
        label: 'Last 7 Days',
        getValue: () => ({
            from: subDays(new Date(), 6),
            to: new Date(),
        }),
    },
    {
        label: 'Previous Week',
        getValue: () => {
            const lastWeek = subDays(new Date(), 7);
            return {
                from: startOfWeek(lastWeek, { weekStartsOn: 0 }),
                to: endOfWeek(lastWeek, { weekStartsOn: 0 }),
            };
        },
    },
    {
        label: 'This Month',
        getValue: () => ({
            from: startOfMonth(new Date()),
            to: endOfMonth(new Date()),
        }),
    },
    {
        label: 'Previous Month',
        getValue: () => {
            const lastMonth = subMonths(new Date(), 1);
            return {
                from: startOfMonth(lastMonth),
                to: endOfMonth(lastMonth),
            };
        },
    },
    {
        label: 'Last 3 Months',
        getValue: () => ({
            from: startOfMonth(subMonths(new Date(), 2)),
            to: endOfMonth(new Date()),
        }),
    },
    {
        label: 'Last 6 Months',
        getValue: () => ({
            from: startOfMonth(subMonths(new Date(), 5)),
            to: endOfMonth(new Date()),
        }),
    },
];

const timezones = [
    { value: 'employee', label: "Employees' Time Zone" },
    { value: 'utc', label: 'UTC' },
    { value: 'local', label: 'Local Time' },
    { value: 'est', label: 'EST (UTC-5)' },
    { value: 'pst', label: 'PST (UTC-8)' },
];

export function DateRangePicker({
    selectedRange,
    onUpdate,
    className,
}: DateRangePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [internalRange, setInternalRange] = useState<DateRange | undefined>(selectedRange);
    const [timezone, setTimezone] = useState('employee');
    const [activePreset, setActivePreset] = useState<string | null>('Today');

    // Sync external prop with internal state when popover opens
    React.useEffect(() => {
        if (isOpen) {
            setInternalRange(selectedRange);
        }
    }, [isOpen, selectedRange]);

    const handlePresetClick = (preset: (typeof presets)[0]) => {
        setInternalRange(preset.getValue());
        setActivePreset(preset.label);
    };

    const handleCalendarSelect = (range: DateRange | undefined) => {
        setInternalRange(range);
        setActivePreset(null); // Clear preset selection when manually selecting dates
    };

    const handleApply = () => {
        onUpdate(internalRange);
        setIsOpen(false);
    };

    const handleCancel = () => {
        setInternalRange(selectedRange);
        setIsOpen(false);
    };

    const displayLabel = React.useMemo(() => {
        if (selectedRange?.from) {
            if (selectedRange.to && selectedRange.from.getTime() !== selectedRange.to.getTime()) {
                return `${format(selectedRange.from, 'MMM d')} - ${format(selectedRange.to, 'MMM d, yyyy')}`;
            }
            return format(selectedRange.from, 'PPP');
        }
        return 'Today';
    }, [selectedRange]);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <button
                    className={cn(
                        'flex items-center gap-2 px-4 py-2',
                        'bg-indigo-50 text-indigo-600',
                        'rounded-lg text-sm font-medium',
                        'hover:bg-indigo-100 transition-colors',
                        className
                    )}
                >
                    <CalendarIcon className="w-4 h-4" />
                    {displayLabel}
                </button>
            </PopoverTrigger>
            <PopoverContent align="start" sideOffset={8} className="w-auto p-0">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <span className="text-xs font-bold text-brand-dark uppercase tracking-wider">
                        Calendar
                    </span>
                    <Select value={timezone} onValueChange={setTimezone}>
                        <SelectTrigger className="w-[200px] h-9 text-sm border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-indigo-500" />
                                <SelectValue placeholder="Time Zone" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            {timezones.map((tz) => (
                                <SelectItem key={tz.value} value={tz.value}>
                                    {tz.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Body */}
                <div className="flex">
                    {/* Calendar */}
                    <div className="border-r border-gray-100">
                        <Calendar
                            mode="range"
                            defaultMonth={internalRange?.from}
                            selected={internalRange}
                            onSelect={handleCalendarSelect}
                            numberOfMonths={1}
                        />
                    </div>

                    {/* Presets Sidebar */}
                    <div className="flex flex-col p-4 min-w-[160px]">
                        <h4 className="text-sm font-semibold text-brand-dark mb-3">
                            Preset Filters
                        </h4>
                        <div className="flex flex-col gap-0.5">
                            {presets.map((preset) => (
                                <button
                                    key={preset.label}
                                    onClick={() => handlePresetClick(preset)}
                                    className={cn(
                                        'px-3 py-2 text-sm text-left rounded-md transition-colors',
                                        activePreset === preset.label
                                            ? 'bg-indigo-100 text-indigo-600 font-medium'
                                            : 'text-indigo-500 hover:bg-gray-50'
                                    )}
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-4 py-3 border-t border-gray-100">
                    <button
                        onClick={handleCancel}
                        className="px-5 py-2 text-sm font-medium text-indigo-600 border border-indigo-300 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleApply}
                        className="px-5 py-2 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors"
                    >
                        Apply
                    </button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
