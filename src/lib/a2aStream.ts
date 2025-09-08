import { A2AClient } from "@/a2a/client";
import {
  TaskSendParams,
  TaskStatusUpdateEvent,
  TaskArtifactUpdateEvent,
  Message,
  Part,
} from "@/a2a/schema";
import { UiEvent } from "@/state/chatStore";
import { useTasksStore } from "@/state/tasksStore";

export type StreamOptions = {
  agentUrl: string;
  contextId?: string;
};

// Helper function to map A2A events to task events
function handleA2AStreamEvent(ev: any, taskId: string, contextId: string) {
  const now = Date.now();
  
  // Only try to access the store on the client side
  if (typeof window === 'undefined') return;
  
  const tasksStore = useTasksStore.getState();
  
  if (ev.status) {
    // Status update event
    if (ev.status.message) {
      tasksStore.ingest({ 
        kind: "message", 
        taskId, 
        ts: now, 
        role: ev.status.message.role === "user" ? "user" : "assistant", 
        text: ev.status.message.parts?.filter((p: any) => p.kind === "text").map((p: any) => p.text).join("") || "", 
        op: ev.status.message.metadata?.op, 
        toolCallId: ev.status.message.metadata?.toolCallId 
      });
    }
    
    tasksStore.ingest({ 
      kind: "status-update", 
      taskId, 
      ts: now, 
      label: ev.status.state || "Working…", 
      progress: ev.status.progress, 
      op: ev.status.op, 
      toolCallId: ev.status.toolCallId 
    });
    
    if (ev.final) {
      tasksStore.ingest({ 
        kind: "task", 
        taskId, 
        contextId, 
        state: ev.status.state === "failed" ? "failed" : ev.status.state === "canceled" ? "canceled" : "completed", 
        ts: now 
      });
    }
  } else if (ev.artifact) {
    // Artifact update event
    tasksStore.ingest({ 
      kind: "artifact-update", 
      taskId, 
      ts: now, 
      name: ev.artifact.name || ev.artifact.artifactId || "artifact", 
      mime: ev.artifact.mime, 
      url: ev.artifact.url, 
      op: ev.artifact.op, 
      toolCallId: ev.artifact.toolCallId 
    });
  }
}

export function createEventNormalizer(options: StreamOptions) {
  const client = new A2AClient(options.agentUrl, window.fetch.bind(window));

  async function* normalize(
    params: TaskSendParams
  ): AsyncIterable<UiEvent> {
    // Initialize task in tasks store (client-side only)
    if (typeof window !== 'undefined') {
      const tasksStore = useTasksStore.getState();
      tasksStore.ingest({ 
        kind: "task", 
        taskId: params.id, 
        contextId: params.message.contextId || "", 
        state: "started", 
        ts: Date.now() 
      });
    }

    for await (const evt of client.sendTaskSubscribe(params)) {
      // Handle task events
      handleA2AStreamEvent(evt, params.id, params.message.contextId || "");
      
      // Continue with existing chat event handling
      if ((evt as TaskStatusUpdateEvent).status) {
        const statusEvt = evt as TaskStatusUpdateEvent;
        const status = statusEvt.status;

        if (status.message) {
          yield {
            kind: "message",
            role: status.message.role === "user" ? "user" : "assistant",
            parts: status.message.parts,
            metadata: status.message.metadata,
          } satisfies UiEvent;
        }

        yield {
          kind: "status-update",
          status: {
            state: status.state,
            label: status.message ? undefined : undefined,
          },
        } satisfies UiEvent;

        if (statusEvt.final) {
          yield {
            kind: "task",
            taskId: params.id,
            contextId: params.message.contextId || "",
            state: status.state === "failed" ? "failed" : status.state === "canceled" ? "canceled" : "completed",
          } satisfies UiEvent;
        }
      } else if ((evt as TaskArtifactUpdateEvent).artifact) {
        const aEvt = evt as TaskArtifactUpdateEvent;
        yield {
          kind: "artifact-update",
          artifact: {
            id: aEvt.artifact.artifactId,
            name: aEvt.artifact.name || aEvt.artifact.artifactId,
          },
        } satisfies UiEvent;
      }
    }
  }

  return { normalize };
}


