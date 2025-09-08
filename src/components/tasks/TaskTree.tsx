import React, { useMemo, useState } from "react";
import { useTasksStoreClient } from "@/hooks/useTasksStoreClient";
import { TreeNode } from "@/state/tasksStore";
import { ChevronDown, ChevronRight, FileText, Wrench, MessageCircle, File, CheckCircle, AlertTriangle } from "lucide-react";

function NodeIcon({ kind }: { kind: TreeNode["kind"] }) {
  switch (kind) {
    case "tool":
      return <Wrench className="h-4 w-4 text-accent" />;
    case "status":
      return <CheckCircle className="h-4 w-4 text-success" />;
    case "artifact":
      return <File className="h-4 w-4 text-accent2" />;
    case "message":
      return <MessageCircle className="h-4 w-4 text-text2" />;
    case "input":
      return <AlertTriangle className="h-4 w-4 text-warn" />;
    default:
      return <FileText className="h-4 w-4 text-text2" />;
  }
}

function TreeRow({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const [open, setOpen] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  const paddingLeft = 12 + depth * 20;

  return (
    <div className="select-none">
      <div
        className="flex items-center gap-2 py-1.5 px-2 rounded-lg transition-colors hover:opacity-80"
        style={{ paddingLeft }}
      >
        {hasChildren ? (
          <button 
            className="transition-colors hover:opacity-80" 
            style={{ color: 'hsl(var(--text-2))' }}
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        ) : (
          <span className="w-4" />
        )}

        <NodeIcon kind={node.kind} />
        
        <div className="flex-1">
          <span className="font-medium" style={{ 
            color: 'hsl(var(--text-1))',
            fontSize: '14px', // sm from type scale
            lineHeight: '1.7'
          }}>
            {node.label}
          </span>
          {node.kind === "status" && node.meta?.progress != null && (
            <span className="ml-2 px-1.5 py-0.5 rounded"
                  style={{ 
                    color: 'hsl(var(--text-2))', 
                    backgroundColor: 'hsl(var(--surface-2))',
                    fontSize: '12px' // xs from type scale
                  }}>
              {Math.round((node.meta.progress as number) * 100)}%
            </span>
          )}
          {node.kind === "artifact" && node.meta?.mime ? (
            <span className="ml-2 px-1.5 py-0.5 rounded"
                  style={{ 
                    color: 'hsl(var(--text-2))', 
                    backgroundColor: 'hsl(var(--surface-2))',
                    fontSize: '12px' // xs from type scale
                  }}>
              {String(node.meta.mime)}
            </span>
          ) : null}
          {node.kind === "message" && node.meta?.text ? (
            <div className="mt-1 line-clamp-2" 
                 style={{ 
                   color: 'hsl(var(--text-2))',
                   fontSize: '12px', // xs from type scale
                   lineHeight: '1.7'
                 }}>
              {String(node.meta.text).slice(0, 100)}
              {String(node.meta.text).length > 100 ? "..." : ""}
            </div>
          ) : null}
        </div>
        
        <div className="font-mono" style={{ 
          color: 'hsl(var(--text-2))',
          fontSize: '12px', // xs from type scale
          lineHeight: '1.7'
        }}>
          {new Date(node.ts).toLocaleTimeString()}
        </div>
      </div>
      
      {hasChildren && open && (
        <div>
          {node.children!.map(child => (
            <TreeRow key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function TaskTree({ taskId }: { taskId?: string }) {
  const { tasks, getEventTree, isClient } = useTasksStoreClient();
  const task = taskId ? tasks[taskId] : undefined;
  const tree = useMemo(() => taskId && isClient ? getEventTree(taskId) : [], [taskId, getEventTree, isClient]);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-64" style={{ color: 'hsl(var(--text-2))' }}>
        <div className="text-center">
          <div className="text-lg font-medium mb-2">Loading...</div>
        </div>
      </div>
    );
  }

  if (!taskId) {
    return (
      <div className="flex items-center justify-center h-64" style={{ color: 'hsl(var(--text-2))' }}>
        <div className="text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <div className="text-lg font-medium mb-2">Select a task</div>
          <div className="text-sm">Choose a task from the list to view its timeline</div>
        </div>
      </div>
    );
  }

  if (tree.length === 0) {
    return (
      <div className="flex items-center justify-center h-64" style={{ color: 'hsl(var(--text-2))' }}>
        <div className="text-center">
          <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <div className="text-lg font-medium mb-2">No events yet</div>
          <div className="text-sm">Events will appear here as the task progresses</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* Task header */}
      {task && (
        <div className="border-b pb-4 mb-4" style={{ borderColor: 'hsl(var(--border))' }}>
          <h3 className="font-semibold mb-1 tracking-tight" style={{ 
            color: 'hsl(var(--text-1))',
            fontSize: '18px', // lg from type scale  
            lineHeight: '1.2'
          }}>
            {task.title}
          </h3>
          <div style={{ 
            color: 'hsl(var(--text-2))',
            fontSize: '14px', // sm from type scale
            lineHeight: '1.7'
          }}>
            {task.agentName || "Agent"} • Created {new Date(task.createdAt).toLocaleString()}
          </div>
        </div>
      )}
      
      {/* Event tree */}
      <div className="space-y-1 overflow-y-auto">
        {tree.map(node => (
          <TreeRow key={node.id} node={node} />
        ))}
      </div>
    </div>
  );
}
