import React, { useState, useCallback } from "react";
import { AppBar } from "@/components/layout/AppBar";
import { HeroSection } from "@/components/layout/HeroSection";
import { TasksTabs } from "@/components/tasks/TasksTabs";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskTree } from "@/components/tasks/TaskTree";
import ChatLayout from "@/components/chat/ChatLayout";
import { useTasksStoreClient } from "@/hooks/useTasksStoreClient";
import SettingsPage from "@/app/pages/SettingsPage";

type ViewMode = "hero" | "chat" | "task-detail" | "settings";
type TabType = "tasks" | "archive";

export const CodexLayout: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("hero");
  const [activeTab, setActiveTab] = useState<TabType>("tasks");
  const [selectedTaskId, setSelectedTaskId] = useState<string>();
  const [initialMessage, setInitialMessage] = useState<string>("");
  const { selectTask } = useTasksStoreClient();
  
  // Create orchestrator agent configuration
  const orchestratorAgent = {
    name: "Orchestrator",
    url: process.env.NEXT_PUBLIC_ORCHESTRATOR_URL || "http://localhost:8080",
    version: "1.0.0",
    capabilities: {
      streaming: true,
      messageHistory: true,
      contextRetention: true,
      multiTurn: true
    },
    skills: []
  };
  
  const handleStartChat = useCallback(async (message: string) => {
    setInitialMessage(message);
    setViewMode("chat");
  }, []);

  const handleTaskSelect = (taskId: string) => {
    setSelectedTaskId(taskId);
    selectTask(taskId);
    setViewMode("task-detail");
  };

  const handleBackToTasks = () => {
    setViewMode("hero");
    setSelectedTaskId(undefined);
  };

  return (
    <div className="h-screen" 
         style={{ 
           backgroundColor: 'hsl(var(--bg))', 
           color: 'hsl(var(--text-1))' 
         }}>
      {/* Global app bar */}
      <AppBar 
        onSettingsClick={() => setViewMode("settings")}
        onDocsClick={() => window.open('https://docs.a2a-ui.dev', '_blank')} // TODO: Update with actual docs URL
      />

      {/* Main content */}
      <main className="h-full overflow-hidden relative" style={{ marginTop: '56px' }}>
        <div 
          className={`absolute inset-0 transition-opacity duration-300 ${viewMode === "hero" ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <div className="h-full overflow-y-auto pt-6">
            {/* Hero section */}
            <HeroSection 
              onStartChat={handleStartChat} 
              isInChatMode={false}
            />

            {/* Tasks section */}
            <section className="max-w-7xl mx-auto px-6 pb-12">
              <TasksTabs 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
              />
              <TaskList onTaskSelect={handleTaskSelect} />
            </section>
          </div>
        </div>

        <div 
          className={`absolute inset-0 transition-opacity duration-300 ${viewMode === "chat" ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border bg-bg">
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleBackToTasks}
                  className="text-text2 hover:text-text1 transition-colors text-sm flex items-center gap-1"
                >
                  ← Back to Tasks
                </button>
                <h2 className="ui-h3 text-text1">New chat</h2>
              </div>
              <div className="text-xs text-text2">0 tokens • 0.0s</div>
            </div>
            <div className="flex-1 overflow-hidden">
              <ChatLayout 
                selectedAgent={orchestratorAgent} 
                conversation={null}
                initialMessage={initialMessage}
              />
            </div>
          </div>
        </div>

        <div 
          className={`absolute inset-0 transition-opacity duration-300 ${viewMode === "task-detail" ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <div className="h-full flex pt-6">
            {/* Left: Task list (sidebar) */}
            <div className="w-96 border-r border-border bg-surface1/50 overflow-y-auto">
              <div className="p-4 border-b border-border">
                <button 
                  onClick={handleBackToTasks}
                  className="text-text2 hover:text-text1 transition-colors text-sm mb-4"
                >
                  ← Back
                </button>
                <TasksTabs 
                  activeTab={activeTab} 
                  onTabChange={setActiveTab} 
                />
              </div>
              <TaskList onTaskSelect={handleTaskSelect} />
            </div>

            {/* Right: Task detail tree */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full p-6">
                <TaskTree taskId={selectedTaskId} />
              </div>
            </div>
          </div>
        </div>

        <div 
          className={`absolute inset-0 transition-opacity duration-300 ${viewMode === "settings" ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <div className="h-full overflow-y-auto">
            <div className="max-w-4xl mx-auto p-8 pt-6">
              <div className="flex items-center justify-between mb-6">
                <button 
                  onClick={() => setViewMode("hero")}
                  className="text-text2 hover:text-text1 transition-colors text-sm flex items-center gap-1"
                >
                  ← Back to Home
                </button>
              </div>
              <h1 className="ui-h1 text-text1 mb-2">Settings</h1>
              <p className="text-text2 mb-8">Configure application settings and preferences. Settings are automatically saved to your browser.</p>
              <SettingsPage />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
