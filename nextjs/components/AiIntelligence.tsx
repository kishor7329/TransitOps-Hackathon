import { Check } from 'lucide-react';
import { PrimaryButton, GhostButton } from './Buttons';
import Title from './Title';
import { motion } from 'framer-motion';
import { useRef } from 'react';

import {
    Bot,
    DatabaseZap,
    ShieldCheck,
    BarChart3
} from "lucide-react";

const aiFeatures = [
    {
        icon: <Bot className="size-8 text-cyan-400" />,
        title: "Natural Language Search",
        desc: "Ask questions about vehicles, drivers, trips, and maintenance in plain English.",
        features: [
            "Fleet Search",
            "Trip Information",
            "Driver Lookup",
            "Vehicle Status"
        ]
    },
    {
        icon: <DatabaseZap className="size-8 text-cyan-400" />,
        title: "Real-Time Retrieval",
        desc: "Retrieve live operational data directly from your transport database using RAG.",
        features: [
            "Maintenance Logs",
            "Fuel Records",
            "Expense Tracking",
            "Trip History"
        ]
    },
    {
        icon: <ShieldCheck className="size-8 text-cyan-400" />,
        title: "Business Rule Validation",
        desc: "AI explains dispatch restrictions and validates every assignment automatically.",
        features: [
            "License Validation",
            "Capacity Check",
            "Duplicate Assignment Prevention",
            "Maintenance Lock"
        ]
    },
    {
        icon: <BarChart3 className="size-8 text-cyan-400" />,
        title: "Operational Insights",
        desc: "Generate summaries for fleet utilization, ROI, fuel efficiency, and expenses.",
        features: [
            "Fuel Efficiency",
            "Fleet Utilization",
            "Vehicle ROI",
            "Cost Analytics"
        ]
    }
];

export default function AiIntelligence() {
    const refs = useRef<(HTMLDivElement | null)[]>([]);
    return (
        <section id="ai-intelligence" className="py-20 bg-white/3 border-t border-white/6">
            <div className="max-w-6xl mx-auto px-4">

                <Title
    title="AI Fleet Intelligence"
    heading="Powered by Retrieval-Augmented Generation (RAG)"
    description="Ask questions in natural language and instantly retrieve fleet information, maintenance history, compliance status, fuel analytics, and operational insights."
/>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {aiFeatures.map((feature, i) => (
                        <motion.div
                            key={i}

                            ref={(el) => {
                                refs.current[i] = el;
                            }}
                            initial={{ y: 150, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.1 + i * 0.1 }}
                            onAnimationComplete={() => {
                                const card = refs.current[i];
                                if (card) {
                                    card.classList.add("transition", "duration-500", "hover:scale-102");
                                }
                            }}
                            className="relative p-6 rounded-xl border border-white/8 bg-indigo-950/30 backdrop-blur transition duration-300 hover:border-cyan-400/40 hover:-translate-y-2"
>
    <div className="mb-5">
        {feature.icon}
    </div>

    <h3 className="text-xl font-semibold mb-3">
        {feature.title}
    </h3>

    <p className="text-sm text-gray-300 leading-6 mb-6">
        {feature.desc}
    </p>

    <ul className="space-y-3">
        {feature.features.map((feat, i) => (
            <li
                key={i}
                className="flex items-center gap-3 text-sm text-gray-300"
            >
                <Check className="w-4 h-4 text-cyan-400" />
                {feat}
            </li>
        ))}
    </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};