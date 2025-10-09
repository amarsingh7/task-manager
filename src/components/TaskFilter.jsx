import React, { useMemo } from 'react';
import { useTasks } from '../context/TaskContext';

const TaskFilter = () => {
  const { filter, setFilter, taskStats } = useTasks();
  const filters = useMemo(() => [
    { key: 'all', label: 'All', count: taskStats.total },
    { key: 'pending', label: 'Pending', count: taskStats.pending },
    { key: 'completed', label: 'Completed', count: taskStats.completed }
  ], [taskStats]);

  return (
    <div className="flex flex-wrap gap-2 mb-6 justify-center">
      {filters.map(({ key, label, count }) => (
        <button
          key={key}
          onClick={() => setFilter(key)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
            filter === key ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {label} ({count})
        </button>
      ))}
    </div>
  );
};

export default TaskFilter;
