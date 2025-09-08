import { useEffect, useState, useCallback } from 'react';
import { useTasksStore, Task } from '@/state/tasksStore';

// Hook to safely use tasksStore on client-side only
export function useTasksStoreClient() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Memoize selectors to prevent infinite loops
  const tasksSelector = useCallback((s: { tasks: Record<string, Task> }) => isClient ? s.tasks : {}, [isClient]);
  const selectedTaskIdSelector = useCallback((s: { selectedTaskId?: string }) => isClient ? s.selectedTaskId : undefined, [isClient]);
  
  const tasks = useTasksStore(tasksSelector);
  const selectedTaskId = useTasksStore(selectedTaskIdSelector);
  const selectTask = useTasksStore(s => s.selectTask);
  const ingest = useTasksStore(s => s.ingest);
  const getEventTree = useTasksStore(s => s.getEventTree);

  return {
    tasks,
    selectedTaskId,
    selectTask,
    ingest,
    getEventTree,
    isClient
  };
}
