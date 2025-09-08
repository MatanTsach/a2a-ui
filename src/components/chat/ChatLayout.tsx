"use client";

import React from "react";
import { useChatStore, ChatProvider } from "@/state/chatStore";
import { Composer } from "@/components/chat/Composer";
import { EffectsStrip } from "@/components/chat/EffectsStrip";
import { AgentCard } from "@/a2a/schema";
import { StateConversation } from "@/a2a/state";
import { InlineToolBar } from "@/components/chat/InlineToolBar";
import { MessageBubble } from "@/components/chat/MessageBubble";

type Props = {
  selectedAgent?: AgentCard | null;
  conversation?: StateConversation | null;
  initialMessage?: string;
};

export const ChatLayoutShell: React.FC<Props> = ({ selectedAgent, conversation, initialMessage }) => {
  return (
    <ChatProvider>
      <ChatLayout selectedAgent={selectedAgent} conversation={conversation} initialMessage={initialMessage} />
    </ChatProvider>
  );
};

const TopBar: React.FC = () => {
  return (
    <div className="sticky top-0 z-10 backdrop-blur bg-surface1/60 border-b border-border border-t-2 border-t-accent/60">
      <div className="mx-auto max-w-chat px-6 py-3">
        <div className="flex items-center justify-between">
          <input
            aria-label="Conversation title"
            className="bg-transparent ui-h2 outline-none text-text1 placeholder:text-text2/70"
            defaultValue="New chat"
          />
          <div className="text-xs text-text2">0 tokens • 0.0s</div>
        </div>
      </div>
    </div>
  );
};


const ChatLayout: React.FC<Props> = ({ selectedAgent, conversation, initialMessage }) => {
  const { state, dispatch } = useChatStore();
  const contextId = conversation?.context_id;
  
  // Send initial message if provided
  React.useEffect(() => {
    if (initialMessage && state.messages.length === 0) {
      // Add the initial message as a user message
      dispatch({
        type: "append_message",
        message: {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          role: "user",
          parts: [{ kind: "text", text: initialMessage }],
          text: initialMessage,
          createdAt: new Date().toISOString(),
        },
      });
    }
  }, [initialMessage, dispatch, state.messages.length]);
  
  return (
    <div className="h-full flex flex-col">
      <TopBar />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-chat px-6 py-4">
          <div className="space-y-4">
            {state.messages.map((m) => (
              <MessageBubble key={m.id} role={m.role} parts={m.parts} status={undefined} artifacts={m.artifacts} createdAt={m.createdAt} />
            ))}
          </div>
        </div>
      </div>
      {state.pendingTool?.requiresConfirmation && (
        <div className="mx-auto max-w-chat w-full px-6">
          <InlineToolBar
            tool={state.pendingTool}
            onRun={() => {
              dispatch({ type: "set_pending_tool", tool: null });
              dispatch({ type: "push_status", chip: { id: "working", state: "working", label: "Running…", active: true } });
            }}
            onCancel={() => {
              dispatch({ type: "set_pending_tool", tool: null });
              dispatch({ type: "push_status", chip: { id: "canceled", state: "canceled", label: "Canceled", active: false } });
            }}
          />
        </div>
      )}
      <EffectsStrip />
      <Composer agentUrl={selectedAgent?.url} contextId={contextId} streaming={!!selectedAgent?.capabilities?.streaming} initialMessage={initialMessage} />
    </div>
  );
};

export default ChatLayoutShell;


