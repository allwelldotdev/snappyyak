'use client';

import * as React from 'react';
import { DayPicker, type DateRange } from 'react-day-picker';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn('p-3', className)}
            classNames={{
                months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                month: 'space-y-4',
                caption: 'flex justify-center pt-1 relative items-center',
                caption_label: 'text-sm font-medium text-brand-dark',
                nav: 'space-x-1 flex items-center',
                nav_button: cn(
                    'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                    'inline-flex items-center justify-center rounded-md',
                    'text-brand-dark hover:bg-gray-100 transition-colors'
                ),
                nav_button_previous: 'absolute left-1',
                nav_button_next: 'absolute right-1',
                table: 'w-full border-collapse space-y-1',
                head_row: 'flex',
                head_cell: 'text-gray-500 rounded-md w-9 font-normal text-[0.8rem]',
                row: 'flex w-full mt-2',
                cell: cn(
                    'relative h-9 w-9 text-center text-sm p-0',
                    'focus-within:relative focus-within:z-20',
                    '[&:has([aria-selected])]:bg-violet-100',
                    '[&:has([aria-selected].day-range-end)]:rounded-r-md',
                    '[&:has([aria-selected].day-range-start)]:rounded-l-md',
                    'first:[&:has([aria-selected])]:rounded-l-md',
                    'last:[&:has([aria-selected])]:rounded-r-md'
                ),
                day: cn(
                    'h-9 w-9 p-0 font-normal',
                    'inline-flex items-center justify-center rounded-md',
                    'hover:bg-gray-100 transition-colors',
                    'aria-selected:opacity-100'
                ),
                day_range_start: 'day-range-start bg-violet-500 text-white hover:bg-violet-500',
                day_range_end: 'day-range-end bg-violet-500 text-white hover:bg-violet-500',
                day_selected: 'bg-violet-500 text-white hover:bg-violet-500 hover:text-white focus:bg-violet-500 focus:text-white',
                day_today: 'bg-violet-500 text-white',
                day_outside: 'text-gray-400 opacity-50',
                day_disabled: 'text-gray-400 opacity-50',
                day_range_middle: 'aria-selected:bg-violet-100 aria-selected:text-brand-dark',
                day_hidden: 'invisible',
                ...classNames,
            }}
            components={{
                Chevron: ({ orientation }) => {
                    const Icon = orientation === 'left' ? ChevronLeft : ChevronRight;
                    return <Icon className="h-4 w-4" />;
                },
            }}
            {...props}
        />
    );
}
Calendar.displayName = 'Calendar';

export { Calendar, type DateRange };
