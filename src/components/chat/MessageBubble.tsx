"use client";

import React from "react";
import { Markdown } from "@/lib/markdown";
import { Part, Artifact } from "@/a2a/schema";
import { cn } from "@/lib/utils";
import { User, Bot } from "lucide-react";

type Role = "user" | "assistant" | "system";

export const MessageBubble: React.FC<{
  role: Role;
  parts: Part[];
  status?: string | undefined;
  artifacts?: Artifact[] | undefined;
  createdAt: string;
}> = ({ role, parts, artifacts, createdAt }) => {
  const isTextPart = (p: Part): p is Extract<Part, { kind: "text" }> => p.kind === "text";
  const text = parts.filter(isTextPart).map((p) => p.text).join("");

  return (
    <div className={cn("w-full group flex gap-3", role === "user" ? "justify-end" : "justify-start")}
      role="article"
      aria-label={role === "user" ? "User message" : role === "assistant" ? "Assistant message" : "System message"}
    >
      {/* Avatar for assistant */}
      {role === "assistant" && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-surface2 border border-border ring-1 ring-border flex items-center justify-center">
          <Bot className="w-4 h-4 text-text2" />
        </div>
      )}
      
      <div className={cn("flex-1", role === "user" ? "max-w-[70%] flex justify-end" : "max-w-[85%]")}>
        <div
          className={cn(
            "relative rounded-2xl border shadow-soft transition-shadow duration-200 ease-calm animate-fadeIn",
            role === "user"
              ? "bg-surface2 border-border/70 p-4 sm:p-5 max-w-md"
              : "bg-surface1 border-border hover:shadow-float p-4 sm:p-5 prose dark:prose-invert"
          )}
        >
          <div className={cn(role === "assistant" && "prose prose-sm max-w-none dark:prose-invert")}
          >
            <Markdown>{text}</Markdown>
          </div>
          
          {/* Timestamp on hover */}
          <div className="text-[11px] text-text2/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-calm absolute -top-5 right-0">
            {new Date(createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
      </div>
      
      {/* Avatar for user */}
      {role === "user" && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-accent border border-border ring-1 ring-border flex items-center justify-center">
          <User className="w-4 h-4 text-black" />
        </div>
      )}
    </div>
  );
};


