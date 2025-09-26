import React, { useState, useContext, createContext, useCallback, useMemo, memo, useRef } from 'react';
import { Trash2, Plus, Sun, Moon, GripVertical, Check } from 'lucide-react';

// useLocalStorage hook to handle local storage operations (custom hooks)
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
};

// React Context instead of prop drilling to manage task data (context api)
const TaskContext = createContext();
const ThemeContext = createContext();

// Toggle with dark/light mode with localStorage persistence
const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useLocalStorage('darkMode', false);

  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev);
  }, [setIsDark]);

  const themeValue = useMemo(() => ({
    isDark,
    toggleTheme
  }), [isDark, toggleTheme]);

  return (
    <ThemeContext.Provider value={themeValue}>
      <div className={isDark ? 'dark' : ''}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

// Task Provider
const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [filter, setFilter] = useState('all');

  // add tasks with validation
  const addTask = useCallback((text) => {
    if (text.trim() === '') return false;
    
    const newTask = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    setTasks(prev => [...prev, newTask]);
    return true;
  }, [setTasks]);

  // mark tasks as completed
  const toggleTask = useCallback((id) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  }, [setTasks]);

  // delete tasks
  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, [setTasks]);

  // task reordering functionality
  const reorderTasks = useCallback((dragIndex, hoverIndex) => {
    setTasks(prev => {
      const dragTask = prev[dragIndex];
      const result = [...prev];
      result.splice(dragIndex, 1);
      result.splice(hoverIndex, 0, dragTask);
      return result;
    });
  }, [setTasks]);

  // ✅ new: mark all pending tasks as completed
  const markAllCompleted = useCallback(() => {
    setTasks(prev => prev.map(task => ({ ...task, completed: true })));
  }, [setTasks]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'completed':
        return tasks.filter(task => task.completed);
      case 'pending':
        return tasks.filter(task => !task.completed);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  // task statistics
  const taskStats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    pending: tasks.filter(task => !task.completed).length
  }), [tasks]);

  const contextValue = useMemo(() => ({
    tasks,
    filteredTasks,
    filter,
    taskStats,
    addTask,
    toggleTask,
    deleteTask,
    setFilter,
    reorderTasks,
    markAllCompleted, // ✅ expose new function
  }), [tasks, filteredTasks, filter, taskStats, addTask, toggleTask, deleteTask, setFilter, reorderTasks, markAllCompleted]);

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
};

// custom hooks to use contexts
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within a TaskProvider');
  return context;
};

// Header
const Header = memo(() => {
  const { isDark, toggleTheme } = useTheme();
  const { taskStats, markAllCompleted } = useTasks(); // ✅ use new function

  return (
    <header className="mb-10 text-center">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl md:text-5xl font-bold pb-2 bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent">
          Task Manager
        </h1>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-105"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <div className="flex justify-center mt-8 gap-4 text-sm text-gray-600 dark:text-gray-400">
        <span className="font-bold text-lg">Total: {taskStats.total}</span>
        <span className="font-bold text-lg">Completed: {taskStats.completed}</span>
        <span className="font-bold text-lg">Pending: {taskStats.pending}</span>
      </div>

      {/* ✅ New Button */}
      {taskStats.pending > 0 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={markAllCompleted}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all duration-200 hover:scale-105"
          >
            Mark All as Done
          </button>
        </div>
      )}
    </header>
  );
});

