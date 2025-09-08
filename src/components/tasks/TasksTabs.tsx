import React from "react";
import { cn } from "@/lib/utils";

type TabType = "tasks" | "archive";

interface TasksTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const TasksTabs: React.FC<TasksTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="border-b mb-6" style={{ borderColor: 'hsl(var(--border))' }}>
      <div className="flex space-x-8">
        <button
          onClick={() => onTabChange("tasks")}
          className="pb-3 px-1 font-medium transition-colors relative"
          style={{ 
            color: activeTab === "tasks" ? 'hsl(var(--text-1))' : 'hsl(var(--text-2))',
            fontSize: '14px' // sm from type scale
          }}
        >
          Tasks
          {activeTab === "tasks" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5" 
                 style={{ backgroundColor: 'hsl(var(--accent-2))' }} />
          )}
        </button>
        <button
          onClick={() => onTabChange("archive")}
          className="pb-3 px-1 font-medium transition-colors relative"
          style={{ 
            color: activeTab === "archive" ? 'hsl(var(--text-1))' : 'hsl(var(--text-2))',
            fontSize: '14px' // sm from type scale
          }}
        >
          Archive
          {activeTab === "archive" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5" 
                 style={{ backgroundColor: 'hsl(var(--accent-2))' }} />
          )}
        </button>
      </div>
    </div>
  );
};
