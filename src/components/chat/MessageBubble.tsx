"use client";

import React from "react";
import { Markdown } from "@/lib/markdown";
import { Part, Artifact } from "@/a2a/schema";
import { cn } from "@/lib/utils";

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
    <div className={cn("w-full group", role === "user" ? "flex justify-end" : "flex justify-start")}
      role="article"
      aria-label={role === "user" ? "User message" : role === "assistant" ? "Assistant message" : "System message"}
    >
      <div
        className={cn(
          "relative max-w-chat rounded-2xl border shadow-soft transition-shadow duration-200 ease-calm animate-fadeIn",
          role === "user"
            ? "ml-auto bg-surface2 border-border/70 p-5"
            : "bg-surface1 border-border hover:shadow-float p-5 prose dark:prose-invert"
        )}
      >
        <div className={cn("prose max-w-none", "dark:prose-invert")}
        >
          <Markdown>{text}</Markdown>
        </div>
        <div className="text-[11px] text-text2/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-calm absolute top-3 right-4">
          {new Date(createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  );
};


