'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { Settings, Building, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function UserMenu() {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isOrgHovered, setIsOrgHovered] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Placeholder Org Data
    const orgData = {
        name: "Acme Corp",
        role: "Admin",
        members: 12
    };

    return (
        <div className="relative" ref={menuRef}>
            {/* User Icon Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 focus:ring-offset-brand-dark"
                aria-label="User menu"
                aria-expanded={isOpen}
            >
                <div className="w-10 h-10 bg-brand-orange rounded-full flex items-center justify-center text-white font-bold uppercase shadow-md">
                    {user?.email?.[0] || 'U'}
                </div>
            </button>

            {/* Main Popup Modal */}
            {isOpen && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-60 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="px-4 py-3 border-b border-gray-100 mb-1">
                        <p className="text-sm font-medium text-brand-dark truncate">{user?.email}</p>
                        <p className="text-xs text-gray-500">Pro Plan</p>
                    </div>

                    <Link href="/settings/info" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-orange transition-colors">
                        <Settings className="w-4 h-4" />
                        <span>Personal Settings</span>
                    </Link>

                    {/* Organization Item with Hover Modal */}
                    <div
                        className="relative"
                        onMouseEnter={() => setIsOrgHovered(true)}
                        onMouseLeave={() => setIsOrgHovered(false)}
                    >
                        <button className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-orange transition-colors text-left">
                            <div className="flex items-center gap-3">
                                <Building className="w-4 h-4" />
                                <span>Organization</span>
                            </div>
                            <ChevronRight className="w-3 h-3 text-gray-400" />
                        </button>

                        {/* Nested Org Modal */}
                        {isOrgHovered && (
                            <div className="absolute left-full top-0 pl-2 z-50">
                                <div className="w-56 bg-white rounded-xl shadow-xl border border-gray-200 p-4">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Current Organization</h4>
                                    <div className="space-y-1">
                                        <p className="font-medium text-brand-dark flex items-center gap-2">
                                            <Building className="w-3 h-3 text-brand-orange" />
                                            {orgData.name}
                                        </p>
                                        <p className="text-xs text-gray-500">Role: <span className="text-brand-dark">{orgData.role}</span></p>
                                        <p className="text-xs text-gray-500">Members: <span className="text-brand-dark">{orgData.members}</span></p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <Link href="/help" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-orange transition-colors">
                        <HelpCircle className="w-4 h-4" />
                        <span>Help</span>
                    </Link>

                    <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Log Out</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
