import React from "react";
import { useTasksStoreClient } from "@/hooks/useTasksStoreClient";
import { formatDistanceToNow } from "date-fns";
import { Task } from "@/state/tasksStore";

interface TaskListProps {
  onTaskSelect: (taskId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ onTaskSelect }) => {
  const { tasks, isClient } = useTasksStoreClient();
  
  if (!isClient) {
    return (
      <div className="text-center py-12">
        <div className="text-lg mb-2" style={{ color: 'hsl(var(--text-2))' }}>
          Loading tasks...
        </div>
      </div>
    );
  }
  
  const tasksList = Object.values(tasks).sort((a: Task, b: Task) => b.updatedAt - a.updatedAt);

  const getStatusPillStyle = (state: string) => {
    switch (state) {
      case "completed":
        return {
          backgroundColor: 'hsl(var(--success) / 0.2)',
          color: 'hsl(var(--success))',
          borderColor: 'hsl(var(--success) / 0.3)'
        };
      case "failed":
        return {
          backgroundColor: 'hsl(var(--danger) / 0.2)',
          color: 'hsl(var(--danger))',
          borderColor: 'hsl(var(--danger) / 0.3)'
        };
      case "canceled":
        return {
          backgroundColor: 'hsl(var(--text-2) / 0.2)',
          color: 'hsl(var(--text-2))',
          borderColor: 'hsl(var(--text-2) / 0.3)'
        };
      default: // started
        return {
          backgroundColor: 'hsl(var(--accent-2) / 0.2)',
          color: 'hsl(var(--accent-2))',
          borderColor: 'hsl(var(--accent-2) / 0.3)'
        };
    }
  };

  const getEventCount = (taskId: string) => {
    const task = tasksList.find(t => t.taskId === taskId);
    return task?.events?.length || 0;
  };

  if (tasksList.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-2" style={{ 
          color: 'hsl(var(--text-2))', 
          fontSize: '18px', // lg from type scale
          lineHeight: '1.7'
        }}>
          No tasks yet
        </div>
        <div style={{ 
          color: 'hsl(var(--text-2) / 0.7)', 
          fontSize: '14px', // sm from type scale
          lineHeight: '1.7'
        }}>
          Tasks will appear here when you start a conversation
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {tasksList.map((task) => {
        const eventCount = getEventCount(task.taskId);
        const statusStyle = getStatusPillStyle(task.state);
        return (
          <button
            key={task.taskId}
            onClick={() => onTaskSelect(task.taskId)}
            className="w-full text-left p-4 transition-colors border-b last:border-b-0 group hover:opacity-80 hover:bg-opacity-60"
            style={{ 
              borderColor: 'hsl(var(--border) / 0.5)'
            }}
          >
            <div className="flex items-center justify-between">
              {/* Left: Title and subtitle */}
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate mb-1" 
                     style={{ 
                       color: 'hsl(var(--text-1))',
                       fontSize: '16px', // base from type scale
                       lineHeight: '1.7'
                     }}>
                  {task.title}
                </div>
                <div className="flex items-center space-x-2" 
                     style={{ 
                       color: 'hsl(var(--text-2))',
                       fontSize: '14px', // sm from type scale
                       lineHeight: '1.7'
                     }}>
                  <span>{formatDistanceToNow(task.updatedAt, { addSuffix: true })}</span>
                  <span>•</span>
                  <span>{task.agentName || "Agent"}</span>
                  <span>•</span>
                  <span>{task.taskId.slice(0, 8)}</span>
                </div>
              </div>

              {/* Right: Status pill and event count */}
              <div className="flex items-center space-x-3 ml-4">
                <div className="px-2 py-1 rounded-full font-medium border"
                     style={{
                       ...statusStyle,
                       fontSize: '12px' // xs from type scale
                     }}>
                  {task.state.charAt(0).toUpperCase() + task.state.slice(1)}
                </div>
                <div className="font-mono" style={{ 
                  color: 'hsl(var(--text-2))',
                  fontSize: '14px', // sm from type scale
                  lineHeight: '1.7'
                }}>
                  {eventCount} events
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
