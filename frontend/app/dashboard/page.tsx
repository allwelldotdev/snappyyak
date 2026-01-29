'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LayoutDashboard, Users, Clock, Settings, LogOut } from 'lucide-react';

export default function Dashboard() {
    const { user, logout, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        // Can add a nicer loading state here if desired
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-brand-dark">Loading...</div>;
    }

    return (
        <div className="flex h-screen bg-gray-50 font-body text-brand-dark">
            {/* Sidebar */}
            <aside className="w-64 bg-brand-dark text-white hidden md:flex flex-col">
                <div className="p-6">
                    <div className="text-2xl font-bold font-heading text-brand-orange">SnappyYak</div>
                </div>
                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <a href="#" className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-lg text-white">
                        <LayoutDashboard className="w-5 h-5" />
                        <span>Overview</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        <Users className="w-5 h-5" />
                        <span>Teams</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        <Clock className="w-5 h-5" />
                        <span>Time Logs</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        <Settings className="w-5 h-5" />
                        <span>Settings</span>
                    </a>
                </nav>
                <div className="p-4 border-t border-white/10">
                    <button onClick={logout} className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white transition-colors w-full text-left">
                        <LogOut className="w-5 h-5" />
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
                    <h1 className="text-xl font-bold font-heading">Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-600">{user?.email}</span>
                        <div className="w-10 h-10 bg-brand-orange rounded-full flex items-center justify-center text-white font-bold uppercase">
                            {user?.email?.[0] || 'U'}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8">
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
                </main>
            </div>
        </div>
    );
}
