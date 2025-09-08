"use client";

import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  tool: { name: string; params: unknown; requiresConfirmation: boolean };
  onRun: () => void;
  onCancel: () => void;
};

export const InlineToolBar: React.FC<Props> = ({ tool, onRun, onCancel }) => {
  const prettyParams = useMemo(() => JSON.stringify(tool.params, null, 2), [tool.params]);
  return (
    <div className="relative mt-3 rounded-xl border border-border bg-surface2/60 backdrop-blur shadow-soft p-3">
      <div className="absolute left-0 top-0 h-full w-1 bg-accent/70 rounded-l-xl" />
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-text1">This action needs your approval</div>
        <div className="flex items-center gap-2">
          <Button size="sm" className="bg-accent text-black hover:bg-accent/90 rounded-lg px-3.5 py-2 font-medium shadow-soft" onClick={onRun}>Run</Button>
          <Button size="sm" variant="ghost" className="bg-transparent border border-border hover:bg-surface3 rounded-lg px-3.5 py-2" onClick={onCancel}>Cancel</Button>
        </div>
      </div>
      <details className="mt-2">
        <summary className="cursor-pointer text-sm text-text2">Review details</summary>
        <div className="mt-2 text-xs">
          <div className="mb-1"><span className="text-text2">Tool:</span> {tool.name}</div>
          <pre className="overflow-x-auto rounded-lg border border-border p-2 bg-surface1 max-w-chat"><code>{prettyParams}</code></pre>
        </div>
      </details>
    </div>
  );
};


