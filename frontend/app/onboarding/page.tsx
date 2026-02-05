'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/Button';

export default function OnboardingPage() {
    const { user, login } = useAuth();
    const router = useRouter();
    const [tempPassword, setTempPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:8080/api/onboarding/complete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    temp_password: tempPassword,
                    new_password: newPassword
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to complete onboarding');
            }

            // Update auth context with new token (which has needs_onboarding: false)
            // We need to fetch the user again or manually update the user object.
            // The API returns a new token.
            // Let's decode or fetch 'me' with new token.
            // For simplicity, let's just use the login method which expects a user object.
            // We can fetch /me with the new token.

            const meRes = await fetch('http://localhost:8080/api/auth/me', {
                headers: { 'Authorization': `Bearer ${data.token}` }
            });
            const meData = await meRes.json();

            if (meRes.ok) {
                login(data.token, meData.user); // This will redirect to dashboard
            } else {
                router.push('/auth'); // Fallback
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-center mb-2">Welcome, {user?.fullname}!</h1>
            <p className="text-gray-500 text-center mb-6">Please set your permanent password to continue.</p>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Temporary Password</label>
                    <input
                        type="password"
                        required
                        value={tempPassword}
                        onChange={(e) => setTempPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange"
                        placeholder="Provided by your employer"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange"
                        placeholder="Min. 8 characters"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange"
                        placeholder="Re-enter new password"
                    />
                </div>

                <Button fullWidth disabled={loading}>
                    {loading ? 'Setting Password...' : 'Completing Setup'}
                </Button>
            </form>
        </div>
    );
}
