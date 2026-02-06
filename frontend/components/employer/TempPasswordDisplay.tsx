'use client';

import { X, Copy, Check, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface TempPasswordDisplayProps {
    isOpen: boolean;
    onClose: () => void;
    employeeEmail: string;
    tempPassword: string;
}

export function TempPasswordDisplay({ isOpen, onClose, employeeEmail, tempPassword }: TempPasswordDisplayProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(tempPassword);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 z-40" />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-brand-dark font-heading">
                            Employee Added Successfully
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
                        {/* Success Icon */}
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                                <Check className="w-8 h-8 text-green-600" />
                            </div>
                        </div>

                        {/* Employee Email */}
                        <p className="text-center text-gray-600 mb-4">
                            <span className="font-medium text-brand-dark">{employeeEmail}</span> has been added.
                        </p>

                        {/* Temp Password Section */}
                        <div className="bg-gray-50 rounded-xl p-4 mb-4">
                            <p className="text-sm text-gray-500 mb-2 text-center">Temporary Password</p>
                            <div className="flex items-center justify-center gap-3">
                                <code className="text-lg font-mono font-semibold text-brand-dark bg-white px-4 py-2 rounded-lg border border-gray-200">
                                    {tempPassword}
                                </code>
                                <button
                                    onClick={handleCopy}
                                    className={`p-2 rounded-lg transition-all ${copied
                                            ? 'bg-green-100 text-green-600'
                                            : 'bg-brand-indigo text-white hover:bg-indigo-700'
                                        }`}
                                    title={copied ? 'Copied!' : 'Copy to clipboard'}
                                >
                                    {copied ? (
                                        <Check className="w-5 h-5" />
                                    ) : (
                                        <Copy className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Warning */}
                        <div className="flex items-start gap-3 bg-amber-50 rounded-lg px-4 py-3">
                            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-gray-700">
                                <strong>Important:</strong> This password will only be shown once. Please copy and share it securely with the employee.
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                        <button
                            onClick={onClose}
                            className="w-full bg-brand-orange hover:bg-orange-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
