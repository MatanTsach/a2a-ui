"use client";

import React, { createContext, useCallback, useContext, useMemo, useReducer } from "react";
import { Artifact, Part } from "@/a2a/schema";

const isTextPart = (p: Part): p is Extract<Part, { kind: "text" }> => p.kind === "text";

export type UiEvent =
  | { kind: "message"; role: "assistant" | "user" | "system"; parts: Part[]; metadata?: unknown }
  | { kind: "status-update"; status: { state: string; progress?: number; label?: string } }
  | { kind: "artifact-update"; artifact: { id: string; name: string; url?: string; mime?: string } }
  | { kind: "input-required"; tool: { name: string; params: unknown; requiresConfirmation: boolean } }
  | { kind: "task"; taskId: string; contextId: string; state: "started" | "completed" | "canceled" | "failed" };

export type ChatMessage = {
  id: string;
  role: "assistant" | "user" | "system";
  parts: Part[];
  text?: string;
  artifacts?: Artifact[];
  metadata?: unknown;
  createdAt: string; // ISO string
};

export type StatusChip = { id: string; state: string; label?: string; progress?: number; active: boolean };

export type ChatState = {
  messages: ChatMessage[];
  statuses: StatusChip[];
  artifacts: Record<string, { id: string; name: string; url?: string; mime?: string }>
  pendingTool?: { name: string; params: unknown; requiresConfirmation: boolean } | null;
  currentTask?: { taskId: string; contextId: string; state: "started" | "completed" | "canceled" | "failed" } | null;
};

const initialState: ChatState = {
  messages: [],
  statuses: [],
  artifacts: {},
  pendingTool: null,
  currentTask: null,
};

type Action =
  | { type: "append_message"; message: ChatMessage }
  | { type: "append_assistant_delta"; text: string }
  | { type: "push_status"; chip: StatusChip }
  | { type: "complete_status"; id: string }
  | { type: "upsert_artifact"; artifact: { id: string; name: string; url?: string; mime?: string } }
  | { type: "set_pending_tool"; tool: ChatState["pendingTool"] }
  | { type: "set_task"; task: ChatState["currentTask"] };

function reducer(state: ChatState, action: Action): ChatState {
  switch (action.type) {
    case "append_message": {
      return { ...state, messages: [...state.messages, action.message] };
    }
    case "append_assistant_delta": {
      const last = state.messages[state.messages.length - 1];
      if (!last || last.role !== "assistant") return state;
      const updated: ChatMessage = {
        ...last,
        text: (last.text || "") + action.text,
      };
      return { ...state, messages: [...state.messages.slice(0, -1), updated] };
    }
    case "push_status": {
      const existingIndex = state.statuses.findIndex((s) => s.id === action.chip.id);
      const statuses = state.statuses.slice();
      if (existingIndex >= 0) statuses[existingIndex] = action.chip; else statuses.push(action.chip);
      return { ...state, statuses };
    }
    case "complete_status": {
      const statuses = state.statuses.map((s) => (s.id === action.id ? { ...s, active: false } : s));
      return { ...state, statuses };
    }
    case "upsert_artifact": {
      return { ...state, artifacts: { ...state.artifacts, [action.artifact.id]: action.artifact } };
    }
    case "set_pending_tool": {
      return { ...state, pendingTool: action.tool };
    }
    case "set_task": {
      return { ...state, currentTask: action.task };
    }
    default:
      return state;
  }
}

type ChatContextValue = {
  state: ChatState;
  dispatch: React.Dispatch<Action>;
  handleEvent: (event: UiEvent) => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleEvent = useCallback((event: UiEvent) => {
    switch (event.kind) {
      case "message": {
        dispatch({
          type: "append_message",
          message: {
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            role: event.role,
            parts: event.parts,
            text: event.parts.filter(isTextPart).map((p) => p.text).join(""),
            metadata: event.metadata,
            createdAt: new Date().toISOString(),
          },
        });
        break;
      }
      case "status-update": {
        const id = event.status.state;
        dispatch({
          type: "push_status",
          chip: { id, state: event.status.state, label: event.status.label, progress: event.status.progress, active: true },
        });
        break;
      }
      case "artifact-update": {
        dispatch({ type: "upsert_artifact", artifact: event.artifact });
        break;
      }
      case "input-required": {
        dispatch({ type: "set_pending_tool", tool: event.tool });
        break;
      }
      case "task": {
        dispatch({ type: "set_task", task: { taskId: event.taskId, contextId: event.contextId, state: event.state } });
        if (event.state === "completed" || event.state === "failed" || event.state === "canceled") {
          dispatch({ type: "complete_status", id: "working" });
        }
        break;
      }
      default:
        break;
    }
  }, []);

  const value = useMemo(() => ({ state, dispatch, handleEvent }), [state, dispatch, handleEvent]);
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export function useChatStore() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatStore must be used within ChatProvider");
  return ctx;
}


