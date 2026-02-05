'use client';

import { Calendar as CalendarIcon, Briefcase } from 'lucide-react';

export default function EmployeeProjectsPage() {
    return (
        <div className="flex flex-col min-h-full">
            {/* Controls Toolbar */}
            <div className="flex items-center gap-3 mb-6">
                <button className="flex items-center gap-2 px-3 py-2 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium border border-transparent transition-colors">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Today</span>
                </button>
            </div>

            {/* Main Content Grid */}
            <div className="flex flex-col md:flex-row gap-8 flex-1 w-full">
                {/* Left Side - Empty State */}
                <div className="flex items-start justify-center min-w-[355px] sticky top-6 h-fit shrink-0">
                    <h2 className="text-2xl font-bold text-gray-400 text-center font-heading leading-tight">
                        Employee doesn&apos;t have<br />
                        any project yet.
                    </h2>
                </div>

                {/* Right Side - Projects Dashboard */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6 w-full min-h-[660px]">
                    <h3 className="font-bold text-gray-900 text-sm">All projects</h3>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Total Time Card */}
                        <div className="border border-gray-100 rounded-xl p-5 flex flex-col justify-between h-28 relative">
                            <div className="flex items-start justify-between mb-2">
                                <span className="text-xs font-semibold text-gray-500">Total Time</span>
                                <Briefcase className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">00:00 h</div>
                        </div>

                        {/* Utilization Card */}
                        <div className="border border-gray-100 rounded-xl p-5 flex flex-col justify-between h-28 relative">
                            <div className="flex items-start justify-between mb-2">
                                <span className="text-xs font-semibold text-blue-500">Utilization</span>
                                {/* Small trend icon */}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-blue-500">
                                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                                    <polyline points="16 7 22 7 22 13" />
                                </svg>
                            </div>
                            <div className="text-2xl font-bold text-gray-900">0%</div>
                        </div>
                    </div>

                    {/* Chart Section */}
                    <div className="border border-gray-100 rounded-xl p-5 flex flex-col flex-1">
                        <div className="flex items-center justify-between mb-8">
                            <h4 className="text-sm font-bold text-gray-700">Time on Projects</h4>
                            <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">Export</button>
                        </div>

                        {/* CSS Bar Chart Construction */}
                        <div className="relative flex flex-col flex-1 min-h-[250px]">
                            {/* Horizontal Grid Lines */}
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="w-full h-px bg-gray-50 last:bg-transparent" />
                                ))}
                            </div>

                            {/* Y-Axis Labels (Hidden in design but implies scale) */}
                            <div className="absolute left-0 top-0 bottom-0 w-8 -ml-8 flex flex-col justify-between text-[10px] text-gray-300 pointer-events-none invisible">
                                <span>5h</span>
                                <span>4h</span>
                                <span>3h</span>
                                <span>2h</span>
                                <span>1h</span>
                                <span>0h</span>
                            </div>

                            {/* Chart Bars Container */}
                            <div className="relative z-10 flex-1 flex items-end justify-between px-2 gap-3 pb-8">
                                {/* Side decorative dots */}
                                <div className="absolute left-1 bottom-10 flex flex-col gap-4">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="w-3 h-1.5 bg-gray-100 rounded-full" />
                                    ))}
                                </div>
                                <div className="absolute right-1 bottom-10 flex flex-col gap-4">
                                    {/* Empty for visual balance if needed */}
                                </div>


                                {/* Bars Data */}
                                {[
                                    { h: 65, split: true }, { h: 35, split: true }, { h: 35, split: true },
                                    { h: 42, split: false }, { h: 50, split: true }, { h: 60, split: true },
                                    { h: 40, split: true }, { h: 55, split: false }, { h: 75, split: true }
                                ].map((bar, i) => (
                                    <div key={i} className="flex-1 flex flex-col justify-end group h-full">
                                        <div
                                            className="w-full bg-[#cbd5e1] rounded-sm relative transition-all duration-300 hover:bg-[#94a3b8]" // slate-300 to slate-400
                                            style={{ height: `${bar.h}%` }}
                                        >
                                            {/* Decorative "split" lines to mimic stacked look */}
                                            {bar.split && (
                                                <>
                                                    <div className="absolute top-[30%] left-0 right-0 h-[1px] bg-white/40" />
                                                    <div className="absolute top-[60%] left-0 right-0 h-[1px] bg-white/40" />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Bottom Legend / Axis Indicators */}
                            <div className="absolute bottom-2 left-0 right-0 flex justify-around px-8">
                                <div className="w-8 h-2 bg-gray-200 rounded-full" />
                                <div className="w-8 h-2 bg-gray-200 rounded-full" />
                                <div className="w-8 h-2 bg-gray-200 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
