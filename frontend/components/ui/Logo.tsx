import Link from 'next/link';

interface LogoProps {
    className?: string;
}

export const Logo = ({ className = "" }: LogoProps) => {
    return (
        <Link href="/" className={`flex items-center gap-2 hover:opacity-80 transition-opacity w-fit ${className}`}>
            <span className="text-2xl font-heading font-bold text-brand-dark tracking-tight">
                Snappy<span className="text-brand-orange">Yak</span>
            </span>
        </Link>
    );
};
