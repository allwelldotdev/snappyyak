'use client';

import { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export default function SettingsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Password state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');

    // Profile state
    const [fullname, setFullname] = useState(user?.fullname || '');
    const [initialFullname, setInitialFullname] = useState(user?.fullname || '');

    // Update state when user loads
    useEffect(() => {
        if (user?.fullname) {
            setFullname(user.fullname);
            setInitialFullname(user.fullname);
        }
    }, [user]);

    // Derived state
    const isProfileDirty = fullname !== initialFullname;
    const isPasswordDirty = !!currentPassword || !!newPassword || !!retypePassword;
    const isDirty = isProfileDirty || isPasswordDirty;

    // Visibility toggles
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showRetype, setShowRetype] = useState(false);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setIsLoading(true);

        try {
            // Update Profile (Fullname)
            if (isProfileDirty) {
                const res = await fetch('http://localhost:8080/api/auth/update-profile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ fullname })
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || 'Failed to update profile');
                }
                setInitialFullname(fullname);
            }

            // Update Password
            if (isPasswordDirty) {
                if (newPassword !== retypePassword) {
                    throw new Error('New passwords do not match');
                }
                if (newPassword.length < 8) {
                    throw new Error('Password must be at least 8 characters');
                }

                const res = await fetch('http://localhost:8080/api/auth/change-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        current_password: currentPassword,
                        new_password: newPassword
                    })
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || 'Failed to update password');
                }

                setCurrentPassword('');
                setNewPassword('');
                setRetypePassword('');
            }

            setMessage({ type: 'success', text: 'Settings updated successfully' });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="">
            <h1 className="text-2xl font-bold font-heading text-brand-dark mb-6">Personal Settings</h1>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
                <nav className="flex gap-8">
                    <button className="py-2 border-b-2 border-brand-orange text-brand-orange font-medium text-sm">
                        Info
                    </button>
                    <button className="py-2 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm">
                        Localization
                    </button>
                </nav>
            </div>

            <div className="space-y-12">
                {/* Personal Info Section */}
                <section>
                    <h2 className="text-lg font-bold text-brand-dark mb-6">Personal Info</h2>

                    <div className="grid gap-6 max-w-2xl">
                        {/* Full Name moved inside form */}

                        <form onSubmit={handleProfileUpdate} className="contents">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={fullname}
                                    onChange={(e) => setFullname(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-orange focus:border-transparent text-brand-dark font-medium"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Email Address
                                </label>
                                <input
                                    value={user?.email || ''}
                                    readOnly
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-brand-dark font-bold cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Current Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showCurrent ? "text" : "password"}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="Enter your current password"
                                        className="w-full px-4 py-3 pr-11 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-orange focus:border-transparent placeholder:text-gray-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrent(!showCurrent)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 flex items-center justify-center"
                                    >
                                        {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showNew ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter your new password"
                                        className="w-full px-4 py-3 pr-11 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-orange focus:border-transparent placeholder:text-gray-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNew(!showNew)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 flex items-center justify-center"
                                    >
                                        {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Retype New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showRetype ? "text" : "password"}
                                        value={retypePassword}
                                        onChange={(e) => setRetypePassword(e.target.value)}
                                        placeholder="Retype your new password"
                                        className="w-full px-4 py-3 pr-11 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-orange focus:border-transparent placeholder:text-gray-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowRetype(!showRetype)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 flex items-center justify-center"
                                    >
                                        {showRetype ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading || !isDirty}
                                    className={`px-6 py-2 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${isDirty
                                        ? 'bg-brand-orange text-white hover:bg-orange-600'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Save changes
                                </button>
                            </div>
                        </form>

                        {message && (
                            <div className={`p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                <span className={message.type === 'success' ? 'text-green-500' : 'text-red-500'}>●</span>
                                {message.text}
                            </div>
                        )}
                    </div>
                </section>

                {/* Social Accounts Section */}
                <section>
                    <h2 className="text-sm font-bold text-gray-500 mb-4">Social Accounts</h2>

                    <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-2xl">
                        <div className="flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-brand-dark mb-2">No social account</h3>
                            <p className="text-sm text-gray-500 mb-6 max-w-xs">
                                You don't have any social accounts at the moment, but you can add one below.
                            </p>

                            <div className="flex gap-4 w-full max-w-md">
                                <button className="flex-1 flex items-center justify-center gap-2 py-2 border border-blue-200 rounded-lg text-sm font-medium text-brand-dark hover:bg-gray-50 transition-colors">
                                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                                    Google
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-2 py-2 border border-blue-200 rounded-lg text-sm font-medium text-brand-dark hover:bg-gray-50 transition-colors">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg" alt="Slack" className="w-5 h-5" />
                                    Slack
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2FA Section */}
                <section className="max-w-2xl">
                    <h2 className="text-lg font-bold text-brand-dark mb-4">Two Factor Authentication</h2>
                    <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                        Two factor authentication provides an extra layer of security to prevent unauthorized access to your account. Additionally to your email address and password, a security code generated on your mobile is needed to sign in.
                    </p>

                    <button className="px-6 py-2 bg-brand-orange text-white font-medium rounded-lg hover:bg-orange-700 transition-colors shadow-sm shadow-brand-orange/30">
                        Activate
                    </button>
                </section>
            </div>
        </div>
    );
}

// Brand Purple color extension needs to be checked in tailwind config or added as arbitrary value
// For now using a close hex or if 'brand-purple' (likely standard purple or indigo) is not defined, 
// I'll check tailwind config in a moment.
// Based on screenshot, "Activate" button is purple.
