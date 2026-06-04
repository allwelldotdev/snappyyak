'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Mail, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { TempPasswordDisplay } from '@/components/employer/TempPasswordDisplay';
import { useAuth } from '@/components/providers/AuthProvider';

export default function AddEmployeePage() {
    const router = useRouter();
    const { token } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Temp password modal state
    const [showTempPassword, setShowTempPassword] = useState(false);
    const [tempPassword, setTempPassword] = useState('');
    const [addedEmail, setAddedEmail] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/employer/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ name: name.trim(), email: email.trim() }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to add employee');
            }

            // Success - show temp password modal
            setAddedEmail(data.email);
            setTempPassword(data.temp_password);
            setShowTempPassword(true);

            // Clear form
            setName('');
            setEmail('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleModalClose = () => {
        setShowTempPassword(false);
        router.push('/employer/employees');
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header with Back Button */}
            <div className="flex items-center gap-4 mb-6">
                <Link
                    href="/employer/employees"
                    className="p-2 text-gray-500 hover:text-brand-dark hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold font-heading text-brand-dark">Add New Employee</h1>
                    <p className="text-gray-500 text-sm">Enter the employee&apos;s details to invite them to SnappyYak</p>
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 max-w-xl">
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Name Field */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                required
                                autoFocus
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo transition-colors text-brand-dark placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="employee@company.com"
                                required
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo transition-colors text-brand-dark placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-2">
                        <Link
                            href="/employer/employees"
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-center"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isLoading || !name.trim() || !email.trim()}
                            className="flex-1 bg-brand-orange hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                'Add Employee'
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Temp Password Modal */}
            <TempPasswordDisplay
                isOpen={showTempPassword}
                onClose={handleModalClose}
                employeeEmail={addedEmail}
                tempPassword={tempPassword}
            />
        </div>
    );
}
