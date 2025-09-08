import React from "react";
import { CodexLayout } from "@/components/CodexLayout";
import ClientOnly from "@/components/ClientOnly";
import { useHostState } from "@/a2a/state/host/hostStateContext";
import { useAppState as useAppContext } from "@/a2a/state/app/appStateContext";

export const App: React.FC = () => {
    const { isLoaded: hostStateLoaded } = useHostState();
    const { isLoaded: appStateLoaded } = useAppContext();

    // Show loading state until all data is loaded
    if (!hostStateLoaded || !appStateLoaded) {
        return (
            <div className="h-screen flex items-center justify-center bg-bg">
                <div className="text-center">
                    <div className="text-text1 text-lg mb-2">Loading A2A UI...</div>
                    <div className="text-text2 text-sm">Please wait while we load your data</div>
                </div>
            </div>
        );
    }

    return (
        <ClientOnly fallback={
            <div className="h-screen flex items-center justify-center bg-bg">
                <div className="text-center">
                    <div className="text-text1 text-lg mb-2">Loading UI...</div>
                </div>
            </div>
        }>
            <CodexLayout />
        </ClientOnly>
    );
}; 