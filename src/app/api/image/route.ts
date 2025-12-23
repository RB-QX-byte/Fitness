import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
    try {
        const { prompt, type } = await request.json();

        if (!prompt) {
            return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
        }

        // Enhanced prompt based on type
        const enhancedPrompt =
            type === "exercise"
                ? `Generate a professional fitness photograph of someone performing ${prompt} exercise in a modern gym setting. Dynamic pose, athletic lighting, high quality, realistic.`
                : `Generate a beautiful food photography shot of ${prompt}. Professional lighting, appetizing presentation, top-down or 45-degree angle, restaurant quality, high resolution.`;

        // Use dedicated image API key (separate Gemini account for image generation)
        const apiKey = process.env.GEMINI_IMAGE_API_KEY;

        if (!apiKey) {
            return NextResponse.json({
                imageUrl: null,
                placeholder: true,
                message: "No GEMINI_IMAGE_API_KEY configured. Add it to .env.local for image generation.",
            });
        }

        try {
            const ai = new GoogleGenAI({ apiKey });

            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash-exp-image-generation",
                contents: enhancedPrompt,
                config: {
                    responseModalities: ["TEXT", "IMAGE"],
                },
            });

            // Check for image in response
            if (response.candidates && response.candidates.length > 0) {
                const parts = response.candidates[0].content?.parts || [];

                for (const part of parts) {
                    if (part.inlineData) {
                        const imageData = part.inlineData.data;
                        const mimeType = part.inlineData.mimeType || "image/png";
                        const imageUrl = `data:${mimeType};base64,${imageData}`;
                        return NextResponse.json({ imageUrl });
                    }
                }
            }

            // If no image was generated
            return NextResponse.json({
                imageUrl: null,
                placeholder: true,
                message: "Image generation is not available for this request.",
            });

        } catch (error: unknown) {
            console.error("Gemini Image generation error:", error);

            const errorMessage = error instanceof Error ? error.message : String(error);

            // Check for quota error
            if (errorMessage.includes("RESOURCE_EXHAUSTED") || errorMessage.includes("quota")) {
                return NextResponse.json({
                    imageUrl: null,
                    placeholder: true,
                    message: "API quota exceeded. Please wait a moment and try again.",
                });
            }

            return NextResponse.json({
                imageUrl: null,
                placeholder: true,
                message: "Image generation temporarily unavailable.",
            });
        }

    } catch (error) {
        console.error("Image API error:", error);
        return NextResponse.json(
            { error: "Image generation failed" },
            { status: 500 }
        );
    }
}
