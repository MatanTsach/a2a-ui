import React, { useState, useCallback } from "react";
import { AppBar } from "@/components/layout/AppBar";
import { HeroSection } from "@/components/layout/HeroSection";
import { TasksTabs } from "@/components/tasks/TasksTabs";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskTree } from "@/components/tasks/TaskTree";
import ChatLayout from "@/components/chat/ChatLayout";
import { useTasksStoreClient } from "@/hooks/useTasksStoreClient";

type ViewMode = "hero" | "chat" | "task-detail";
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
    <div className="h-screen flex flex-col" 
         style={{ 
           backgroundColor: 'hsl(var(--bg))', 
           color: 'hsl(var(--text-1))' 
         }}>
      {/* Global app bar */}
      <AppBar />

      {/* Main content */}
      <main className="flex-1 pt-14 overflow-hidden relative">
        <div 
          className={`absolute inset-0 transition-opacity duration-300 ${viewMode === "hero" ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <div className="h-full overflow-y-auto">
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
          <div className="h-full">
            <div className="max-w-7xl mx-auto h-full">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <button 
                  onClick={handleBackToTasks}
                  className="text-text2 hover:text-text1 transition-colors text-sm"
                >
                  ← Back to Tasks
                </button>
                <div className="text-sm text-text2">Chat Mode</div>
              </div>
              <div className="h-[calc(100%-60px)]">
                <ChatLayout 
                  selectedAgent={orchestratorAgent} 
                  conversation={null}
                  initialMessage={initialMessage}
                />
              </div>
            </div>
          </div>
        </div>

        <div 
          className={`absolute inset-0 transition-opacity duration-300 ${viewMode === "task-detail" ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <div className="h-full flex">
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
      </main>
    </div>
  );
};
