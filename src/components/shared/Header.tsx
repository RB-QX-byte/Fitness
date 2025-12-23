"use client";

import { motion } from "framer-motion";
import { Settings, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
    userName?: string;
    userInitials?: string;
    onSettingsClick?: () => void;
}

export function Header({
    userName = "Champion",
    userInitials = "AI",
    onSettingsClick,
}: HeaderProps) {
    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-8"
        >
            {/* Logo & Welcome */}
            <div>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-2"
                >
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                        <span className="text-white">AI</span>
                        <span className="bg-gradient-to-r from-[#CCFF00] to-[#00F0FF] bg-clip-text text-transparent">.</span>
                        <span className="text-white">COACH</span>
                    </h1>
                    <motion.div
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                    >
                        <Sparkles size={18} className="text-[#CCFF00]" />
                    </motion.div>
                </motion.div>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 text-sm mt-0.5"
                >
                    Welcome back, <span className="text-white font-medium">{userName}</span>
                </motion.p>
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center gap-3">
                {/* Settings */}
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onSettingsClick}
                        className="rounded-xl w-10 h-10 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05]"
                    >
                        <Settings size={18} className="text-gray-400" />
                    </Button>
                </motion.div>

                {/* User Avatar */}
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                >
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#CCFF00] to-[#00F0FF] flex items-center justify-center text-black font-bold text-sm cursor-pointer shadow-lg shadow-[#CCFF00]/20">
                        {userInitials}
                    </div>
                    {/* Online indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-[#050505]" />
                </motion.div>
            </div>
        </motion.header>
    );
}
