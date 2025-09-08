import React from "react";
import { ChatMessage } from "@/types/chat";
import { ArtifactDisplay } from "./ArtifactDisplay";
import { PartsDisplay } from "./PartsDisplay";

interface ChatMessageBubbleProps {
    message: ChatMessage;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message }) => {
    return (
        <div
            className={`mb-4 ${
                message.sender === "user" ? "flex flex-col items-end" : "flex flex-col items-start"
            }`}
        >
            {/* Sender name */}
            <div className={`text-xs text-muted-foreground mb-1 px-2 ${
                message.sender === "user" ? "text-right" : "text-left"
            }`}>
                {message.senderName}
            </div>
            
            <div className="max-w-chat space-y-2">
                {/* Message bubble */}
                {message.content && (
                    <div className={`relative p-5 rounded-2xl text-sm whitespace-pre-wrap break-words border ${
                        message.sender === "user"
                            ? "ml-auto bg-muted border/70"
                            : "bg-card border shadow-sm hover:shadow-md transition-shadow duration-200 ease-calm"
                    }`}>
                        {message.content}
                        
                        {/* Timestamp */}
                        <div className={`text-[11px] mt-2 ${
                            message.sender === "user" ? "text-muted-foreground/70" : "text-muted-foreground/70"
                        }`}>
                            {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                    </div>
                )}

                {/* Artifacts */}
                {message.artifacts && message.artifacts.length > 0 && (
                    <div className="space-y-2">
                        {message.artifacts.map((artifact, index) => (
                            <ArtifactDisplay key={artifact.artifactId || index} artifact={artifact} />
                        ))}
                    </div>
                )}

                {/* Parts */}
                {message.parts && message.parts.length > 0 && (
                    <PartsDisplay parts={message.parts} />
                )}
            </div>
        </div>
    );
}; 