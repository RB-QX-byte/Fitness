"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/shared/Header";
import { WorkoutCard } from "./WorkoutCard";
import { DietTile } from "./DietTile";
import { VoiceController } from "./VoiceController";
import { DailyMotivation } from "./DailyMotivation";
import { FloatingActions } from "./FloatingActions";
import { ImageModal } from "@/components/shared/ImageModal";
import { FitnessPlan, UserProfile } from "@/types/plan";
import { exportPlanAsPDF } from "@/components/shared/ExportPDF";
import { loadPlan, savePlan, loadUserProfile } from "@/lib/storage";
import { Activity, Target, TrendingUp, Flame, AlertCircle, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Terminal-style loading animation
function GeneratingOverlay({ isVisible }: { isVisible: boolean }) {
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        if (!isVisible) {
            setLogs([]);
            return;
        }

        const messages = [
            "Connecting to AI Coach...",
            "Analyzing your fitness profile...",
            "Computing optimal BMI targets...",
            "Designing personalized workout routine...",
            "Calculating macro nutrients...",
            "Generating exercise recommendations...",
            "Crafting motivational insights...",
            "Building your perfect plan...",
        ];

        let index = 0;
        const interval = setInterval(() => {
            if (index < messages.length) {
                setLogs((prev) => [...prev, messages[index]]);
                index++;
            }
        }, 350);

        return () => clearInterval(interval);
    }, [isVisible]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center"
                >
                    {/* Animated Background Orbs */}
                    <div className="absolute inset-0 overflow-hidden">
                        <motion.div
                            animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.2, 0.4, 0.2],
                                x: [0, 50, 0],
                            }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#CCFF00]/20 blur-[100px]"
                        />
                        <motion.div
                            animate={{
                                scale: [1.2, 1, 1.2],
                                opacity: [0.15, 0.3, 0.15],
                                x: [0, -30, 0],
                            }}
                            transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#00F0FF]/15 blur-[80px]"
                        />
                    </div>

                    <div className="max-w-lg w-full mx-4 relative z-10">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="glass-card rounded-3xl p-8"
                        >
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-6">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#CCFF00] to-[#00F0FF] flex items-center justify-center"
                                >
                                    <Flame size={20} className="text-black" />
                                </motion.div>
                                <div>
                                    <h3 className="font-bold text-lg">AI Coach</h3>
                                    <p className="text-xs text-gray-400">Generating your plan</p>
                                </div>
                            </div>

                            {/* Terminal Logs */}
                            <div className="bg-black/50 rounded-2xl p-4 font-mono text-sm space-y-2 min-h-[220px] border border-white/5">
                                {logs.map((log, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-start gap-2"
                                    >
                                        <span className="text-[#CCFF00] font-bold">›</span>
                                        <span className="text-gray-300">{log}</span>
                                        {index === logs.length - 1 && (
                                            <motion.span
                                                animate={{ opacity: [1, 0] }}
                                                transition={{ duration: 0.5, repeat: Infinity }}
                                                className="text-[#CCFF00] ml-1"
                                            >
                                                _
                                            </motion.span>
                                        )}
                                    </motion.div>
                                ))}
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-6">
                                <div className="flex justify-between text-xs text-gray-500 mb-2">
                                    <span>Processing</span>
                                    <span>{Math.min(logs.length * 12.5, 100).toFixed(0)}%</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: "0%" }}
                                        animate={{ width: `${Math.min(logs.length * 12.5, 100)}%` }}
                                        className="h-full bg-gradient-to-r from-[#CCFF00] to-[#00F0FF] rounded-full"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Error State Component
function ErrorBanner({ error, onRetry }: { error: string; onRetry: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-between gap-4"
        >
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-red-500/20">
                    <AlertCircle className="text-red-400" size={20} />
                </div>
                <div>
                    <p className="font-medium text-red-400">Generation Failed</p>
                    <p className="text-sm text-gray-400">{error}</p>
                </div>
            </div>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onRetry}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-medium"
            >
                <RefreshCw size={14} />
                Retry
            </motion.button>
        </motion.div>
    );
}

