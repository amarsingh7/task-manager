import React, { useCallback } from 'react';
import { useTasks } from '../context/TaskContext';
import TaskItem from './TaskItem';

const TaskList = () => {
  const { filteredTasks, reorderTasks, tasks } = useTasks();

  const handleDrop = useCallback((dragIndex, dropIndex) => {
    const dragTask = filteredTasks[dragIndex];
    const dropTask = filteredTasks[dropIndex];
    const actualDragIndex = tasks.findIndex(t => t.id === dragTask.id);
    const actualDropIndex = tasks.findIndex(t => t.id === dropTask.id);
    reorderTasks(actualDragIndex, actualDropIndex);
  }, [filteredTasks, tasks, reorderTasks]);

  if (filteredTasks.length === 0)
    return <div className="text-center text-gray-500 dark:text-gray-400 py-10">No tasks yet — add one!</div>;

  return (
    <div className="space-y-3">
      {filteredTasks.map((task, index) => (
        <TaskItem key={task.id} task={task} index={index} onDrop={handleDrop} />
      ))}
    </div>
  );
};

export default TaskList;
