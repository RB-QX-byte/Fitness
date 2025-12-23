"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    User,
    Ruler,
    Target,
    Dumbbell,
    Utensils,
    Heart,
    ChevronRight,
    ChevronLeft,
    Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { UserProfile } from "@/types/plan";
import { saveUserProfile } from "@/lib/storage";

const STEPS = [
    {
        title: "Personal Info",
        description: "Let's get to know you better",
        icon: User,
        fields: ["name", "age", "gender"],
    },
    {
        title: "Body Metrics",
        description: "Help us understand your physique",
        icon: Ruler,
        fields: ["height", "weight"],
    },
    {
        title: "Fitness Goal",
        description: "What do you want to achieve?",
        icon: Target,
        fields: ["fitnessGoal"],
    },
    {
        title: "Workout Setup",
        description: "Customize your training",
        icon: Dumbbell,
        fields: ["fitnessLevel", "workoutLocation"],
    },
    {
        title: "Diet Preferences",
        description: "Your nutritional needs",
        icon: Utensils,
        fields: ["dietaryPreference"],
    },
    {
        title: "Health Info",
        description: "Optional but helpful",
        icon: Heart,
        fields: ["medicalHistory", "stressLevel", "sleepHours"],
    },
];

const GOALS = [
    { value: "weight_loss", label: "Weight Loss", emoji: "🔥" },
    { value: "muscle_gain", label: "Muscle Gain", emoji: "💪" },
    { value: "maintenance", label: "Maintenance", emoji: "⚖️" },
    { value: "endurance", label: "Endurance", emoji: "🏃" },
    { value: "flexibility", label: "Flexibility", emoji: "🧘" },
];

const LEVELS = [
    { value: "beginner", label: "Beginner", description: "Just starting out" },
    { value: "intermediate", label: "Intermediate", description: "1-2 years experience" },
    { value: "advanced", label: "Advanced", description: "3+ years experience" },
];

const LOCATIONS = [
    { value: "home", label: "Home", emoji: "🏠" },
    { value: "gym", label: "Gym", emoji: "🏋️" },
    { value: "outdoor", label: "Outdoor", emoji: "🌳" },
];

const DIETS = [
    { value: "non_veg", label: "Non-Veg", emoji: "🍖" },
    { value: "veg", label: "Vegetarian", emoji: "🥗" },
    { value: "vegan", label: "Vegan", emoji: "🌱" },
    { value: "keto", label: "Keto", emoji: "🥑" },
];

const STRESS_LEVELS = [
    { value: "low", label: "Low", color: "bg-green-500" },
    { value: "medium", label: "Medium", color: "bg-yellow-500" },
    { value: "high", label: "High", color: "bg-red-500" },
];

