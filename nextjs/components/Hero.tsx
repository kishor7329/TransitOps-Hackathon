import { ArrowRightIcon, PlayIcon, ZapIcon, CheckIcon } from 'lucide-react';
import { PrimaryButton, GhostButton } from './Buttons';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {

    const trustedUserImages = [
        'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=50',
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop'
    ];

    const mainImageUrl = '/hero image/hero-dashboard.png'; // Replace with your actual image path

    const galleryStripImages = [
        'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=100',
        'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=100',
        'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=100',
    ];

    const trustedLogosText = [
    'Vehicle Registry',
    'Driver Management',
    'Trip Dispatch',
    'Maintenance',
    'Fuel Tracking',
    'Expense Management',
    'Analytics',
    'RAG Assistant'
];

    return (
        <>
            <section id="home" className="relative z-20 pt-8 md:pt-25">
                <div className="max-w-6xl mx-auto px-4 min-h-screen max-md:w-screen max-md:overflow-hidden flex items-center justify-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                        <div className="text-left">
                            <motion.div
    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6"
    initial={{ y: 60, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ type: "spring", stiffness: 250, damping: 70 }}
>
    <ZapIcon className="size-4 text-blue-400" />
    <span className="text-sm text-blue-200">
        Fleet Management • RAG-based AI Assistant • Real-Time Analytics
    </span>
</motion.div>

                            <motion.h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 max-w-xl"
                                initial={{ y: 60, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.1 }}
                            >
                                Manage Your Entire Fleet -
                                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-300 pl-4">
                                    From One Smart Platform
                                  </span>
                            </motion.h1>

                            {/* 1. Core Platform Features Paragraph */}
<motion.p 
    className="text-gray-200 text-base sm:text-lg max-w-lg font-normal leading-relaxed"
    initial={{ y: 60, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.2 }}
>
    TransitOps centralizes vehicle management, driver operations, smart dispatching, maintenance scheduling, fuel tracking, operational expenses, and real-time analytics.
</motion.p>

{/* 2. AI & RAG Subtext Paragraph (Notice the slightly longer delay so it animates in a step later) */}
<motion.p 
    className="text-gray-400 text-sm sm:text-base max-w-lg mt-4 mb-8 font-light leading-relaxed border-l-2 border-purple-500/40 pl-4"
    initial={{ y: 60, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.3 }}
>
    <span className="text-cyan-400 font-medium">Powered by AI (RAG):</span> Users can instantly retrieve fleet information, maintenance history, and operational insights using natural language.
</motion.p>

                            {/* <motion.div className="flex flex-col sm:flex-row items-center gap-4 mb-8"
                                initial={{ y: 60, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.3 }}
                            >
                                <Link href="/" className="w-full sm:w-auto">
                                    <PrimaryButton className="max-sm:w-full py-3 px-7">
                                        Launch Dashboard
                                        <ArrowRightIcon className="size-4" />
                                    </PrimaryButton>
                                </Link>

                                <GhostButton className="max-sm:w-full max-sm:justify-center py-3 px-5">
                                    <PlayIcon className="size-4" />
                                    View our work
                                </GhostButton>
                            </motion.div> */}

                            <motion.div className="flex sm:inline-flex overflow-hidden items-center max-sm:justify-center text-sm text-gray-200 bg-white/10 rounded"
                                initial={{ y: 60, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.1 }}
                            >
                                <div className="flex items-center gap-2 p-2 px-3 sm:px-6.5 hover:bg-white/3 transition-colors">
                                    <ZapIcon className="size-4 text-sky-500" />
                                    <div>
                                        <div>Fleet Monitoring</div>
                                        <div className="text-xs text-gray-400">
                                            Track vehicles, drivers and trips instantly
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden sm:block h-6 w-px bg-white/6" />

                                <div className="flex items-center gap-2 p-2 px-3 sm:px-6.5 hover:bg-white/3 transition-colors">
                                    <CheckIcon className="size-4 text-cyan-500" />
                                    <div>
                                        <div>AI Fleet Assistant</div>
                                        <div className="text-xs text-gray-400">
                                            Ask questions. Get operational insights.
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right: modern mockup card */}
                        <motion.div className="mx-auto w-full max-w-lg"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.5 }}
                        >
                            <motion.div className="rounded-3xl overflow-hidden border border-white/6 shadow-2xl bg-linear-to-b from-black/50 to-transparent">
                                <div className="relative aspect-16/10 bg-gray-900">
                                    <img
                                        src={mainImageUrl}
                                        alt="agency-work-preview"
                                        className="w-full h-full object-cover object-center"
                                    />

                                    <div className="absolute right-4 bottom-4">
                                        <button className="">
                                            {/* <PlayIcon className="size-4" /> */}
                                            {/* <span className="text-xs">See case study</span> */}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>

                            {/* <div className="mt-4 flex gap-3 items-center justify-start">
                                {galleryStripImages.map((src, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ y: 20, opacity: 0 }}
                                        whileInView={{ y: 0, opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.1 + i * 0.1 }}
                                        className="w-14 h-10 rounded-lg overflow-hidden border border-white/6"
                                    >
                                        <img
                                            src={src}
                                            alt="project-thumbnail"
                                            className="w-full h-full object-cover"
                                        />
                                    </motion.div>
                                ))}
                                <motion.div className="text-sm text-gray-400 ml-2 flex items-center gap-2"
                                    initial={{ y: 60, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.2 }}
                                >
                                    <div className="relative flex h-3.5 w-3.5 items-center justify-center">
                                        <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping duration-300" />

                                        <span className="relative inline-flex size-2 rounded-full bg-green-600" />
                                    </div>
                                    20+ completed projects
                                </motion.div>
                            </div> */}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* LOGO MARQUEE */}
            <motion.section className="border-y border-white/6 bg-white/1 max-md:mt-10"
                initial={{ y: 60, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
            >
                <div className="max-w-6xl mx-auto px-6">
                    <div className="w-full overflow-hidden py-6">
                        <div className="flex gap-14 items-center justify-center animate-marquee whitespace-nowrap">
                            {trustedLogosText.concat(trustedLogosText).map((logo, i) => (
                                <span
                                    key={i}
                                    className="mx-6 text-sm md:text-base font-semibold text-gray-400 hover:text-gray-300 tracking-wide transition-colors"
                                >
                                    {logo}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.section>
        </>
    );
};
