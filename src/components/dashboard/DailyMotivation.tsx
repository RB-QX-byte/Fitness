"use client";

import { motion } from "framer-motion";
import { Sparkles, Quote } from "lucide-react";

interface DailyMotivationProps {
    quote?: string;
    isLoading?: boolean;
}

export function DailyMotivation({ quote, isLoading = false }: DailyMotivationProps) {
    if (isLoading) {
        return (
            <div className="glass-card rounded-3xl overflow-hidden h-full min-h-[160px]">
                <div className="p-6 flex flex-col justify-center h-full">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="h-8 w-8 rounded-xl skeleton" />
                        <div className="h-4 w-24 rounded skeleton" />
                    </div>
                    <div className="h-4 w-full rounded skeleton mb-2" />
                    <div className="h-4 w-3/4 rounded skeleton" />
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-card rounded-3xl overflow-hidden h-full min-h-[160px] relative group"
        >
            {/* Animated gradient accent */}
            <motion.div
                animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#A855F7] via-[#EC4899] to-[#A855F7]"
                style={{ backgroundSize: "200% 100%" }}
            />

            {/* Content */}
            <div className="p-6 flex flex-col justify-center h-full relative">
                {/* Decorative quote mark */}
                <div className="absolute top-4 right-4 opacity-5">
                    <Quote size={60} className="text-white" />
                </div>

                {/* Header */}
                <div className="flex items-center gap-2 mb-4">
                    <motion.div
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#A855F7] to-[#EC4899] flex items-center justify-center shadow-lg shadow-purple-500/20"
                    >
                        <Sparkles size={18} className="text-white" />
                    </motion.div>
                    <div>
                        <h3 className="font-bold text-white text-sm">Daily Motivation</h3>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">AI Generated</p>
                    </div>
                </div>

                {/* Quote */}
                {quote ? (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-gray-300 text-sm leading-relaxed italic"
                    >
                        "{quote}"
                    </motion.p>
                ) : (
                    <p className="text-gray-500 text-sm">
                        Generate a plan to receive your daily motivation...
                    </p>
                )}
            </div>
        </motion.div>
    );
}
