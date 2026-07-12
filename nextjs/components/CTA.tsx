import { ArrowRightIcon, SparklesIcon } from 'lucide-react';
import { GhostButton } from './Buttons';
import { motion } from 'framer-motion';

export default function CTA() {
    return (
        <section
    id="cta"
    className="py-20 2xl:pb-32 px-4"
>
            <div className="container mx-auto max-w-5xl">
                <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-900/20 via-slate-900/60 to-indigo-900/20 p-12 md:p-16 text-center">

                    {/* Background Glow */}
                    <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
                    <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10" />

                    <div className="relative z-10">

                        <motion.div
                            className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300 mb-6"
                            initial={{ y: 60, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 250, damping: 70 }}
                        >
                            <SparklesIcon className="size-4" />
                            Smart Fleet Management Powered by AI
                        </motion.div>

                        <motion.h2
                            className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
                            initial={{ y: 60, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 250, damping: 70, delay: 0.1 }}
                        >
                            Transform Your Transport
                            <br />
                            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-emerald-300 bg-clip-text text-transparent">
                                Operations with TransitOps
                            </span>
                        </motion.h2>

                        <motion.p
                            className="max-w-3xl mx-auto text-slate-300 text-lg leading-relaxed mb-10"
                            initial={{ y: 60, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 250, damping: 70, delay: 0.2 }}
                        >
                            Manage vehicles, drivers, dispatch, maintenance, fuel expenses,
                            compliance, and analytics from one intelligent platform. Powered
                            by Retrieval-Augmented Generation (RAG) for instant operational
                            insights using natural language.
                        </motion.p>

                        <motion.div
                            className="flex flex-wrap justify-center gap-3 mb-10 text-sm"
                            initial={{ y: 60, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 250, damping: 70, delay: 0.3 }}
                        >
                            <span className="rounded-full bg-white/5 border border-white/10 px-4 py-2">
                                🚚 Fleet Management
                            </span>

                            <span className="rounded-full bg-white/5 border border-white/10 px-4 py-2">
                                🤖 AI Assistant
                            </span>

                            <span className="rounded-full bg-white/5 border border-white/10 px-4 py-2">
                                📊 Real-Time Analytics
                            </span>

                            <span className="rounded-full bg-white/5 border border-white/10 px-4 py-2">
                                🔒 Smart Validation
                            </span>
                        </motion.div>

                        <motion.div
                            initial={{ y: 60, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 250, damping: 70, delay: 0.4 }}
                        >
                        </motion.div>

                    </div>
                </div>
            </div>
        </section>
    );
}