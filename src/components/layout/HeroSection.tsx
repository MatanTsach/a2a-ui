import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onStartChat: (message: string) => void;
  isInChatMode: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartChat, isInChatMode }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onStartChat(message.trim());
      setMessage("");
    }
  };

  if (isInChatMode) {
    return null; // Hide hero section when in chat mode
  }

  return (
    <section className="pt-24 pb-12 px-6">
      {/* Hero Title */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-4" 
            style={{ 
              color: 'hsl(var(--text-1))',
              lineHeight: '1.2'
            }}>
          What should we code next?
        </h1>
      </div>

      {/* Prompt Card - Following composer design from spec */}
      <div className="mx-auto max-w-chat">
        <form onSubmit={handleSubmit}>
          <div className="rounded-2xl border shadow-soft transition-shadow duration-200 ease-calm" 
               style={{ 
                 backgroundColor: 'hsl(var(--surface-1) / 0.8)',
                 borderColor: 'hsl(var(--border))',
                 backdropFilter: 'blur(8px)'
               }}>
            {/* Main textarea */}
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask anything… ⏎ to send, Shift+⏎ for newline"
                className="w-full resize-none bg-transparent outline-none px-4 py-3 transition-all duration-500 ease-calm"
                style={{ 
                  color: 'hsl(var(--text-1))',
                  fontSize: '15px',
                  lineHeight: '1.4',
                  minHeight: '48px',
                  maxHeight: '200px'
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
            </div>

            {/* Controls row */}
            <div className="flex items-center justify-end gap-2 p-2">
              <Button
                type="submit"
                disabled={!message.trim()}
                className="rounded-full px-3.5 py-2 font-medium transition-colors text-black hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: !message.trim() 
                    ? 'hsl(var(--muted))' 
                    : 'hsl(var(--accent))'
                }}
              >
                <Send className="h-4 w-4 mr-1.5" />
                Send
              </Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};
