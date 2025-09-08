import React from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface AppBarProps {
  onSettingsClick?: () => void;
  onDocsClick?: () => void;
}

export const AppBar: React.FC<AppBarProps> = ({ onSettingsClick, onDocsClick }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b flex items-center justify-between px-6" 
            style={{ 
              backgroundColor: 'hsl(var(--bg))', 
              borderColor: 'hsl(var(--border))'
            }}>
      {/* Left: Logo + wordmark */}
      <div className="flex items-center space-x-3">
        <div className="w-6 h-6 rounded-md flex items-center justify-center" 
             style={{ backgroundColor: 'hsl(var(--accent-2))' }}>
          <span className="text-xs font-bold text-white">A2A</span>
        </div>
        <span className="text-lg font-semibold" style={{ color: 'hsl(var(--text-1))' }}>
          A2A UI
        </span>
      </div>

      {/* Right: Settings, Docs links */}
      <div className="flex items-center space-x-6">
        <button 
          className="text-sm font-medium transition-colors hover:opacity-80 cursor-pointer"
          style={{ color: 'hsl(var(--text-2))' }}
          onClick={onSettingsClick}
        >
          Settings
        </button>
        <button 
          className="text-sm font-medium transition-colors hover:opacity-80 cursor-pointer"
          style={{ color: 'hsl(var(--text-2))' }}
          onClick={onDocsClick}
        >
          Docs
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
};
