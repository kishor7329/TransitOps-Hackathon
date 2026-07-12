import { ChevronDownIcon } from 'lucide-react';
import Title from './Title';
import { useRef } from 'react';
import { motion } from 'framer-motion';


const validationRules = [
    {
        question: "Vehicle Availability Check",
        answer: "Only vehicles marked as Available can be assigned to a trip. Vehicles that are On Trip, In Shop, or Retired are automatically excluded from dispatch."
    },
    {
        question: "Driver Eligibility Verification",
        answer: "Drivers with expired licenses or Suspended status cannot be assigned to trips. The system validates eligibility before dispatch."
    },
    {
        question: "Cargo Capacity Validation",
        answer: "TransitOps verifies that the cargo weight never exceeds the selected vehicle's maximum load capacity."
    },
    {
        question: "Automatic Status Transitions",
        answer: "Dispatching a trip automatically updates both vehicle and driver status to On Trip. Completing or cancelling a trip restores their availability."
    },
    {
        question: "Maintenance Workflow Protection",
        answer: "Vehicles under active maintenance are automatically moved to In Shop and removed from the dispatch pool until maintenance is completed."
    },
    {
        question: "Duplicate Assignment Prevention",
        answer: "A vehicle or driver already assigned to an active trip cannot be allocated to another trip, preventing scheduling conflicts."
    }
];

export default function Faq() {
    const refs = useRef<(HTMLDetailsElement | null)[]>([]);
    return (
        <section id="faq" className="py-20 2xl:py-32">
            <div className="max-w-3xl mx-auto px-4">

                <Title
    title="Smart Validation Engine"
    heading="Every Dispatch Is Validated Automatically"
    description="TransitOps enforces critical business rules to ensure safe, compliant, and error-free transport operations."
/>

                <div className="space-y-3">
                    {validationRules.map((rule, i) => (
                        <motion.details
                            ref={(el) => {
                                refs.current[i] = el;
                            }}
                            initial={{ y: 100, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.1 + i * 0.1 }}
                            key={i}
                            onAnimationComplete={() => {
                                const card = refs.current[i];
                                if (card) {
                                    card.classList.add("transition", "duration-300");
                                }
                            }}
                            className="group bg-gradient-to-r from-slate-900/60 to-indigo-950/40 border border-white/10 rounded-2xl select-none transition-all duration-300 hover:border-cyan-400/40 hover:bg-slate-900/80"
                        >
                            <summary className="flex items-center justify-between p-4 cursor-pointer">
                                <div className="flex items-center">
    <div className="w-10 h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center mr-4">
        <span className="text-emerald-400 font-bold">✓</span>
    </div>

    <h4 className="font-medium">
        {rule.question}
    </h4>
</div>
                               
                            </summary>
                            <p className="p-4 pt-0 text-sm text-gray-300 leading-relaxed">
                                {rule.answer}
                            </p>
                        </motion.details>
                    ))}
                </div>
            </div>
        </section>
    );
};