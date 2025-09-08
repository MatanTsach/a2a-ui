"use client";

import React, { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, Square } from "lucide-react";
import { useChatStore } from "@/state/chatStore";
import { v4 as uuidv4 } from "uuid";
import { A2AClient } from "@/a2a/client";
import { Message, TaskSendParams } from "@/a2a/schema";
import { createEventNormalizer } from "@/lib/a2aStream";

type Props = { agentUrl?: string; contextId?: string; streaming?: boolean; initialMessage?: string };

export const Composer: React.FC<Props> = ({ agentUrl, contextId, streaming = true, initialMessage }) => {
  const [value, setValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasAutoSent, setHasAutoSent] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  const { handleEvent } = useChatStore();

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  }, [agentUrl, value, contextId, streaming]);

  const send = useCallback(async () => {
    const content = value.trim();
    if (!content || !agentUrl) return;
    setValue("");
    handleEvent({ kind: "message", role: "user", parts: [{ kind: "text", text: content }] as any });

    if (!streaming) {
      const client = new A2AClient(agentUrl, window.fetch.bind(window));
      const msg: Message = { messageId: uuidv4(), role: "user", parts: [{ kind: "text", text: content }], kind: "message", ...(contextId ? { contextId } : {}) };
      const res = await client.sendMessage({ message: msg, configuration: { acceptedOutputModes: ["text"], blocking: true } });
      if (res?.parts) {
        handleEvent({ kind: "message", role: "assistant", parts: res.parts });
      }
      return;
    }

    setIsStreaming(true);
    try {
      const taskId = uuidv4();
      const msg: Message = { messageId: uuidv4(), role: "user", parts: [{ kind: "text", text: content }], kind: "message", ...(contextId ? { contextId } : {}) };
      const sendParams: TaskSendParams = { id: taskId, message: msg };
      const normalizer = createEventNormalizer({ agentUrl, contextId });
      for await (const evt of normalizer.normalize(sendParams)) {
        handleEvent(evt);
      }
    } catch (e) {
      handleEvent({ kind: "status-update", status: { state: "failed", label: (e as Error)?.message || "Stream error" } });
    } finally {
      setIsStreaming(false);
    }
  }, [agentUrl, value, contextId, streaming, handleEvent]);
  
  // Auto-send initial message when component mounts
  React.useEffect(() => {
    if (initialMessage && !hasAutoSent && agentUrl) {
      setHasAutoSent(true);
      // Small delay to ensure the UI has rendered
      setTimeout(async () => {
        const content = initialMessage.trim();
        if (!content) return;
        
        if (!streaming) {
          const client = new A2AClient(agentUrl, window.fetch.bind(window));
          const msg: Message = { messageId: uuidv4(), role: "user", parts: [{ kind: "text", text: content }], kind: "message", ...(contextId ? { contextId } : {}) };
          const res = await client.sendMessage({ message: msg, configuration: { acceptedOutputModes: ["text"], blocking: true } });
          if (res?.parts) {
            handleEvent({ kind: "message", role: "assistant", parts: res.parts });
          }
          return;
        }

        setIsStreaming(true);
        try {
          const taskId = uuidv4();
          const msg: Message = { messageId: uuidv4(), role: "user", parts: [{ kind: "text", text: content }], kind: "message", ...(contextId ? { contextId } : {}) };
          const sendParams: TaskSendParams = { id: taskId, message: msg };
          const normalizer = createEventNormalizer({ agentUrl, contextId });
          for await (const evt of normalizer.normalize(sendParams)) {
            handleEvent(evt);
          }
        } catch (e) {
          handleEvent({ kind: "status-update", status: { state: "failed", label: (e as Error)?.message || "Stream error" } });
        } finally {
          setIsStreaming(false);
        }
      }, 100);
    }
  }, [initialMessage, hasAutoSent, agentUrl, contextId, streaming, handleEvent]);

  return (
    <div className="sticky bottom-0 py-3 bg-gradient-to-t from-bg via-bg/60 to-transparent">
      <div className="mx-auto max-w-chat px-6">
        <div className="rounded-2xl border border-border bg-surface2/80 backdrop-blur shadow-soft p-2 focus-within:ring-2 focus-within:ring-accent/50 focus-within:ring-offset-2 focus-within:ring-offset-bg">
          <textarea
            ref={ref}
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask anything… ⏎ to send, Shift+⏎ for newline"
            className="w-full resize-none bg-transparent outline-none px-4 py-3 text-[15px] leading-[1.4] placeholder:text-text2/60"
          />
          <div className="flex items-center justify-end gap-2 p-2">
            <Button size="sm" variant="ghost" className="hover:bg-surface2 rounded-lg p-2" aria-label="Attach file">
              <Paperclip className="h-4 w-4" />
            </Button>
            {isStreaming ? (
              <Button size="sm" className="rounded-pill bg-danger/20 text-danger px-3 py-2 hover:bg-danger/25" aria-label="Stop generation">
                <Square className="h-4 w-4" /> Stop
              </Button>
            ) : (
              <Button size="sm" className="rounded-pill bg-accent text-black px-3.5 py-2 font-medium hover:bg-accent/90 transition-colors shadow-soft" aria-label="Send message" onClick={() => void send()}>
                Send
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