// Premium Stats Cards
function StatsCards({ plan }: { plan: FitnessPlan | null }) {
    const stats = [
        {
            icon: Activity,
            label: "Exercises",
            value: plan?.workout_plan?.exercises?.length || 0,
            color: "#CCFF00",
            glowClass: "stat-glow-lime",
        },
        {
            icon: Flame,
            label: "Calories",
            value: plan?.diet_plan?.total_calories || 0,
            color: "#00F0FF",
            glowClass: "stat-glow-cyan",
        },
        {
            icon: Target,
            label: "Meals",
            value: plan?.diet_plan?.meals?.length || 0,
            color: "#A855F7",
            glowClass: "stat-glow-purple",
        },
    ];

    return (
        <div className="grid grid-cols-3 gap-4 mb-6">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Card className={`glass-card border-0 rounded-2xl overflow-hidden ${stat.glowClass}`}>
                        <CardContent className="p-5 text-center relative">
                            {/* Glow effect */}
                            <div
                                className="absolute inset-0 opacity-10"
                                style={{
                                    background: `radial-gradient(circle at center, ${stat.color} 0%, transparent 70%)`,
                                }}
                            />

                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <stat.icon
                                    size={24}
                                    className="mx-auto mb-3"
                                    style={{ color: stat.color }}
                                />
                            </motion.div>
                            <div
                                className="text-3xl font-black tracking-tight"
                                style={{ color: stat.color }}
                            >
                                {stat.label === "Calories"
                                    ? stat.value.toLocaleString()
                                    : stat.value}
                            </div>
                            <div className="text-[11px] text-gray-500 uppercase tracking-widest mt-1 font-medium">
                                {stat.label}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}

export function FitnessDashboard() {
    const [plan, setPlan] = useState<FitnessPlan | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [voiceSection, setVoiceSection] = useState<"workout" | "diet">("workout");

    // Image modal state
    const [imageModal, setImageModal] = useState<{
        isOpen: boolean;
        title: string;
        type: "exercise" | "meal";
        details?: {
            sets?: number;
            reps?: string;
            rest?: string;
            tip?: string;
            macros?: { p: string; c: string; f: string };
        };
    }>({
        isOpen: false,
        title: "",
        type: "exercise",
    });

    // Load saved plan on mount
    useEffect(() => {
        const savedPlan = loadPlan();
        if (savedPlan) {
            setPlan(savedPlan);
        }

        const savedProfile = loadUserProfile();
        if (savedProfile) {
            setUserProfile(savedProfile);
        }
    }, []);

    // Handle exercise click
    const handleExerciseClick = useCallback((exerciseName: string) => {
        const exercise = plan?.workout_plan.exercises.find(
            (e) => e.name === exerciseName
        );
        if (exercise) {
            setImageModal({
                isOpen: true,
                title: exercise.name,
                type: "exercise",
                details: {
                    sets: exercise.sets,
                    reps: exercise.reps,
                    rest: exercise.rest,
                    tip: exercise.tip,
                },
            });
        }
    }, [plan]);

    // Handle meal click
    const handleMealClick = useCallback((mealName: string) => {
        const meal = plan?.diet_plan.meals.find((m) => m.name === mealName);
        if (meal) {
            setImageModal({
                isOpen: true,
                title: meal.name,
                type: "meal",
                details: {
                    macros: meal.macros,
                },
            });
        }
    }, [plan]);

    // Generate plan
    const handleGeneratePlan = useCallback(async () => {
        setIsGenerating(true);
        setError(null);

        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userProfile || {}),
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                throw new Error(data.error || "Generation failed");
            }

            setPlan(data);
            savePlan(data);
        } catch (err) {
            console.error("Plan generation error:", err);
            setError(err instanceof Error ? err.message : "Failed to generate plan. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    }, [userProfile]);

    // Export as PDF
    const handleExport = useCallback(async () => {
        if (!plan) return;
        setIsExporting(true);
        try {
            await exportPlanAsPDF(plan, userProfile?.name || "User");
        } finally {
            setIsExporting(false);
        }
    }, [plan, userProfile]);

    // Get voice text
    const getVoiceText = useCallback(() => {
        if (!plan) return "";

        if (voiceSection === "workout") {
            const exercises = plan.workout_plan.exercises
                .map((e, i) => `Exercise ${i + 1}: ${e.name}. ${e.sets} sets of ${e.reps} repetitions. Rest for ${e.rest}. ${e.tip}`)
                .join(". ");
            return `Today's workout: ${plan.workout_plan.title}. Duration: ${plan.workout_plan.duration}. ${exercises}`;
        } else {
            const meals = plan.diet_plan.meals
                .map((m) => `${m.label}: ${m.name}. Protein: ${m.macros.p}, Carbs: ${m.macros.c}, Fats: ${m.macros.f}`)
                .join(". ");
            return `Your diet plan for today. Total calories: ${plan.diet_plan.total_calories}. ${meals}`;
        }
    }, [plan, voiceSection]);

    return (
        <div className="min-h-screen mesh-gradient text-white relative overflow-hidden">
            {/* Animated Background Orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-20 -left-20 w-96 h-96 rounded-full bg-[#CCFF00]/10 blur-[120px] floating-orb" />
                <div className="absolute bottom-40 -right-20 w-80 h-80 rounded-full bg-[#00F0FF]/10 blur-[100px] floating-orb-delayed" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#A855F7]/5 blur-[150px]" />
            </div>

            {/* Content */}
            <div className="relative z-10 p-4 md:p-6 lg:p-8 pb-28 max-w-6xl mx-auto">
                {/* Generating Overlay */}
                <GeneratingOverlay isVisible={isGenerating} />

                {/* Image Modal */}
                <ImageModal
                    isOpen={imageModal.isOpen}
                    onClose={() => setImageModal((prev) => ({ ...prev, isOpen: false }))}
                    title={imageModal.title}
                    type={imageModal.type}
                    details={imageModal.details}
                />

                {/* Header */}
                <Header
                    userName={userProfile?.name || "Champion"}
                    userInitials={userProfile?.name?.slice(0, 2).toUpperCase() || "AI"}
                />

                {/* Error Banner */}
                {error && <ErrorBanner error={error} onRetry={handleGeneratePlan} />}

                {/* Stats Cards */}
                <StatsCards plan={plan} />

                {/* Main Bento Grid - Redesigned Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {/* Featured Workout Card - Spans 2 columns on larger screens */}
                    <div className="md:col-span-2 lg:col-span-2">
                        <WorkoutCard
                            workout={plan?.workout_plan || null}
                            isLoading={isGenerating}
                            onStart={handleGeneratePlan}
                            onExerciseClick={handleExerciseClick}
                        />
                    </div>

                    {/* Voice Controller */}
                    <div className="md:col-span-1 lg:col-span-1">
                        <VoiceController
                            planText={getVoiceText()}
                            section={voiceSection}
                            onSectionChange={setVoiceSection}
                            isLoading={isGenerating}
                        />
                    </div>

                    {/* Diet Card */}
                    <div className="md:col-span-1 lg:col-span-2">
                        <DietTile
                            diet={plan?.diet_plan || null}
                            isLoading={isGenerating}
                            onMealClick={handleMealClick}
                        />
                    </div>

                    {/* AI Motivation - Full Width */}
                    <div className="md:col-span-2 lg:col-span-1">
                        <DailyMotivation
                            quote={plan?.daily_motivation}
                            isLoading={isGenerating}
                        />
                    </div>
                </div>
            </div>

            {/* Floating Action Buttons */}
            <FloatingActions
                onRegenerate={handleGeneratePlan}
                onStartSession={handleGeneratePlan}
                onExport={handleExport}
                isGenerating={isGenerating}
                isExporting={isExporting}
            />
        </div>
    );
}
