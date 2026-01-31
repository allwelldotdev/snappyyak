'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, X } from 'lucide-react';
import { format, subDays, startOfMonth, startOfWeek, endOfMonth, endOfWeek, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import { cn } from '@/lib/utils';

interface CalendarModalProps {
    isOpen: boolean;
    onClose: () => void;
    triggerRef: React.RefObject<HTMLElement | null>;
}

export function CalendarModal({ isOpen, onClose, triggerRef }: CalendarModalProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [selectedPreset, setSelectedPreset] = useState('Today');
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const popoverRef = useRef<HTMLDivElement>(null);

    // Calculate Position
    useEffect(() => {
        if (isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            // Position bottom-left of trigger, adding scroll offset
            setPosition({
                top: rect.bottom + window.scrollY + 8, // 8px gap
                left: rect.left + window.scrollX,
            });
        }
    }, [isOpen, triggerRef]);

    // Click Away Listener
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node) && triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
                // Check if the click was on the trigger button itself, usually handled by toggle logic in parent, 
                // but for safety we only close if clicking OUTSIDE both.
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose, triggerRef]);

    const presets = [
        { label: 'Today', action: () => setSelectedDate(new Date()) },
        { label: 'Yesterday', action: () => setSelectedDate(subDays(new Date(), 1)) },
        { label: 'This Week', action: () => setSelectedDate(startOfWeek(new Date())) },
        { label: 'Last 7 Days', action: () => setSelectedDate(subDays(new Date(), 7)) },
        { label: 'Previous Week', action: () => setSelectedDate(subDays(startOfWeek(new Date()), 7)) },
        { label: 'This Month', action: () => setSelectedDate(startOfMonth(new Date())) },
        { label: 'Previous Month', action: () => setSelectedDate(startOfMonth(subMonths(new Date(), 1))) },
        { label: 'Last 3 Months', action: () => setSelectedDate(subMonths(new Date(), 3)) },
        { label: 'Last 6 Months', action: () => setSelectedDate(subMonths(new Date(), 6)) },
    ];

    const handlePresetClick = (label: string, action: () => void) => {
        setSelectedPreset(label);
        action();
    };

    if (!isOpen) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Transparent Backdrop for click-away safety */}
                    <div className="fixed inset-0 z-40 bg-transparent" aria-hidden="true" />

                    <motion.div
                        ref={popoverRef}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            top: position.top,
                            left: position.left,
                        }}
                        className="absolute z-50 bg-white rounded-xl shadow-2xl border border-gray-100 w-auto flex flex-col font-body overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 min-w-[500px]">
                            <h2 className="text-xs font-bold text-black uppercase tracking-wide">CALENDAR</h2>

                            <div className="flex items-center gap-2 text-xs font-medium text-brand-dark bg-white px-2 py-1 rounded-md border border-gray-200 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
                                <Globe className="w-3.5 h-3.5 text-indigo-500" />
                                <span>Employees' Time Zone</span>
                                <div className="ml-1 w-0 h-0 border-l-[3px] border-l-transparent border-t-[3px] border-t-gray-500 border-r-[3px] border-r-transparent" />
                            </div>
                        </div>

                        <div className="flex">
                            {/* Calendar Grid Area */}
                            <div className="p-4 border-r border-gray-100">
                                <DayPicker
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    showOutsideDays
                                    classNames={{
                                        root: 'p-0',
                                        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                                        month: 'space-y-2',
                                        caption: 'flex items-center justify-between mb-2 px-1 relative', // Flex container for Title + Nav
                                        caption_label: 'text-sm font-bold text-gray-800 font-heading uppercase tracking-wide',
                                        nav: 'flex items-center gap-1', // Nav sits naturally in the flex "end"
                                        nav_button: 'h-7 w-7 bg-transparent hover:bg-indigo-50 p-0 rounded-md flex items-center justify-center transition-colors text-gray-400 hover:text-indigo-600',
                                        nav_button_previous: '',
                                        nav_button_next: '',
                                        table: 'border-collapse space-y-1', // Removed w-full to let it shrink
                                        head_row: 'flex mb-2',
                                        head_cell: 'text-gray-400 rounded-md w-9 font-medium text-[0.7rem] flex justify-center uppercase',
                                        row: 'flex mt-1',
                                        cell: 'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-indigo-50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md',
                                        day: 'h-9 w-9 p-0 font-medium aria-selected:opacity-100 hover:bg-gray-100 rounded-full transition-colors text-brand-dark text-sm',
                                        day_selected: 'bg-indigo-600 text-white hover:bg-indigo-600 hover:text-white focus:bg-indigo-600 focus:text-white rounded-full',
                                        day_today: 'text-indigo-600 font-bold',
                                        day_outside: 'text-gray-300 opacity-50',
                                        day_disabled: 'text-gray-300 opacity-50',
                                        day_hidden: 'invisible',
                                    }}
                                />
                            </div>

                            {/* Presets Sidebar */}
                            <div className="w-48 bg-white p-4 flex flex-col">
                                <h3 className="text-xs font-semibold text-gray-900 mb-3 uppercase tracking-wider">Preset Filters</h3>
                                <div className="flex flex-col gap-1">
                                    {presets.map((preset) => (
                                        <button
                                            key={preset.label}
                                            onClick={() => handlePresetClick(preset.label, preset.action)}
                                            className={`
                                                px-3 py-2 text-sm text-left rounded-md transition-all font-medium
                                                ${selectedPreset === preset.label
                                                    ? 'bg-indigo-50 text-indigo-700'
                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                }
                                            `}
                                        >
                                            {preset.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-3 border-t border-gray-100 bg-white flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-1.5 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onClose}
                                className="px-4 py-1.5 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm transition-all"
                            >
                                Apply
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
