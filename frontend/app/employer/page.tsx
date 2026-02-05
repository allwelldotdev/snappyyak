'use client';

import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export default function EmployerDashboard() {
    return (
        <Container className="py-10">
            <h1 className="text-3xl font-bold mb-6">Employer Dashboard</h1>
            <p className="mb-4">Welcome to the employer portal. Manage your employees here.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-lg mb-2">Manage Employees</h3>
                    <p className="text-gray-500 mb-4">Add, remove, or view employee details.</p>
                    <Button variant="outline">View Employees</Button>
                </div>
            </div>
        </Container>
    );
}
