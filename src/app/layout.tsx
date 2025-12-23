import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-sans",
});

export const metadata: Metadata = {
    title: "AI.COACH - Your Personal AI Fitness Assistant",
    description:
        "Get personalized workout and diet plans powered by AI. Transform your fitness journey with intelligent coaching.",
    keywords: ["fitness", "AI", "workout", "diet", "health", "coach", "personal trainer"],
    authors: [{ name: "AI.COACH" }],
    icons: {
        icon: "/icon.svg",
    },
    openGraph: {
        title: "AI.COACH - Your Personal AI Fitness Assistant",
        description: "Transform your fitness journey with AI-powered personalized plans",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={inter.variable} suppressHydrationWarning>
            <body className="antialiased" suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}
