import { UserProfile } from "@/types/plan";

// System prompt for the AI fitness coach
export const SYSTEM_PROMPT = `You are an expert AI Fitness & Nutrition Coach. Your goal is to generate a highly personalized, science-based workout and diet plan in JSON format only.

# Constraints
- Output MUST be valid JSON.
- Do not include any text before or after the JSON block.
- Each exercise must have a clear "name", "sets", "reps", and "rest".
- Each meal must include "name", "calories", and a "macro_split" (protein, carbs, fats).
- All recommendations should be evidence-based and safe.
- Consider the user's fitness level when determining exercise intensity.
- Respect dietary preferences when creating meal plans.

# Expected JSON Structure
{
  "user_summary": "A 2-sentence motivational summary based on the user's specific goals.",
  "daily_motivation": "A short punchy quote for the day.",
  "workout_plan": {
    "title": "Workout Name",
    "duration": "45 mins",
    "exercises": [
      { "name": "Exercise Name", "sets": 3, "reps": "10-12", "rest": "60s", "tip": "AI technique tip" }
    ]
  },
  "diet_plan": {
    "total_calories": 2500,
    "meals": [
      { "label": "Breakfast", "name": "Meal Name", "macros": { "p": "30g", "c": "50g", "f": "15g" } }
    ]
  }
}`;

// Generate the user context prompt based on their profile
export function generateUserPrompt(profile: Partial<UserProfile>): string {
    const parts: string[] = [];

    if (profile.name) {
        parts.push(`Name: ${profile.name}`);
    }

    if (profile.age) {
        parts.push(`Age: ${profile.age} years old`);
    }

    if (profile.gender) {
        parts.push(`Gender: ${profile.gender}`);
    }

    if (profile.height && profile.weight) {
        const heightM = profile.height / 100;
        const bmi = (profile.weight / (heightM * heightM)).toFixed(1);
        parts.push(`Height: ${profile.height}cm, Weight: ${profile.weight}kg (BMI: ${bmi})`);
    }

    if (profile.fitnessGoal) {
        const goalMap: Record<string, string> = {
            weight_loss: "Weight Loss - Focus on calorie deficit and fat burning exercises",
            muscle_gain: "Muscle Gain - Focus on hypertrophy and protein-rich diet",
            maintenance: "Maintenance - Balanced approach to maintain current fitness",
            endurance: "Endurance - Focus on cardiovascular health and stamina",
            flexibility: "Flexibility - Focus on mobility and stretching routines",
        };
        parts.push(`Fitness Goal: ${goalMap[profile.fitnessGoal] || profile.fitnessGoal}`);
    }

    if (profile.fitnessLevel) {
        parts.push(`Fitness Level: ${profile.fitnessLevel} - adjust exercise complexity accordingly`);
    }

    if (profile.workoutLocation) {
        const locationMap: Record<string, string> = {
            home: "Home workouts - Use bodyweight and minimal equipment exercises",
            gym: "Gym workouts - Full access to weights and machines",
            outdoor: "Outdoor workouts - Running, calisthenics, park exercises",
        };
        parts.push(`Workout Location: ${locationMap[profile.workoutLocation] || profile.workoutLocation}`);
    }

    if (profile.dietaryPreference) {
        const dietMap: Record<string, string> = {
            veg: "Vegetarian - No meat, but eggs and dairy are okay",
            non_veg: "Non-Vegetarian - Include all protein sources",
            vegan: "Vegan - Plant-based only, no animal products",
            keto: "Ketogenic - High fat, low carb diet",
        };
        parts.push(`Dietary Preference: ${dietMap[profile.dietaryPreference] || profile.dietaryPreference}`);
    }

    if (profile.medicalHistory) {
        parts.push(`Medical Considerations: ${profile.medicalHistory} - Avoid exercises that may aggravate these conditions`);
    }

    if (profile.stressLevel) {
        parts.push(`Stress Level: ${profile.stressLevel} - ${profile.stressLevel === "high" ? "Include relaxation and recovery exercises" : "Standard intensity is fine"}`);
    }

    if (profile.sleepHours) {
        parts.push(`Average Sleep: ${profile.sleepHours} hours - ${profile.sleepHours < 7 ? "Consider lower intensity due to recovery needs" : "Good recovery potential"}`);
    }

    if (parts.length === 0) {
        return "Create a general fitness plan for a beginner looking to improve overall health with home workouts and a balanced diet.";
    }

    return `Create a personalized fitness plan based on the following user profile:\n\n${parts.join("\n")}\n\nGenerate a complete workout and diet plan optimized for their goals.`;
}

// Format the plan for voice reading
export function formatPlanForVoice(section: "workout" | "diet", planJson: string): string {
    try {
        const plan = JSON.parse(planJson);

        if (section === "workout") {
            const exercises = plan.workout_plan.exercises
                .map((e: { name: string; sets: number; reps: string; rest: string; tip: string }, i: number) =>
                    `Exercise ${i + 1}: ${e.name}. Perform ${e.sets} sets of ${e.reps} repetitions. Rest for ${e.rest}. Pro tip: ${e.tip}`
                )
                .join(". Next, ");

            return `Your workout for today is ${plan.workout_plan.title}. Total duration: ${plan.workout_plan.duration}. Let's begin! ${exercises}. Great job completing your workout!`;
        } else {
            const meals = plan.diet_plan.meals
                .map((m: { label: string; name: string; macros: { p: string; c: string; f: string } }) =>
                    `For ${m.label}, have ${m.name}. This provides ${m.macros.p} of protein, ${m.macros.c} of carbs, and ${m.macros.f} of fats`
                )
                .join(". ");

            return `Your nutrition plan for today totals ${plan.diet_plan.total_calories} calories. ${meals}. Stay hydrated and enjoy your meals!`;
        }
    } catch {
        return "Unable to read the plan. Please generate a new plan first.";
    }
}
