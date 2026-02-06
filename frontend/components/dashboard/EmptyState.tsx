import React from 'react';

interface EmptyStateProps {
    title?: string;
    description?: string;
}

export const EmptyState = ({
    title = "No data for the selected period",
    description = "Try choosing a different time period in the calendar."
}: EmptyStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-b-xl border-t-0">
            {/* Illustration */}
            <div className="mb-6 relative">
                {/* Background Circle */}
                <div className="w-32 h-32 bg-purple-50 rounded-full absolute -top-4 -left-6 opacity-60"></div>

                {/* Computer Monitor SVG */}
                <svg width="100" height="85" viewBox="0 0 100 85" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
                    {/* Monitor Stand */}
                    <path d="M35 75 H65" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                    <path d="M50 60 V 75" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />

                    {/* Monitor Screen Frame */}
                    <rect x="5" y="5" width="90" height="55" rx="4" fill="white" stroke="#6B7280" strokeWidth="2" />
                    <rect x="10" y="10" width="80" height="45" rx="2" fill="white" />

                    {/* Sleepy Face */}
                    {/* Left Eye */}
                    <path d="M30 32 Q 35 32, 40 32" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" />
                    {/* Right Eye */}
                    <path d="M60 32 Q 65 32, 70 32" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" />
                    {/* Mouth */}
                    <circle cx="50" cy="40" r="2" fill="#4B5563" />
                </svg>
            </div>

            {/* Text Content */}
            <h3 className="text-xl font-bold font-heading text-brand-dark mb-2">{title}</h3>
            <p className="text-gray-500 font-body">{description}</p>

            {/* Bottom Timeline Illustration (Mock) */}
            <div className="mt-12 opacity-40 grayscale blur-[1px] select-none pointer-events-none">
                <div className="w-[400px] h-[100px] bg-gray-50 rounded-lg border border-gray-100 p-4 flex flex-col gap-2">
                    <div className="flex justify-between text-[10px] text-gray-400">
                        <span>09:00</span><span>12:00</span><span>15:00</span><span>17:00</span>
                    </div>
                    <div className="h-4 bg-purple-100 rounded-full w-full relative overflow-hidden">
                        <div className="absolute left-[10%] w-[20%] h-full bg-purple-300"></div>
                        <div className="absolute left-[40%] w-[15%] h-full bg-blue-200"></div>
                        <div className="absolute left-[70%] w-[25%] h-full bg-purple-300"></div>
                    </div>
                    <div className="flex gap-2 text-[8px] text-gray-400 mt-2">
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-300"></div> Active</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-200"></div> Break</div>
                    </div>
                </div>
                <p className="text-center text-xs text-gray-400 mt-4">Select shift from table to see more details</p>
            </div>
        </div>
    );
};
