import React, { useState } from 'react';
import { GripVertical, Trash2, Edit } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import ConfirmDialog from './ConfirmDialog';

const TaskItem = ({ task, index, onDrop }) => {
  const { toggleTask, deleteTask, setEditTask } = useTasks();
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [confirmDeleteToggle, setConfirmDeleteToggle] = useState(false);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (draggedIndex !== index) onDrop(draggedIndex, index);
    setIsDragOver(false);
  };

  const ononfirmDelete = () => {
    deleteTask(task.id);
    setConfirmDeleteToggle(false);
  }

  const onCancelDelete = () => {
    setConfirmDeleteToggle(false);
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={() => setIsDragging(false)}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className={`group p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-md cursor-move ${isDragging ? 'opacity-50 scale-95' : ''} ${isDragOver ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}`}
    >
      <div className="flex items-center gap-3">
        <GripVertical size={16} className="text-gray-400" />
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleTask(task.id)}
          className="w-5 h-5 text-blue-600 rounded border-2 border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
        />
        <span className={`flex-1 ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900 dark:text-gray-100'}`}>
          {task.text}
        </span>
        <button
          onClick={() => {
            setEditTask(task);
          }}
          className="opacity-0 group-hover:opacity-100 p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 hover:scale-110"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={() => setConfirmDeleteToggle(true)}
          className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 hover:scale-110"
        >
          <Trash2 size={16} />
        </button>
      </div>
      <ConfirmDialog 
        title="Confirm Deletion"
        message={
          <p>
            Are you sure you want to delete below task? This action cannot be undone.
            <span  className='block font-bold mt-3'>{task.text}</span>
          </p>
        }
        onConfirm={ononfirmDelete}
        onCancel={onCancelDelete}
        isOpen={confirmDeleteToggle}
      />
    </div>
  );
};

export default TaskItem;
