import { FitnessPlan, UserProfile } from "@/types/plan";

const PLAN_STORAGE_KEY = "ai_coach_plan";
const PROFILE_STORAGE_KEY = "ai_coach_profile";

// Save fitness plan to localStorage
export function savePlan(plan: FitnessPlan): void {
    if (typeof window === "undefined") return;

    try {
        const data = {
            plan,
            savedAt: new Date().toISOString(),
        };
        localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error("Failed to save plan:", error);
    }
}

// Load fitness plan from localStorage
export function loadPlan(): FitnessPlan | null {
    if (typeof window === "undefined") return null;

    try {
        const data = localStorage.getItem(PLAN_STORAGE_KEY);
        if (!data) return null;

        const parsed = JSON.parse(data);
        return parsed.plan as FitnessPlan;
    } catch (error) {
        console.error("Failed to load plan:", error);
        return null;
    }
}

// Clear saved plan
export function clearPlan(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(PLAN_STORAGE_KEY);
}

// Save user profile
export function saveUserProfile(profile: UserProfile): void {
    if (typeof window === "undefined") return;

    try {
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch (error) {
        console.error("Failed to save profile:", error);
    }
}

// Load user profile
export function loadUserProfile(): UserProfile | null {
    if (typeof window === "undefined") return null;

    try {
        const data = localStorage.getItem(PROFILE_STORAGE_KEY);
        if (!data) return null;

        return JSON.parse(data) as UserProfile;
    } catch (error) {
        console.error("Failed to load profile:", error);
        return null;
    }
}

// Clear user profile
export function clearUserProfile(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(PROFILE_STORAGE_KEY);
}

// Check if user has completed onboarding
export function hasCompletedOnboarding(): boolean {
    if (typeof window === "undefined") return false;
    return loadUserProfile() !== null;
}

// Clear all stored data
export function clearAllData(): void {
    clearPlan();
    clearUserProfile();
}
