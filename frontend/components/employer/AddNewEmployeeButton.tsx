'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';
import { AddEmployeeModal } from '@/components/employer/AddEmployeeModal';

export function AddNewEmployeeButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
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

            <AddEmployeeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
