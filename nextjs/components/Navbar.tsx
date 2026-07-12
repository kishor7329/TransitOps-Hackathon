'use client';
import { MenuIcon, XIcon } from 'lucide-react';
import { PrimaryButton } from './Buttons';
import { useState } from 'react';
import { motion } from 'framer-motion';

// Separate vector component for easy inline rendering and crisp vector mapping
function LogoSvg() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 200" className="h-20 sm:h-35 w-auto drop-shadow-md" aria-label="TransitOps Logo">
            <defs>
                <linearGradient id="cyan-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00f2fe" />
                    <stop offset="100%" stopColor="#4facfe" />
                </linearGradient>
                <linearGradient id="purple-pink" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7f00ff" />
                    <stop offset="100%" stopColor="#e100ff" />
                </linearGradient>
                <linearGradient id="text-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="70%" stopColor="#dcd6f7" />
                    <stop offset="100%" stopColor="#a6b1e1" />
                </linearGradient>
            </defs>
            <g transform="translate(15, -10)">
                <path d="M 110 30 L 115 75 L 135 60 L 120 85 L 160 85 L 125 95 L 150 120 L 115 105 L 110 155 L 105 110 L 80 130 L 98 102 L 55 98 L 95 90 L 70 65 L 102 78 Z" fill="none" stroke="url(#cyan-blue)" strokeWidth="5" strokeLinejoin="round" opacity="0.8" />
                <circle cx="110" cy="95" r="50" fill="none" stroke="url(#purple-pink)" strokeWidth="6" strokeDasharray="240 40 40 20" transform="rotate(-45 110 95)" />
                <path d="M 25 80 L 70 80 M 15 92 L 65 92 M 30 104 L 60 104 M 45 116 L 62 116" stroke="url(#purple-pink)" strokeWidth="4" strokeLinecap="round" />
                <path d="M 70 78 L 145 78 A 4 4 0 0 1 149 81 L 149 90 L 170 91 A 3 3 0 0 1 173 94 L 173 118 L 140 118 L 70 114 Z" fill="url(#cyan-blue)" />
                <path d="M 152 94 L 163 94 L 163 103 L 152 103 Z" fill="#11131c" opacity="0.4" />
                <path d="M 166 95 L 171 95 L 171 108 L 166 108 Z" fill="url(#purple-pink)" />
                <rect x="75" y="84" width="60" height="24" rx="2" fill="#11131c" opacity="0.15" />
                <path d="M 68 114 L 142 119 L 145 115 L 176 117 A 4 4 0 0 1 180 121 L 174 130 A 6 6 0 0 1 168 133 L 155 133 A 10 10 0 0 0 136 133 L 124 133 A 10 10 0 0 0 105 133 L 75 128 Z" fill="url(#purple-pink)" />
                <circle cx="87" cy="131" r="9" fill="#11131c" stroke="url(#purple-pink)" strokeWidth="3" /><circle cx="87" cy="131" r="3" fill="#ffffff" />
                <circle cx="114" cy="133" r="9" fill="#11131c" stroke="url(#purple-pink)" strokeWidth="3" /><circle cx="114" cy="133" r="3" fill="#ffffff" />
                <circle cx="146" cy="135" r="10" fill="#11131c" stroke="url(#cyan-blue)" strokeWidth="3" /><circle cx="146" cy="135" r="3.5" fill="#ffffff" />
            </g>
            <g transform="translate(210, 0)">
                <text x="0" y="112" fontFamily="system-ui, -apple-system, sans-serif" fontSize="62" fontWeight="800" fill="url(#text-grad)" letterSpacing="-1">Transit</text>
                <text x="202" y="112" fontFamily="system-ui, -apple-system, sans-serif" fontSize="62" fontWeight="800" fill="url(#purple-pink)" letterSpacing="-1">Ops</text>
                <text x="5" y="148" fontFamily="system-ui, -apple-system, sans-serif" fontSize="16" fontWeight="600" fill="#a6b1e1" opacity="0.9" letterSpacing="0.5">- Smart Transport Operations Platform</text>
            </g>
        </svg>
    );
}
import Link from 'next/link';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
    { name: 'Home', href: '/#' },
    { name: 'Roles', href: '/#features' },
    { name: 'AI Assistant', href: '/#ai-intelligence' },
    { name: 'Validation', href: '/#faq' },
];

    return (
        <motion.nav
    className="fixed top-5 left-0 right-0 z-50 px-4"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
        >
            <div className='max-w-6xl mx-auto flex items-center justify-between bg-black/50 backdrop-blur-md border border-white/5 rounded-2xl p-3'>
                <Link href='/#' className="flex items-center">
                    <LogoSvg />
                </Link>

                <div className='hidden md:flex items-center gap-8 text-sm font-medium text-gray-300'>
                    {navLinks.map((link) => (
                        <a href={link.href} key={link.name} className="hover:text-white transition">
                            {link.name}
                        </a>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-3">
    <a href="/login">
    <button className="text-sm font-medium text-gray-300 hover:text-white transition">
        Sign In
    </button>
</a>

<a href="/register">
    <PrimaryButton>
        Register
    </PrimaryButton>
</a>
</div>

                <button onClick={() => setIsOpen(!isOpen)} className='md:hidden text-gray-300 hover:text-white'>
                    <MenuIcon className='size-6' />
                </button>
            </div>
            
            <div className={`flex flex-col items-center justify-center gap-6 text-lg font-medium fixed inset-0 bg-black/90 backdrop-blur-md z-50 transition-all duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
                {navLinks.map((link) => (
                    <a key={link.name} href={link.href} className="text-gray-300 hover:text-white transition" onClick={() => setIsOpen(false)}>
                        {link.name}
                    </a>
                ))}

                <button onClick={() => setIsOpen(false)} className='font-medium text-gray-300 hover:text-white transition'>
                    Sign in
                </button>
                <PrimaryButton onClick={() => setIsOpen(false)}>Get Started</PrimaryButton>

                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-8 right-8 rounded-md bg-white/10 p-2 text-white hover:bg-white/20 active:scale-95 transition"
                >
                    <XIcon className="size-6" />
                </button>
            </div>
        </motion.nav>
    );
};
