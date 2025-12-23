// TypeScript interfaces for AI-generated fitness plans

export interface Exercise {
    name: string;
    sets: number;
    reps: string;
    rest: string;
    tip: string;
    imageUrl?: string;
}

export interface WorkoutPlan {
    title: string;
    duration: string;
    exercises: Exercise[];
}

export interface Meal {
    label: string;
    name: string;
    calories?: number;
    macros: {
        p: string; // protein
        c: string; // carbs
        f: string; // fats
    };
    imageUrl?: string;
}

export interface DietPlan {
    total_calories: number;
    meals: Meal[];
}

export interface FitnessPlan {
    user_summary: string;
    daily_motivation: string;
    workout_plan: WorkoutPlan;
    diet_plan: DietPlan;
}

export interface UserProfile {
    name: string;
    age: number;
    gender: "male" | "female" | "other";
    height: number; // in cm
    weight: number; // in kg
    fitnessGoal: "weight_loss" | "muscle_gain" | "maintenance" | "endurance" | "flexibility";
    fitnessLevel: "beginner" | "intermediate" | "advanced";
    workoutLocation: "home" | "gym" | "outdoor";
    dietaryPreference: "veg" | "non_veg" | "vegan" | "keto";
    medicalHistory?: string;
    stressLevel?: "low" | "medium" | "high";
    sleepHours?: number;
}

export interface OnboardingStep {
    title: string;
    description: string;
    fields: string[];
}
