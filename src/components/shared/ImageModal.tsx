"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Sparkles, Volume2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    type: "exercise" | "meal";
    details?: {
        sets?: number;
        reps?: string;
        rest?: string;
        tip?: string;
        macros?: { p: string; c: string; f: string };
    };
}

export function ImageModal({
    isOpen,
    onClose,
    title,
    type,
    details,
}: ImageModalProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen || !title) {
            setImageUrl(null);
            setError(null);
            return;
        }

        const generateImage = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch("/api/image", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ prompt: title, type }),
                });

                const data = await response.json();

                if (data.imageUrl) {
                    setImageUrl(data.imageUrl);
                } else if (data.placeholder) {
                    // Show the actual message from the API or a fallback
                    setError(data.message || "Image generation is not available for this item.");
                } else {
                    setError("Failed to generate image");
                }
            } catch (err) {
                setError("Failed to generate image");
            } finally {
                setIsLoading(false);
            }
        };

        generateImage();
    }, [isOpen, title, type]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-lg mx-auto"
                    >
                        <div className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="text-[#CCFF00]" size={18} />
                                    <span className="text-sm font-medium text-gray-400">
                                        AI Generated {type === "exercise" ? "Exercise" : "Meal"}
                                    </span>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full hover:bg-zinc-800 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Image Area */}
                            <div className="relative aspect-square bg-zinc-800">
                                {isLoading ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        >
                                            <Loader2 size={40} className="text-[#CCFF00]" />
                                        </motion.div>
                                        <p className="text-gray-400 text-sm mt-4">
                                            Generating {type === "exercise" ? "exercise" : "meal"} visualization...
                                        </p>
                                    </div>
                                ) : imageUrl ? (
                                    <Image
                                        src={imageUrl}
                                        alt={title}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                        <div className="w-20 h-20 rounded-full bg-[#CCFF00]/10 flex items-center justify-center mb-4">
                                            {type === "exercise" ? (
                                                <span className="text-4xl">🏋️</span>
                                            ) : (
                                                <span className="text-4xl">🥗</span>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">{title}</h3>
                                        {error && (
                                            <p className="text-gray-500 text-sm">{error}</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Details */}
                            <div className="p-4">
                                <h2 className="text-xl font-bold mb-3">{title}</h2>

                                {type === "exercise" && details && (
                                    <div className="space-y-3">
                                        <div className="flex gap-3">
                                            <div className="flex-1 p-3 rounded-xl bg-zinc-800 text-center">
                                                <p className="text-2xl font-bold text-[#CCFF00]">
                                                    {details.sets}
                                                </p>
                                                <p className="text-[10px] text-gray-400 uppercase">Sets</p>
                                            </div>
                                            <div className="flex-1 p-3 rounded-xl bg-zinc-800 text-center">
                                                <p className="text-2xl font-bold text-[#00F0FF]">
                                                    {details.reps}
                                                </p>
                                                <p className="text-[10px] text-gray-400 uppercase">Reps</p>
                                            </div>
                                            <div className="flex-1 p-3 rounded-xl bg-zinc-800 text-center">
                                                <p className="text-2xl font-bold text-orange-400">
                                                    {details.rest}
                                                </p>
                                                <p className="text-[10px] text-gray-400 uppercase">Rest</p>
                                            </div>
                                        </div>

                                        {details.tip && (
                                            <div className="p-3 rounded-xl bg-[#CCFF00]/10 border border-[#CCFF00]/20">
                                                <div className="flex items-start gap-2">
                                                    <Info size={16} className="text-[#CCFF00] mt-0.5 flex-shrink-0" />
                                                    <p className="text-sm text-gray-300">{details.tip}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {type === "meal" && details?.macros && (
                                    <div className="flex gap-3">
                                        <div className="flex-1 p-3 rounded-xl bg-zinc-800 text-center">
                                            <p className="text-xl font-bold text-[#CCFF00]">
                                                {details.macros.p}
                                            </p>
                                            <p className="text-[10px] text-gray-400 uppercase">Protein</p>
                                        </div>
                                        <div className="flex-1 p-3 rounded-xl bg-zinc-800 text-center">
                                            <p className="text-xl font-bold text-[#00F0FF]">
                                                {details.macros.c}
                                            </p>
                                            <p className="text-[10px] text-gray-400 uppercase">Carbs</p>
                                        </div>
                                        <div className="flex-1 p-3 rounded-xl bg-zinc-800 text-center">
                                            <p className="text-xl font-bold text-orange-400">
                                                {details.macros.f}
                                            </p>
                                            <p className="text-[10px] text-gray-400 uppercase">Fats</p>
                                        </div>
                                    </div>
                                )}

                                <Button className="w-full mt-4" onClick={onClose}>
                                    Got it!
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
