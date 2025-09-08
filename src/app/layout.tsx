import type {Metadata} from "next";
import {Geist, JetBrains_Mono} from "next/font/google";
import "./globals.css";
import "@/styles/tokens.css";
import React from "react";
import {AgentStateProvider} from "@/a2a/state/agent/agentStateContext";
import {Providers} from "@/app/providers";
import {ErrorBoundary} from "@/components/common/ErrorBoundary";
import {ENV} from "@/lib/env";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
    variable: "--font-jetbrains-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "A2A UI - Agent-to-Agent Platform",
    description: "Modern UI for Google A2A (Agent-to-Agent) platform with real-time chat, tracing, and advanced features",
    keywords: ["a2a", "agent-to-agent", "google", "ai", "chat", "tracing"],
    authors: [{ name: "A2A Team" }],
};

export const viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${jetBrainsMono.variable} font-sans antialiased h-screen bg-bg text-text1`} suppressHydrationWarning>
        {/* Wrap your entire app with AgentStateProvider */}
        <ErrorBoundary>
            <Providers>
                <div className="h-full w-full">
                    {children}
                </div>
            </Providers>
        </ErrorBoundary>
        </body>
        </html>
    );
}
