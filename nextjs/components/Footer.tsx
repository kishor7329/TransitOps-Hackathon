'use client';
import { motion } from 'framer-motion';

export default function Footer() {

    return (
        <motion.footer className="bg-white/6 border-t border-white/6 pt-10 text-gray-300"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 0.5 }}
        >
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-16 py-12 border-b border-white/10 items-center">
                    <div>
                        <img sizes="(max-width: 768px) 100vw, 50vw"
    src="/hero image/logo folder/logo.png"
    alt="TransitOps"
    className="h-35 w-auto drop-shadow-md"
/>
                        <p className="max-w-md mt-6 text-sm leading-7 text-gray-400">
    TransitOps is an AI-powered transport operations platform that centralizes fleet management, driver operations, dispatch, maintenance, fuel tracking, and analytics into one intelligent dashboard.
</p>
                    </div>

                    <div className="grid grid-cols-2 gap-8">

    <div>
        <h3 className="text-3xl font-bold text-cyan-400">4</h3>
        <p className="text-sm text-gray-400 mt-2">
            User Roles
        </p>
    </div>

    <div>
        <h3 className="text-3xl font-bold text-cyan-400">10+</h3>
        <p className="text-sm text-gray-400 mt-2">
            Smart Validations
        </p>
    </div>

    <div>
        <h3 className="text-3xl font-bold text-cyan-400">AI</h3>
        <p className="text-sm text-gray-400 mt-2">
            RAG Assistant
        </p>
    </div>

    <div>
        <h3 className="text-3xl font-bold text-cyan-400">24/7</h3>
        <p className="text-sm text-gray-400 mt-2">
            Fleet Monitoring
        </p>
    </div>

</div>
                    </div>
                </div>

                <p className="py-6 text-center text-sm text-gray-500 border-t border-white/10 mt-10">
    © {new Date().getFullYear()} TransitOps • Smart Transport Operations Platform
    <br />
    Built for the TransitOps Hackathon using Next.js, Tailwind CSS, Framer Motion, and AI-powered Retrieval-Augmented Generation (RAG).
</p>
        </motion.footer>
    );
};