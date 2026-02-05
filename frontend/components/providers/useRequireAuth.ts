import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';

export function useRequireAuth(allowedRoles?: string[]) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/auth');
            } else if (allowedRoles && !allowedRoles.includes(user.role)) {
                // Redirect unauthorized users based on their role
                if (user.role === 'employer') {
                    router.push('/employer');
                } else {
                    router.push('/dashboard');
                }
            } else if (user.role === 'employee' && user.needs_onboarding && !pathname.startsWith('/onboarding')) {
                router.push('/onboarding');
            }
        }
    }, [user, loading, router, allowedRoles, pathname]);

    return { user, loading };
}
