import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT, generateUserPrompt } from "@/lib/prompts";

export async function POST(request: NextRequest) {
    try {
        const userProfile = await request.json();
        const userPrompt = generateUserPrompt(userProfile);

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: "No Gemini API key configured. Please add GEMINI_API_KEY to .env.local" },
                { status: 503 }
            );
        }

        try {
            const ai = new GoogleGenAI({ apiKey });

            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: SYSTEM_PROMPT + "\n\n" + userPrompt,
                config: {
                    responseMimeType: "application/json",
                    temperature: 0.7,
                },
            });

            const text = response.text;

            if (!text) {
                throw new Error("Gemini returned empty response");
            }

            const planData = JSON.parse(text);
            return NextResponse.json(planData);

        } catch (error: unknown) {
            console.error("Gemini API error:", error);

            // Check for quota exceeded error
            const errorMessage = error instanceof Error ? error.message : String(error);

            if (errorMessage.includes("RESOURCE_EXHAUSTED") || errorMessage.includes("quota")) {
                return NextResponse.json(
                    {
                        error: "API quota exceeded. The free tier limit has been reached. Please wait a minute and try again, or upgrade to a paid API plan.",
                        retryAfter: 60
                    },
                    { status: 429 }
                );
            }

            return NextResponse.json(
                { error: `Gemini API failed: ${errorMessage}` },
                { status: 503 }
            );
        }

    } catch (error) {
        console.error("Generate API error:", error);
        return NextResponse.json(
            { error: "Failed to generate plan. Please try again." },
            { status: 500 }
        );
    }
}
