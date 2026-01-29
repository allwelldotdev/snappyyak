'use client';

import { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: 'Features', href: '#features' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'Integrations', href: '#integrations' },
        { name: 'Security', href: '#security' },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full bg-bg-main/90 backdrop-blur-md">
            <Container className="flex h-20 items-center justify-between">
                {/* Logo */}
                <Logo />

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-text-body font-ui font-medium hover:text-brand-orange transition-colors"
                        >
                            {link.name}
                        </a>
                    ))}
                </div>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center gap-4">
                    <Link href="/auth?mode=login" className="font-ui font-medium text-brand-dark hover:text-brand-orange">Log in</Link>
                    <Link href="/auth?mode=signup">
                        <Button size="sm" variant="secondary">Get Started</Button>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-brand-dark"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X /> : <Menu />}
                </button>
            </Container>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-20 left-0 w-full bg-bg-main border-b border-gray-100 p-4 flex flex-col gap-4 shadow-lg">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-lg font-ui font-medium text-brand-dark py-2"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </a>
                    ))}
                    <div className="flex flex-col gap-3 mt-4">
                        <Link href="/auth?mode=login" onClick={() => setIsOpen(false)}>
                            <Button variant="outline" fullWidth>Log in</Button>
                        </Link>
                        <Link href="/auth?mode=signup" onClick={() => setIsOpen(false)}>
                            <Button variant="primary" fullWidth>Get Started</Button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};
