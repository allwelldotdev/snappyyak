'use client';

import { X, Monitor, HelpCircle, Info } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AddEmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddEmployeeModal({ isOpen, onClose }: AddEmployeeModalProps) {
    const [selectedType, setSelectedType] = useState<'company' | 'personal' | null>(null);
    const router = useRouter();

    const handlePersonalComputersClick = () => {
        setSelectedType('personal');
        onClose();
        router.push('/employer/employees/add');
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-brand-dark font-heading">
                            Add New Employees &amp; Download
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* Title */}
                        <h3 className="text-center text-lg font-medium text-brand-dark mb-3">
                            Choose Your Employee&apos;s Computer Type
                        </h3>

                        {/* Help Link */}
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <HelpCircle className="w-5 h-5 text-amber-400" />
                            <a
                                href="#"
                                className="text-sm text-brand-indigo hover:underline"
                            >
                                Not sure which to choose? Learn here.
                            </a>
                        </div>

                        {/* Selection Cards */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {/* Company Computers */}
                            <button
                                onClick={() => setSelectedType('company')}
                                className={`p-6 rounded-xl border-2 transition-all text-left hover:shadow-md ${selectedType === 'company'
                                    ? 'border-brand-indigo bg-indigo-50/50'
                                    : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
                                    }`}
                            >
                                {/* Icon */}
                                <div className="flex justify-center mb-4">
                                    <Monitor className="w-12 h-12 text-gray-400" />
                                </div>

                                {/* Description */}
                                <p className="text-sm text-gray-500 text-center mb-4">
                                    Employees work on company-owned computers, and only admins will be able to modify tracking settings.
                                </p>

                                {/* Label */}
                                <p className={`text-center font-semibold ${selectedType === 'company' ? 'text-brand-indigo' : 'text-brand-indigo'
                                    }`}>
                                    Company Computers
                                </p>
                            </button>

                            {/* Personal Computers */}
                            <button
                                onClick={handlePersonalComputersClick}
                                className={`p-6 rounded-xl border-2 transition-all text-left hover:shadow-md ${selectedType === 'personal'
                                    ? 'border-brand-indigo bg-indigo-50/50'
                                    : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
                                    }`}
                            >
                                {/* Icon - Person at desk */}
                                <div className="flex justify-center mb-4">
                                    <svg className="w-12 h-12 text-gray-400" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        {/* Head */}
                                        <circle cx="24" cy="12" r="6" fill="currentColor" />
                                        {/* Body/Desk */}
                                        <path d="M14 42V32C14 28 18 26 24 26C30 26 34 28 34 32V42" stroke="currentColor" strokeWidth="2" fill="none" />
                                        {/* Laptop */}
                                        <rect x="16" y="34" width="16" height="2" rx="1" fill="currentColor" />
                                        <rect x="18" y="30" width="12" height="4" rx="1" fill="currentColor" />
                                    </svg>
                                </div>

                                {/* Description */}
                                <p className="text-sm text-gray-500 text-center mb-4">
                                    Employees work on their personal computers and should have the ability to control when Insightful tracks their activities.
                                </p>

                                {/* Label */}
                                <p className={`text-center font-semibold ${selectedType === 'personal' ? 'text-brand-indigo' : 'text-brand-indigo'
                                    }`}>
                                    Personal Computers
                                </p>
                            </button>
                        </div>

                        {/* Info Banner */}
                        <div className="flex items-center gap-3 bg-amber-50 rounded-lg px-4 py-3">
                            <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />
                            <p className="text-sm text-gray-700">
                                Adding computers will impact your billing.{' '}
                                <a href="#" className="text-brand-indigo font-medium hover:underline">
                                    Learn More here.
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
