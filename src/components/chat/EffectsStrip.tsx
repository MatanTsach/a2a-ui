"use client";

import React from "react";
import { useChatStore } from "@/state/chatStore";

export const EffectsStrip: React.FC = () => {
  const { state } = useChatStore();
  return (
    <div className="mx-auto max-w-chat px-6 py-2">
      <div className="flex flex-wrap gap-2">
        {state.statuses.filter((s) => s.active).map((s) => {
          const isCompleted = s.state === 'completed' || s.state === 'success';
          const isWorking = s.state === 'working' || s.state === 'running';
          
          return (
            <span
              key={s.id}
              className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full animate-fadeIn ${
                isCompleted 
                  ? 'bg-accent2/20 text-accent2 border border-accent2/35' 
                  : 'bg-muted/60 text-text2 border border-border'
              }`}
            >
              {isWorking ? (
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-accent/70 border-l-transparent" aria-hidden />
              ) : isCompleted ? (
                <span className="h-3 w-3 rounded-full bg-accent2" aria-hidden />
              ) : null}
              {s.label || s.state}
            </span>
          );
        })}
      </div>
    </div>
  );
};


