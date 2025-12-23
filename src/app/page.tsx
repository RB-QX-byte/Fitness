"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { hasCompletedOnboarding } from "@/lib/storage";

// Dynamically import dashboard to avoid SSR hydration issues
const FitnessDashboard = dynamic(
    () =>
        import("@/components/dashboard/FitnessDashboard").then(
            (mod) => mod.FitnessDashboard
        ),
    {
        ssr: false,
        loading: () => (
            <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#CCFF00] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400 text-sm">Loading your dashboard...</p>
                </div>
            </div>
        ),
    }
);

export default function Home() {
    const router = useRouter();
    const [isReady, setIsReady] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        // Check if user has completed onboarding
        if (!hasCompletedOnboarding()) {
            router.push("/onboarding");
        } else {
            setIsReady(true);
        }
    }, [router, mounted]);

    // Show nothing during SSR to prevent hydration mismatch
    if (!mounted) {
        return (
            <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#CCFF00] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400 text-sm">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isReady) {
        return (
            <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#CCFF00] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400 text-sm">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return <FitnessDashboard />;
}
