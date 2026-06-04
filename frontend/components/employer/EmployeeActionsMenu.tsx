'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreVertical, UserX } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';

interface EmployeeActionsMenuProps {
    employeeId: number;
    employeeName: string;
    currentStatus: 'active' | 'pending' | 'deactivated';
    onStatusChanged: () => void;
}

export function EmployeeActionsMenu({
    employeeId,
    employeeName,
    currentStatus,
    onStatusChanged,
}: EmployeeActionsMenuProps) {
    const { token } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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

    const handleDeactivate = async () => {
        if (!confirm(`Are you sure you want to deactivate ${employeeName}?`)) return;

        setIsLoading(true);
        try {
            const response = await fetch(
                `http://localhost:8080/api/employer/employees/${employeeId}/status`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ status: 'deactivated' }),
                }
            );

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to deactivate employee');
            }

            setIsOpen(false);
            onStatusChanged();
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Failed to deactivate employee');
        } finally {
            setIsLoading(false);
        }
    };

    if (currentStatus === 'deactivated') {
        return null;
    }

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-400 hover:text-brand-dark transition-colors rounded-lg hover:bg-gray-100"
                aria-label="Employee actions"
            >
                <MoreVertical className="w-4 h-4" />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                    <button
                        onClick={handleDeactivate}
                        disabled={isLoading}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                        <UserX className="w-4 h-4" />
                        {isLoading ? 'Deactivating...' : 'Deactivate'}
                    </button>
                </div>
            )}
        </div>
    );
}
