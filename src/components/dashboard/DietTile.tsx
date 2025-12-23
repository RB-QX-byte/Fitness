"use client";

import { motion } from "framer-motion";
import { Utensils, ChevronRight, Flame } from "lucide-react";
import { DietPlan } from "@/types/plan";

interface DietTileProps {
    diet: DietPlan | null;
    isLoading?: boolean;
    onClick?: () => void;
    onMealClick?: (mealName: string) => void;
}

// Circular Progress Ring Component
function ProgressRing({
    progress,
    color,
    size = 50,
    strokeWidth = 4,
}: {
    progress: number;
    color: string;
    size?: number;
    strokeWidth?: number;
}) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <svg width={size} height={size} className="progress-ring">
            {/* Background circle */}
            <circle
                stroke="rgba(255,255,255,0.05)"
                fill="transparent"
                strokeWidth={strokeWidth}
                r={radius}
                cx={size / 2}
                cy={size / 2}
            />
            {/* Progress circle */}
            <motion.circle
                stroke={color}
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                r={radius}
                cx={size / 2}
                cy={size / 2}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{
                    strokeDasharray: circumference,
                }}
            />
        </svg>
    );
}

export function DietTile({
    diet,
    isLoading = false,
    onClick,
    onMealClick,
}: DietTileProps) {
    // Calculate macro totals
    const totalProtein = diet?.meals?.reduce((acc, meal) => {
        const p = parseInt(meal.macros.p) || 0;
        return acc + p;
    }, 0) || 0;

    const totalCarbs = diet?.meals?.reduce((acc, meal) => {
        const c = parseInt(meal.macros.c) || 0;
        return acc + c;
    }, 0) || 0;

    const totalFats = diet?.meals?.reduce((acc, meal) => {
        const f = parseInt(meal.macros.f) || 0;
        return acc + f;
    }, 0) || 0;

    const macroTotal = totalProtein + totalCarbs + totalFats || 1;
    const proteinPercent = Math.round((totalProtein / macroTotal) * 100);
    const carbsPercent = Math.round((totalCarbs / macroTotal) * 100);
    const fatsPercent = Math.round((totalFats / macroTotal) * 100);

    if (isLoading) {
        return (
            <div className="glass-card rounded-3xl overflow-hidden p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-12 w-12 rounded-2xl skeleton" />
                    <div className="flex-1">
                        <div className="h-4 w-24 rounded-lg skeleton mb-2" />
                        <div className="h-3 w-32 rounded skeleton" />
                    </div>
                </div>
                <div className="flex justify-center gap-8 mb-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 w-16 rounded-full skeleton" />
                    ))}
                </div>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-14 rounded-xl skeleton" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onClick={onClick}
            className="glass-card rounded-3xl overflow-hidden group cursor-pointer hover:border-[#00F0FF]/20 transition-all duration-300"
        >
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: -10 }}
                            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00F0FF] to-[#0891b2] flex items-center justify-center shadow-lg shadow-[#00F0FF]/20"
                        >
                            <Utensils size={22} className="text-black" />
                        </motion.div>
                        <div>
                            <h3 className="font-bold text-lg text-white">Nutrition Plan</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Flame size={14} className="text-orange-400" />
                                <span>{diet?.total_calories?.toLocaleString() || "0"} kcal</span>
                            </div>
                        </div>
                    </div>
                    <motion.div
                        whileHover={{ x: 5 }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronRight size={20} className="text-gray-500" />
                    </motion.div>
                </div>

                {/* Macro Rings */}
                {diet && (
                    <div className="flex justify-center gap-6 md:gap-10 mb-6">
                        {[
                            { label: "Protein", value: totalProtein, percent: proteinPercent, color: "#CCFF00" },
                            { label: "Carbs", value: totalCarbs, percent: carbsPercent, color: "#00F0FF" },
                            { label: "Fats", value: totalFats, percent: fatsPercent, color: "#F97316" },
                        ].map((macro) => (
                            <motion.div
                                key={macro.label}
                                whileHover={{ scale: 1.1 }}
                                className="text-center"
                            >
                                <div className="relative inline-flex items-center justify-center">
                                    <ProgressRing
                                        progress={macro.percent}
                                        color={macro.color}
                                        size={60}
                                        strokeWidth={5}
                                    />
                                    <span
                                        className="absolute text-sm font-bold"
                                        style={{ color: macro.color }}
                                    >
                                        {macro.value}g
                                    </span>
                                </div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-2 font-medium">
                                    {macro.label}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Meal Cards */}
                {diet?.meals && diet.meals.length > 0 ? (
                    <div className="space-y-2">
                        {diet.meals.map((meal, index) => (
                            <motion.button
                                key={meal.label}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.05 * index }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onMealClick?.(meal.name);
                                }}
                                className="w-full group/meal p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] hover:border-[#00F0FF]/20 transition-all duration-300 text-left flex items-center gap-3"
                            >
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00F0FF]/20 to-[#0891b2]/10 flex items-center justify-center flex-shrink-0">
                                    <span className="text-[10px] font-bold text-[#00F0FF]">
                                        {meal.label.slice(0, 2).toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] text-[#00F0FF] font-semibold uppercase tracking-wider">
                                        {meal.label}
                                    </p>
                                    <p className="text-sm text-white font-medium truncate">
                                        {meal.name}
                                    </p>
                                </div>
                                <div className="text-right text-[10px] text-gray-500 flex-shrink-0">
                                    <span className="text-[#CCFF00]">{meal.macros.p}</span> ·{" "}
                                    <span className="text-[#00F0FF]">{meal.macros.c}</span> ·{" "}
                                    <span className="text-orange-400">{meal.macros.f}</span>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <Utensils size={32} className="text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">No meal plan yet</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
