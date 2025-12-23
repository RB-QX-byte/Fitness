"use client";

import { motion } from "framer-motion";
import { Play, Clock, Dumbbell, ChevronRight, Zap } from "lucide-react";
import { WorkoutPlan } from "@/types/plan";

interface WorkoutCardProps {
    workout: WorkoutPlan | null;
    isLoading?: boolean;
    onStart?: () => void;
    onExerciseClick?: (exerciseName: string) => void;
}

export function WorkoutCard({
    workout,
    isLoading = false,
    onStart,
    onExerciseClick,
}: WorkoutCardProps) {
    if (isLoading) {
        return (
            <div className="glass-card rounded-3xl overflow-hidden h-[320px] md:h-[280px]">
                <div className="p-6 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 rounded-2xl skeleton" />
                        <div className="flex-1">
                            <div className="h-4 w-32 rounded-lg skeleton mb-2" />
                            <div className="h-3 w-24 rounded skeleton" />
                        </div>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-16 rounded-xl skeleton" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-3xl overflow-hidden group h-[320px] md:h-[280px] relative"
        >
            {/* Animated Gradient Background */}
            <div className="absolute inset-0">
                {/* Base gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/80 via-zinc-800/70 to-zinc-900/80" />

                {/* Animated glowing orbs */}
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-[#CCFF00]/30 to-[#00F0FF]/10 blur-[60px]"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.15, 0.3, 0.15],
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-[#A855F7]/20 blur-[50px]"
                />

                {/* Grid pattern overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(204, 255, 0, 0.3) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(204, 255, 0, 0.3) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px',
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 p-6 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 10 }}
                            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#CCFF00] to-[#a8e600] flex items-center justify-center shadow-lg shadow-[#CCFF00]/20"
                        >
                            <Dumbbell size={22} className="text-black" />
                        </motion.div>
                        <div>
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="inline-flex items-center gap-1.5 bg-[#CCFF00]/10 text-[#CCFF00] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-[#CCFF00]/20"
                            >
                                <Zap size={10} />
                                Today's Focus
                            </motion.span>
                            <h2 className="text-xl font-bold mt-1 text-white">
                                {workout?.title || "Your Workout"}
                            </h2>
                        </div>
                    </div>

                    {/* Duration Badge */}
                    <div className="flex items-center gap-1.5 text-gray-400 text-sm bg-white/5 px-3 py-1.5 rounded-full">
                        <Clock size={14} />
                        <span>{workout?.duration || "-- mins"}</span>
                    </div>
                </div>

                {/* Exercise Grid */}
                <div className="flex-1 overflow-hidden">
                    {workout?.exercises ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 h-full overflow-y-auto hide-scrollbar">
                            {workout.exercises.map((exercise, index) => (
                                <motion.button
                                    key={exercise.name}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 * index }}
                                    onClick={() => onExerciseClick?.(exercise.name)}
                                    className="group/item p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] hover:border-[#CCFF00]/30 transition-all duration-300 text-left"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] text-[#CCFF00] font-bold uppercase tracking-wider">
                                            #{index + 1}
                                        </span>
                                        <ChevronRight size={12} className="text-gray-600 group-hover/item:text-[#CCFF00] transition-colors" />
                                    </div>
                                    <p className="text-sm font-semibold text-white truncate mb-1">
                                        {exercise.name}
                                    </p>
                                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                        <span>{exercise.sets}×{exercise.reps}</span>
                                        <span className="w-1 h-1 rounded-full bg-gray-600" />
                                        <span>{exercise.rest}</span>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center px-8">
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="mb-4"
                            >
                                <Dumbbell size={40} className="text-gray-600" />
                            </motion.div>
                            <p className="text-gray-500 text-sm mb-1">No workout plan yet</p>
                            <p className="text-gray-600 text-xs">Generate your personalized plan</p>
                        </div>
                    )}
                </div>

                {/* Start Button - Fixed at bottom */}
                <div className="mt-4 flex justify-end">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onStart}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#CCFF00] to-[#a8e600] text-black font-bold text-sm shadow-lg shadow-[#CCFF00]/20 hover:shadow-[#CCFF00]/40 transition-shadow"
                    >
                        <Play size={16} fill="currentColor" />
                        {workout ? "Regenerate" : "Generate Plan"}
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