//  Prevent users from adding empty tasks (form validation)
//  useCallback to prevent unnecessary re-renders (performance optimization)
//  Dynamic button icon based on input state (UX enhancement)
const TaskForm = memo(() => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [isInputActive, setIsInputActive] = useState(false);
  const { addTask } = useTasks();

  //  useCallback to memoize functions (performance optimization)
  const handleSubmit = useCallback(() => {
    setError('');
    
    if (!addTask(inputValue)) {
      // show error when trying to submit empty task
      setError('Please enter a task');
      return;
    }
    
    setInputValue('');
    setIsInputActive(false); // reset button state after submission
  }, [inputValue, addTask]);

  const handleInputChange = useCallback((e) => {
    setInputValue(e.target.value);
    if (error) setError('');
  }, [error]);

  const handleFocus = useCallback(() => {
    setIsInputActive(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsInputActive(inputValue.trim().length > 0);
  }, [inputValue]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }, [handleSubmit]);

  return (
    <div className="mb-6">
      <div className="flex gap-2 items-start">
        <div className="flex-1">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyPress={handleKeyPress}
            placeholder="Add a new task..."
            className={`w-full px-4 h-12 rounded-lg border-2 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
            }`}
          />
          <div className="h-6 mt-1">
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className={`px-6 h-12 text-white rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 flex-shrink-0 flex items-center justify-center ${
            isInputActive
              ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
              : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
          }`}
          title={
            isInputActive
              ? 'Confirm task'
              : 'Add new task'
          }
        >
          {isInputActive ? (
            <Check size={20} />
          ) : (
            <Plus size={20} />
          )}
        </button>
      </div>
    </div>
  );
});

//  Filter tasks (All, Completed, Pending)
//  useMemo for filter options (performance optimization)
const TaskFilter = memo(() => {
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
            filter === key
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {label} ({count})
        </button>
      ))}
    </div>
  );
});

//  Custom HTML5 drag-and-drop implementation for task reordering
//  CSS transitions for adding/removing tasks (animations)
const TaskItem = memo(({ task, index, onDrop }) => {
  const { toggleTask, deleteTask } = useTasks();
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const dragRef = useRef(null);

  const handleToggle = useCallback(() => {
    toggleTask(task.id);
  }, [task.id, toggleTask]);

  const handleDelete = useCallback(() => {
    deleteTask(task.id);
  }, [task.id, deleteTask]);

  const handleDragStart = useCallback((e) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
  }, [index]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (draggedIndex !== index) {
      onDrop(draggedIndex, index);
    }
    setIsDragOver(false);
  }, [index, onDrop]);

  return (
  
    <div
      ref={dragRef}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`group p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-md cursor-move animate-slideIn ${
        isDragging ? 'opacity-50 scale-95' : ''
      } ${
        isDragOver ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing">
          <GripVertical size={16} />
        </div>
        
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggle}
          className="w-5 h-5 text-blue-600 rounded border-2 border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 transition-all duration-200"
        />
        
        <span className={`flex-1 transition-all duration-200 ${
          task.completed
            ? 'text-gray-500 dark:text-gray-400 line-through'
            : 'text-gray-900 dark:text-gray-100'
        }`}>
          {task.text}
        </span>
        
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 hover:scale-110"
          aria-label="Delete task"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
});

// task list component
const TaskList = memo(() => {
  const { filteredTasks, reorderTasks, tasks } = useTasks();

  const handleDrop = useCallback((dragIndex, dropIndex) => {
    // find the actual indices in the full tasks array
    const dragTask = filteredTasks[dragIndex];
    const dropTask = filteredTasks[dropIndex];
    
    const actualDragIndex = tasks.findIndex(t => t.id === dragTask.id);
    const actualDropIndex = tasks.findIndex(t => t.id === dropTask.id);
    
    reorderTasks(actualDragIndex, actualDropIndex);
  }, [filteredTasks, tasks, reorderTasks]);

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 dark:text-gray-500 text-lg mb-2">
          No tasks found
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Add a task to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredTasks.map((task, index) => (
        <TaskItem 
          key={task.id} 
          task={task} 
          index={index} 
          onDrop={handleDrop}
        />
      ))}
    </div>
  );
});

// Main App Component
const App = () => {
  return (
    <ThemeProvider>
      <TaskProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <div className="container mx-auto px-4 py-8 max-w-2xl">
            <Header />
            <TaskForm />
            <TaskFilter />
            <TaskList />
          </div>
        </div>

        {/* slideIn animation for new tasks (animation) */}
        <style jsx global>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-slideIn {
            animation: slideIn 0.3s ease-out;
          }
          
          @media (max-width: 640px) {
            .container {
              padding-left: 1rem;
              padding-right: 1rem;
            }
          }
        `}</style>
      </TaskProvider>
    </ThemeProvider>
  );
};

export default App;