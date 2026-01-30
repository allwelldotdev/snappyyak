'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { LayoutDashboard } from 'lucide-react';

export default function Dashboard() {
    // Auth check is now handled in layout.tsx

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Total Efficiency</h3>
                    <p className="text-3xl font-bold text-brand-dark">94%</p>
                    <span className="text-sm text-green-500 flex items-center mt-2">
                        +2.5% from last week
                    </span>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Hours Reclaimed</h3>
                    <p className="text-3xl font-bold text-brand-orange">124h</p>
                    <span className="text-sm text-gray-400 flex items-center mt-2">
                        This month
                    </span>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Active Users</h3>
                    <p className="text-3xl font-bold text-brand-dark">42</p>
                    <span className="text-sm text-gray-400 flex items-center mt-2">
                        / 50 seats
                    </span>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-96 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                    <LayoutDashboard className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-brand-dark mb-2">No activity data yet</h2>
                <p className="text-gray-500 max-w-md">
                    Install the SnappyYak agent on your team's devices to start seeing real-time productivity insights.
                </p>
            </div>
        </>
    );
}
