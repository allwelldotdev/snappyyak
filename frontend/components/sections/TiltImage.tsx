'use client';

import React, { useRef, useState } from 'react';

export const TiltImage = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [transform, setTransform] = useState('rotateX(0deg) rotateY(0deg)');
    const [transition, setTransition] = useState('transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'); // Smoother ease

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * 15; // Increased to 15deg for noticeable dip
        const rotateY = ((centerX - x) / centerX) * 15; // Increased to 15deg

        setTransform(`rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`);
        setTransition('transform 0.1s ease-out'); // Quick response to movement
    };

    const handleMouseLeave = () => {
        setTransform('rotateX(0deg) rotateY(0deg) scale(1)');
        setTransition('transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'); // Very smooth return
    };

    return (
        <div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transform,
                transition,
                transformStyle: 'preserve-3d',
                perspective: '1500px' // Increased perspective for flatter, more subtle 3D
            }}
            className="relative z-10 bg-white rounded-[30px] border border-gray-100 shadow-2xl p-6 aspect-[16/9] flex flex-col gap-4 overflow-hidden cursor-default will-change-transform"
        >
            {/* Header of fake dashboard */}
            <div className="flex items-center justify-between mb-2 pointer-events-none">
                <div className="h-8 w-32 bg-gray-100 rounded-full"></div>
                <div className="flex gap-2">
                    <div className="h-8 w-8 bg-gray-100 rounded-full"></div>
                    <div className="h-8 w-8 bg-brand-orange rounded-full opacity-20"></div>
                </div>
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-3 gap-6 h-full pointer-events-none">
                <div className="col-span-2 bg-bg-alt rounded-2xl p-6 flex flex-col justify-end relative overflow-hidden">
                    {/* Dummy Chart Lines */}
                    <div className="absolute inset-x-0 bottom-0 top-1/3 flex items-end justify-between px-6 pb-0 gap-4 opacity-80">
                        <div className="w-full bg-brand-orange/40 rounded-t-lg h-[40%]"></div>
                        <div className="w-full bg-brand-orange rounded-t-lg h-[75%]"></div>
                        <div className="w-full bg-brand-orange/60 rounded-t-lg h-[55%]"></div>
                        <div className="w-full bg-brand-orange rounded-t-lg h-[90%]"></div>
                        <div className="w-full bg-brand-orange/50 rounded-t-lg h-[65%]"></div>
                    </div>
                    <div className="relative z-10 mt-auto h-4 w-32 bg-gray-200/50 rounded-full"></div>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="bg-brand-dark rounded-2xl p-6 flex-1 text-white flex flex-col justify-center items-center">
                        <div className="text-4xl font-bold font-heading">28%</div>
                        <div className="text-sm opacity-70 mt-2">Efficiency Boost</div>
                    </div>
                    <div className="bg-orange-50 rounded-2xl p-6 flex-1 flex flex-col justify-center items-center border border-orange-100">
                        <div className="text-4xl font-bold font-heading text-brand-orange">20h+</div>
                        <div className="text-sm text-brand-dark opacity-70 mt-2">Reclaimed</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
