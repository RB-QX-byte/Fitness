"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Volume2, Pause, Waves } from "lucide-react";

interface VoiceControllerProps {
    planText?: string;
    section?: "workout" | "diet";
    onSectionChange?: (section: "workout" | "diet") => void;
    isLoading?: boolean;
}

export function VoiceController({
    planText,
    section = "workout",
    onSectionChange,
    isLoading = false,
}: VoiceControllerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Enhanced Waveform bars animation
    const WaveformBars = () => (
        <div className="flex items-center justify-center gap-1 h-12">
            {[...Array(7)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={{
                        height: isPlaying ? [8, 28, 12, 24, 8, 20, 8] : 8,
                        opacity: isPlaying ? [0.6, 1, 0.7, 1, 0.6] : 0.4,
                    }}
                    transition={{
                        duration: 0.6,
                        repeat: isPlaying ? Infinity : 0,
                        delay: i * 0.08,
                        ease: "easeInOut",
                    }}
                    className="w-1.5 rounded-full"
                    style={{
                        background: `linear-gradient(to top, #CCFF00, #00F0FF)`,
                    }}
                />
            ))}
        </div>
    );

    const handlePlayPause = async () => {
        if (!planText) return;

        if (isPlaying) {
            // Stop playing
            audioRef.current?.pause();
            window.speechSynthesis?.cancel();
            setIsPlaying(false);
            return;
        }

        // Start playing - try voice API first, then fall back to browser TTS
        setIsPlaying(true);
        setIsReady(false);

        try {
            const response = await fetch("/api/voice", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: planText, section }),
            });

            if (response.ok) {
                const audioBlob = await response.blob();
                const audioUrl = URL.createObjectURL(audioBlob);

                if (audioRef.current) {
                    audioRef.current.src = audioUrl;
                    audioRef.current.play();
                    setIsReady(true);
                    return; // Success with API
                }
            }

            // API failed or returned error, use browser TTS
            throw new Error("API unavailable");
        } catch (error) {
            console.log("Using browser TTS fallback");
            // Use browser's built-in speech synthesis
            if ("speechSynthesis" in window) {
                window.speechSynthesis.cancel(); // Clear any pending speech
                const utterance = new SpeechSynthesisUtterance(planText);
                utterance.rate = 0.9;
                utterance.pitch = 1;
                utterance.onend = () => setIsPlaying(false);
                utterance.onerror = () => setIsPlaying(false);
                window.speechSynthesis.speak(utterance);
                setIsReady(true);
            } else {
                setIsPlaying(false);
                console.warn("Text-to-speech is not supported in this browser");
            }
        }
    };

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            audioRef.current?.pause();
            window.speechSynthesis?.cancel();
        };
    }, []);

    if (isLoading) {
        return (
            <div className="glass-card rounded-3xl overflow-hidden h-full min-h-[200px]">
                <div className="p-6 flex flex-col items-center justify-center h-full">
                    <div className="h-16 w-16 rounded-2xl skeleton mb-4" />
                    <div className="h-4 w-24 rounded-lg skeleton mb-3" />
                    <div className="h-8 w-32 rounded-xl skeleton" />
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card rounded-3xl overflow-hidden h-full min-h-[200px] hover:border-[#CCFF00]/20 transition-all duration-300"
        >
            {/* Background glow when playing */}
            <AnimatePresence>
                {isPlaying && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gradient-to-t from-[#CCFF00]/10 to-transparent pointer-events-none"
                    />
                )}
            </AnimatePresence>

            <div className="relative p-6 flex flex-col items-center justify-center h-full">
                {/* Hidden audio element */}
                <audio
                    ref={audioRef}
                    onEnded={() => setIsPlaying(false)}
                    className="hidden"
                />

                {/* Icon / Waveform */}
                <AnimatePresence mode="wait">
                    {isPlaying ? (
                        <motion.div
                            key="waveform"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="mb-4"
                        >
                            <WaveformBars />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="mic"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="mb-4"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ repeat: Infinity, duration: 2.5 }}
                                className="relative"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#CCFF00]/20 to-[#00F0FF]/10 flex items-center justify-center border border-[#CCFF00]/20">
                                    <Waves className="text-[#CCFF00]" size={28} />
                                </div>
                                {/* Pulse ring */}
                                <motion.div
                                    animate={{ scale: [1, 1.5], opacity: [0.4, 0] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="absolute inset-0 rounded-2xl border border-[#CCFF00]/30"
                                />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Title */}
                <h3 className="font-bold text-white mb-3">AI Voice Coach</h3>

                {/* Section Toggle */}
                <div className="flex gap-1 p-1 bg-white/[0.03] rounded-xl mb-4">
                    {(["workout", "diet"] as const).map((s) => (
                        <button
                            key={s}
                            onClick={() => onSectionChange?.(s)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${section === s
                                    ? "bg-gradient-to-r from-[#CCFF00] to-[#a8e600] text-black shadow-md"
                                    : "text-gray-400 hover:text-white"
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                {/* Play Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePlayPause}
                    disabled={!planText}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                    {isPlaying ? (
                        <>
                            <Pause size={16} className="text-[#CCFF00]" />
                            <span className="text-white">Pause</span>
                        </>
                    ) : (
                        <>
                            <Volume2 size={16} className="text-[#CCFF00]" />
                            <span className="text-white">Read Plan</span>
                        </>
                    )}
                </motion.button>
            </div>
        </motion.div>
    );
}