export default function OnboardingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [profile, setProfile] = useState<Partial<UserProfile>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const progress = ((currentStep + 1) / STEPS.length) * 100;
    const step = STEPS[currentStep];
    const StepIcon = step.icon;

    const updateProfile = (field: string, value: string | number) => {
        setProfile((prev) => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep((prev) => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        // Save profile
        saveUserProfile(profile as UserProfile);

        // Navigate to dashboard
        await new Promise((resolve) => setTimeout(resolve, 500));
        router.push("/");
    };

    const isStepValid = () => {
        switch (currentStep) {
            case 0:
                return profile.name && profile.age && profile.gender;
            case 1:
                return profile.height && profile.weight;
            case 2:
                return profile.fitnessGoal;
            case 3:
                return profile.fitnessLevel && profile.workoutLocation;
            case 4:
                return profile.dietaryPreference;
            case 5:
                return true; // Optional step
            default:
                return false;
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0B0B] text-white flex flex-col items-center justify-center p-4">
            {/* Background Gradient */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#CCFF00]/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00F0FF]/10 rounded-full blur-3xl" />
            </div>

            {/* Logo */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 text-center relative z-10"
            >
                <h1 className="text-3xl font-black italic tracking-tighter">
                    <span className="text-white">AI</span>
                    <span className="text-[#CCFF00]">.</span>
                    <span className="text-white">COACH</span>
                </h1>
                <p className="text-gray-400 text-sm mt-1">Your Personal AI Fitness Assistant</p>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "100%" }}
                className="w-full max-w-md mb-6 relative z-10"
            >
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>Step {currentStep + 1} of {STEPS.length}</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
            </motion.div>

            {/* Main Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-md relative z-10"
                >
                    <Card variant="glass" className="backdrop-blur-xl">
                        <CardContent className="p-6">
                            {/* Step Header */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-xl bg-[#CCFF00]/10">
                                    <StepIcon className="text-[#CCFF00]" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{step.title}</h2>
                                    <p className="text-gray-400 text-sm">{step.description}</p>
                                </div>
                            </div>

                            {/* Step Content */}
                            <div className="space-y-4">
                                {/* Step 0: Personal Info */}
                                {currentStep === 0 && (
                                    <>
                                        <div>
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                                id="name"
                                                placeholder="Enter your name"
                                                value={profile.name || ""}
                                                onChange={(e) => updateProfile("name", e.target.value)}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="age">Age</Label>
                                            <Input
                                                id="age"
                                                type="number"
                                                placeholder="Enter your age"
                                                value={profile.age || ""}
                                                onChange={(e) => updateProfile("age", parseInt(e.target.value) || 0)}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label>Gender</Label>
                                            <div className="flex gap-2 mt-1">
                                                {["male", "female", "other"].map((g) => (
                                                    <Button
                                                        key={g}
                                                        variant={profile.gender === g ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => updateProfile("gender", g)}
                                                        className="flex-1 capitalize"
                                                    >
                                                        {g}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Step 1: Body Metrics */}
                                {currentStep === 1 && (
                                    <>
                                        <div>
                                            <Label htmlFor="height">Height (cm)</Label>
                                            <Input
                                                id="height"
                                                type="number"
                                                placeholder="e.g., 175"
                                                value={profile.height || ""}
                                                onChange={(e) => updateProfile("height", parseInt(e.target.value) || 0)}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="weight">Weight (kg)</Label>
                                            <Input
                                                id="weight"
                                                type="number"
                                                placeholder="e.g., 70"
                                                value={profile.weight || ""}
                                                onChange={(e) => updateProfile("weight", parseInt(e.target.value) || 0)}
                                                className="mt-1"
                                            />
                                        </div>
                                        {profile.height && profile.weight && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="p-3 rounded-xl bg-[#CCFF00]/10 text-center"
                                            >
                                                <span className="text-gray-400 text-sm">Your BMI: </span>
                                                <span className="text-[#CCFF00] font-bold">
                                                    {(profile.weight / ((profile.height / 100) ** 2)).toFixed(1)}
                                                </span>
                                            </motion.div>
                                        )}
                                    </>
                                )}

                                {/* Step 2: Fitness Goal */}
                                {currentStep === 2 && (
                                    <div className="grid grid-cols-2 gap-3">
                                        {GOALS.map((goal) => (
                                            <motion.button
                                                key={goal.value}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => updateProfile("fitnessGoal", goal.value)}
                                                className={`p-4 rounded-xl border transition-all text-left ${profile.fitnessGoal === goal.value
                                                        ? "border-[#CCFF00] bg-[#CCFF00]/10"
                                                        : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
                                                    }`}
                                            >
                                                <span className="text-2xl">{goal.emoji}</span>
                                                <p className="font-medium mt-2">{goal.label}</p>
                                            </motion.button>
                                        ))}
                                    </div>
                                )}

                                {/* Step 3: Workout Setup */}
                                {currentStep === 3 && (
                                    <>
                                        <div>
                                            <Label>Fitness Level</Label>
                                            <div className="space-y-2 mt-2">
                                                {LEVELS.map((level) => (
                                                    <motion.button
                                                        key={level.value}
                                                        whileHover={{ scale: 1.01 }}
                                                        whileTap={{ scale: 0.99 }}
                                                        onClick={() => updateProfile("fitnessLevel", level.value)}
                                                        className={`w-full p-3 rounded-xl border transition-all text-left ${profile.fitnessLevel === level.value
                                                                ? "border-[#CCFF00] bg-[#CCFF00]/10"
                                                                : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
                                                            }`}
                                                    >
                                                        <p className="font-medium">{level.label}</p>
                                                        <p className="text-xs text-gray-400">{level.description}</p>
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Workout Location</Label>
                                            <div className="flex gap-2 mt-2">
                                                {LOCATIONS.map((loc) => (
                                                    <Button
                                                        key={loc.value}
                                                        variant={profile.workoutLocation === loc.value ? "default" : "outline"}
                                                        onClick={() => updateProfile("workoutLocation", loc.value)}
                                                        className="flex-1"
                                                    >
                                                        <span className="mr-1">{loc.emoji}</span>
                                                        {loc.label}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Step 4: Diet Preferences */}
                                {currentStep === 4 && (
                                    <div className="grid grid-cols-2 gap-3">
                                        {DIETS.map((diet) => (
                                            <motion.button
                                                key={diet.value}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => updateProfile("dietaryPreference", diet.value)}
                                                className={`p-4 rounded-xl border transition-all text-center ${profile.dietaryPreference === diet.value
                                                        ? "border-[#CCFF00] bg-[#CCFF00]/10"
                                                        : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
                                                    }`}
                                            >
                                                <span className="text-3xl">{diet.emoji}</span>
                                                <p className="font-medium mt-2">{diet.label}</p>
                                            </motion.button>
                                        ))}
                                    </div>
                                )}

                                {/* Step 5: Health Info (Optional) */}
                                {currentStep === 5 && (
                                    <>
                                        <div>
                                            <Label htmlFor="medical">Medical History (Optional)</Label>
                                            <Input
                                                id="medical"
                                                placeholder="e.g., Back pain, diabetes..."
                                                value={profile.medicalHistory || ""}
                                                onChange={(e) => updateProfile("medicalHistory", e.target.value)}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label>Stress Level</Label>
                                            <div className="flex gap-2 mt-2">
                                                {STRESS_LEVELS.map((stress) => (
                                                    <Button
                                                        key={stress.value}
                                                        variant={profile.stressLevel === stress.value ? "default" : "outline"}
                                                        onClick={() => updateProfile("stressLevel", stress.value)}
                                                        className="flex-1"
                                                    >
                                                        <span className={`w-2 h-2 rounded-full ${stress.color} mr-2`} />
                                                        {stress.label}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="sleep">Average Sleep (hours)</Label>
                                            <Input
                                                id="sleep"
                                                type="number"
                                                placeholder="e.g., 7"
                                                value={profile.sleepHours || ""}
                                                onChange={(e) => updateProfile("sleepHours", parseInt(e.target.value) || 0)}
                                                className="mt-1"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex gap-3 mt-8">
                                {currentStep > 0 && (
                                    <Button variant="outline" onClick={handleBack} className="flex-1">
                                        <ChevronLeft size={16} className="mr-1" />
                                        Back
                                    </Button>
                                )}
                                <Button
                                    onClick={handleNext}
                                    disabled={!isStepValid() || isSubmitting}
                                    className="flex-1"
                                >
                                    {isSubmitting ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        >
                                            <Sparkles size={16} />
                                        </motion.div>
                                    ) : currentStep === STEPS.length - 1 ? (
                                        <>
                                            Generate Plan
                                            <Sparkles size={16} className="ml-1" />
                                        </>
                                    ) : (
                                        <>
                                            Next
                                            <ChevronRight size={16} className="ml-1" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </AnimatePresence>

            {/* Step Indicators */}
            <div className="flex gap-2 mt-6 relative z-10">
                {STEPS.map((_, index) => (
                    <motion.div
                        key={index}
                        className={`h-1.5 rounded-full transition-all ${index === currentStep
                                ? "w-8 bg-[#CCFF00]"
                                : index < currentStep
                                    ? "w-3 bg-[#CCFF00]/50"
                                    : "w-3 bg-zinc-700"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
