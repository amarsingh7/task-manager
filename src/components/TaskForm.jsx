import { useState, useEffect, useCallback } from 'react';
import { Check, Plus, X } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

const TaskForm = () => {
  const { addTask, editTask, editTaskText, setEditTask } = useTasks();
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const handleAdd = useCallback(() => {
    setError('');
    if (!addTask(inputValue)) {
      setError('Please enter a task');
      return;
    }
    setInputValue('');
  }, [inputValue, addTask]);

  const handleEditTaskText = useCallback(() => {
    setError('');
    if (!editTaskText(editTask.id, inputValue)) {
      setError('Please enter the task');
      return;
    }
    setInputValue('');
    setEditTask(null);
  }, [inputValue, editTask, editTaskText, setEditTask]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      editTask ? handleEditTaskText() : handleAdd();
    };
  }, [editTask, handleAdd, handleEditTaskText]);

  useEffect(() => {
    if (editTask) {
      setInputValue(editTask.text);
    } else {
      setInputValue('');
    }
  }, [editTask]);

  return (
    <div className="mb-6">
      <div className="flex gap-2 items-start">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={editTask ? "Edit task..." : "Add a new task..."}
          className={`flex-1 px-4 h-12 rounded-lg border-2 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'}`}
        />
        {
          editTask ? (
            <>
              <button
                onClick={() => setEditTask(null)}
                title='Cancel'
                className="px-6 h-12 text-white rounded-lg bg-blue-200 hover:bg-blue-300 flex items-center justify-center transition-all duration-200"
              >
                <X size={20} className='text-blue-600'/>
              </button>

              <button
                onClick={handleEditTaskText}
                title='Save Changes'
                className="px-6 h-12 text-white rounded-lg bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-all duration-200"
              >
                <Check size={20} />
              </button>
            </>
          ) : (
            <button
              onClick={handleAdd}
              title='Add Task'
              className="px-6 h-12 text-white rounded-lg bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-all duration-200"
            >
              <Plus size={20} />
            </button>
          )
        }
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default TaskForm;
