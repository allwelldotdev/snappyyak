import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', fullWidth = false, ...props }, ref) => {

        const variants = {
            primary: 'bg-brand-orange text-white border-[4px] border-border-primary hover:scale-[1.02] hover:brightness-105 shadow-sm font-normal leading-[18px]',
            secondary: 'bg-brand-dark text-white border-[4px] border-border-secondary hover:bg-gray-900',
            outline: 'bg-transparent text-brand-dark border-2 border-brand-dark hover:bg-gray-100',
            ghost: 'bg-transparent text-brand-dark hover:bg-gray-100',
        };

        const sizes = {
            sm: 'px-4 py-2 text-sm',
            md: 'px-8 py-3 text-base',
            lg: 'px-[40px] py-[10px] text-lg',
        };



        return (
            <button
                ref={ref}
                className={cn(
                    'font-ui font-medium transition-all duration-200 flex items-center justify-center whitespace-nowrap active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
                    'rounded-[30px]', // Default card radius style, overridden if needed
                    variant === 'secondary' && 'rounded-full',
                    variants[variant],
                    sizes[size],
                    fullWidth && 'w-full',
                    className
                )}
                {...props}
            />
        );
    }
);

Button.displayName = 'Button';
