import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { text, section } = await request.json();

        if (!text) {
            return NextResponse.json({ error: "No text provided" }, { status: 400 });
        }

        // Try ElevenLabs API first
        const elevenLabsKey = process.env.ELEVENLABS_API_KEY;

        if (elevenLabsKey) {
            try {
                const voiceId = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM"; // Default to Rachel

                const response = await fetch(
                    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "xi-api-key": elevenLabsKey,
                        },
                        body: JSON.stringify({
                            text: text.slice(0, 5000), // ElevenLabs has a character limit
                            model_id: "eleven_monolingual_v1",
                            voice_settings: {
                                stability: 0.5,
                                similarity_boost: 0.75,
                            },
                        }),
                    }
                );

                if (response.ok) {
                    const audioBuffer = await response.arrayBuffer();
                    return new NextResponse(audioBuffer, {
                        headers: {
                            "Content-Type": "audio/mpeg",
                            "Content-Length": audioBuffer.byteLength.toString(),
                        },
                    });
                }

                console.error("ElevenLabs API error:", response.status);
            } catch (error) {
                console.error("ElevenLabs error:", error);
            }
        }

        // Try OpenAI TTS as fallback
        const openaiKey = process.env.OPENAI_API_KEY;

        if (openaiKey) {
            try {
                const response = await fetch("https://api.openai.com/v1/audio/speech", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${openaiKey}`,
                    },
                    body: JSON.stringify({
                        model: "tts-1",
                        input: text.slice(0, 4096),
                        voice: "alloy",
                        response_format: "mp3",
                    }),
                });

                if (response.ok) {
                    const audioBuffer = await response.arrayBuffer();
                    return new NextResponse(audioBuffer, {
                        headers: {
                            "Content-Type": "audio/mpeg",
                            "Content-Length": audioBuffer.byteLength.toString(),
                        },
                    });
                }

                console.error("OpenAI TTS error:", response.status);
            } catch (error) {
                console.error("OpenAI TTS error:", error);
            }
        }

        // If no API is available, return a message for the client to use browser TTS
        return NextResponse.json(
            {
                error: "No TTS API available",
                fallback: "browser",
                text: text
            },
            { status: 503 }
        );
    } catch (error) {
        console.error("Voice API error:", error);
        return NextResponse.json(
            { error: "Voice generation failed" },
            { status: 500 }
        );
    }
}
