import { useEffect, useState } from 'react';
import { useTasksStore } from '@/state/tasksStore';

// Hook to safely use tasksStore on client-side only
export function useTasksStoreClient() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const tasks = useTasksStore(s => isClient ? s.tasks : {});
  const selectedTaskId = useTasksStore(s => isClient ? s.selectedTaskId : undefined);
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
