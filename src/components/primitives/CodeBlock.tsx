"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Check, Code2 } from "lucide-react";

interface CodeBlockProps {
  value: string;
  language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ value, language }) => {
  const [copied, setCopied] = useState(false);
  const displayLang = language || "text";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (_) {}
  };

  const isLong = useMemo(() => value.split("\n").length > 40 || value.length > 4000, [value]);
  const [expanded, setExpanded] = useState(!isLong);

  return (
    <div className="my-3 relative group animate-fadeIn">
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy code"
        className="absolute right-2 top-2 text-xs rounded-md bg-surface3/80 border border-border px-2 py-1 opacity-0 group-hover:opacity-100 transition-all hover:border-accent/30"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <pre
        className="max-w-chat overflow-x-auto rounded-xl border border-border bg-surface2 text-[13px] leading-[1.6] p-4"
        style={{ boxShadow: 'inset 0 1px 0 hsl(var(--shadow)/0.25)', maxHeight: expanded ? undefined : 1200 }}
        aria-live="polite"
      >
        <code className={`language-${displayLang}`}>{value}</code>
      </pre>
      {isLong && (
        <div className="mt-2">
          <Button size="sm" variant="ghost" onClick={() => setExpanded((v) => !v)} aria-expanded={expanded}>
            {expanded ? "Collapse" : "Expand"}
          </Button>
        </div>
      )}
    </div>
  );
};


