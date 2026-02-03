'use client';

import { Download, HelpCircle } from 'lucide-react';

// Custom OS icons as SVG components
const WindowsIcon = () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
    </svg>
);

const AppleIcon = () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
);

const LinuxIcon = () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 17l6-6-6-6" />
        <path d="M12 19h8" />
    </svg>
);

interface DownloadRowProps {
    icon: React.ReactNode;
    name: string;
    badge?: string;
}

const DownloadRow = ({ icon, name, badge }: DownloadRowProps) => (
    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg border border-gray-100">
        <div className="flex items-center gap-3">
            <div className="text-gray-700">
                {icon}
            </div>
            <span className="font-medium text-brand-dark">{name}</span>
            <button
                type="button"
                className="text-gray-400 hover:text-gray-500 transition-colors"
                aria-label={`More info about ${name}`}
            >
                <HelpCircle className="w-4 h-4" />
            </button>
        </div>
        <div className="flex items-center gap-3">
            {badge && (
                <span className="px-2 py-0.5 text-xs font-medium bg-violet-500 text-white rounded">
                    {badge}
                </span>
            )}
            <button
                type="button"
                className="p-2 text-violet-500 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                aria-label={`Download for ${name}`}
            >
                <Download className="w-5 h-5" />
            </button>
        </div>
    </div>
);

export default function DownloadPage() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-md w-full">
                <h1 className="text-xl font-bold font-heading text-brand-dark mb-2">
                    Download Installation File
                </h1>
                <p className="text-sm text-gray-500 mb-6">
                    Select the installation file depending on the operating system you use.
                </p>

                <div className="space-y-3">
                    <DownloadRow
                        icon={<WindowsIcon />}
                        name="Windows"
                    />
                    <DownloadRow
                        icon={<AppleIcon />}
                        name="macOS"
                    />
                    <DownloadRow
                        icon={<LinuxIcon />}
                        name="Linux"
                        badge="BETA"
                    />
                </div>
            </div>
        </div>
    );
}
