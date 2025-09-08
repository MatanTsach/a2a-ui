import { create } from "zustand";

export type UiEvent =
  | { kind: "task"; taskId: string; contextId: string; state: "started"|"completed"|"canceled"|"failed"; agentName?: string; ts: number }
  | { kind: "status-update"; taskId: string; ts: number; label: string; progress?: number; op?: string; toolCallId?: string }
  | { kind: "artifact-update"; taskId: string; ts: number; name: string; mime?: string; url?: string; op?: string; toolCallId?: string }
  | { kind: "message"; taskId: string; ts: number; role: "user"|"assistant"|"system"; text?: string; op?: string; toolCallId?: string }
  | { kind: "input-required"; taskId: string; ts: number; toolName: string; params: unknown; toolCallId: string };

export type Task = {
  taskId: string;
  contextId: string;
  title: string;           // default "Task {shortId}" – editable later
  state: "started"|"completed"|"canceled"|"failed";
  agentName?: string;
  createdAt: number;
  updatedAt: number;
  events: UiEvent[];
};

type Store = {
  tasks: Record<string, Task>;
  selectedTaskId?: string;
  ingest: (e: UiEvent) => void;
  selectTask: (taskId: string) => void;
  // Derived tree for UI:
  getEventTree: (taskId: string) => TreeNode[];
};

export type TreeNode = {
  id: string;
  label: string;
  kind: "group"|"tool"|"status"|"artifact"|"message"|"input";
  ts: number;
  meta?: Record<string, unknown>;
  children?: TreeNode[];
};

function groupKey(e: UiEvent) {
  // Prefer toolCallId → op → role/kind
  if ("toolCallId" in e && e.toolCallId) return `tool:${e.toolCallId}`;
  if ("op" in e && e.op) return `op:${e.op}`;
  if (e.kind === "message") return `msg:${e.role}`;
  return `kind:${e.kind}`;
}

export const useTasksStore = create<Store>((set, get) => ({
  tasks: {},
  selectedTaskId: undefined,
  selectTask: (taskId) => set({ selectedTaskId: taskId }),

  ingest: (e) => set((s) => {
    if (!("taskId" in e)) return s;
    const t = s.tasks[e.taskId];
    if (!t) {
      const task: Task = {
        taskId: e.taskId,
        contextId: ("contextId" in e ? e.contextId : "") || "",
        title: `Task ${e.taskId.slice(0, 6)}`,
        state: e.kind === "task" ? e.state : "started",
        agentName: ("agentName" in e ? e.agentName : undefined),
        createdAt: e.ts,
        updatedAt: e.ts,
        events: [e],
      };
      return { tasks: { ...s.tasks, [e.taskId]: task } };
    } else {
      const updatedTask = { ...t };
      if (e.kind === "task") updatedTask.state = e.state;
      updatedTask.updatedAt = Math.max(updatedTask.updatedAt, e.ts);
      updatedTask.events = [...updatedTask.events, e];
      return { tasks: { ...s.tasks, [e.taskId]: updatedTask } };
    }
  }),

  getEventTree: (taskId) => {
    const t = get().tasks[taskId];
    if (!t) return [];
    // 1) Group related events under toolCallId/op
    const groups = new Map<string, TreeNode>();
    for (const e of t.events.sort((a,b)=>a.ts-b.ts)) {
      const k = groupKey(e);
      if (!groups.has(k)) {
        const base: TreeNode = {
          id: k,
          kind: k.startsWith("tool:") ? "tool" : k.startsWith("op:") ? "group" : "group",
          label: k.startsWith("tool:") ? "Tool call" : k.startsWith("op:") ? k.slice(3) : k,
          ts: e.ts,
          children: [],
        };
        groups.set(k, base);
      }
      const parent = groups.get(k)!;
      // Leaf
      const id = `${k}:${(e as any).ts}`;
      if (e.kind === "status-update") parent.children!.push({ id, kind:"status", label: e.label, ts:e.ts, meta:{progress:e.progress} });
      else if (e.kind === "artifact-update") parent.children!.push({ id, kind:"artifact", label: e.name, ts:e.ts, meta:{mime:e.mime,url:e.url} });
      else if (e.kind === "message") parent.children!.push({ id, kind:"message", label: e.role, ts:e.ts, meta:{text:e.text} });
      else if (e.kind === "input-required") parent.children!.push({ id, kind:"input", label: `Input required: ${e.toolName}`, ts:e.ts, meta:{params:e.params} });
      else if (e.kind === "task") parent.children!.push({ id, kind:"status", label:`Task ${e.state}`, ts:e.ts });
    }
    // 2) To array sorted by first ts
    return [...groups.values()].sort((a,b)=>a.ts-b.ts);
  },
}));
