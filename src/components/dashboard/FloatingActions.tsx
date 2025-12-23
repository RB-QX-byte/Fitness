"use client";

import { motion } from "framer-motion";
import { RefreshCw, Download, Play, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingActionsProps {
    onRegenerate?: () => void;
    onStartSession?: () => void;
    onExport?: () => void;
    isGenerating?: boolean;
    isExporting?: boolean;
}

export function FloatingActions({
    onRegenerate,
    onStartSession,
    onExport,
    isGenerating = false,
    isExporting = false,
}: FloatingActionsProps) {
    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 100, delay: 0.5 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
            <div className="flex items-center gap-2 glass-card p-2 rounded-2xl shadow-2xl shadow-black/50">
                {/* Regenerate Button */}
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onRegenerate}
                        disabled={isGenerating}
                        className="rounded-xl w-11 h-11 hover:bg-white/10"
                    >
                        <RefreshCw
                            size={18}
                            className={`${isGenerating ? "animate-spin text-[#CCFF00]" : "text-gray-400"}`}
                        />
                    </Button>
                </motion.div>

                {/* Start Session CTA */}
                <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                >
                    <Button
                        onClick={onStartSession}
                        disabled={isGenerating}
                        className="relative overflow-hidden h-11 px-6 rounded-xl bg-gradient-to-r from-[#CCFF00] to-[#a8e600] hover:from-[#d4ff1a] hover:to-[#b8f000] text-black font-bold shadow-lg shadow-[#CCFF00]/25"
                    >
                        {/* Animated shine effect */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            animate={{
                                x: ["-100%", "200%"],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 3,
                                ease: "easeInOut",
                            }}
                        />

                        <span className="relative flex items-center gap-2">
                            {isGenerating ? (
                                <>
                                    <Zap size={16} className="animate-pulse" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Play size={16} fill="currentColor" />
                                    Generate
                                </>
                            )}
                        </span>
                    </Button>
                </motion.div>

                {/* Export Button */}
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onExport}
                        disabled={isExporting || isGenerating}
                        className="rounded-xl w-11 h-11 hover:bg-white/10"
                    >
                        <Download
                            size={18}
                            className={`${isExporting ? "animate-bounce text-[#00F0FF]" : "text-gray-400"}`}
                        />
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    );
}
