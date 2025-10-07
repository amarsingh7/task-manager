import React, { createContext, useContext, useCallback, useMemo, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [filter, setFilter] = useState('all');

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

  const toggleTask = useCallback((id) => {
    setTasks(prev => prev.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  }, [setTasks]);

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, [setTasks]);

  const reorderTasks = useCallback((dragIndex, hoverIndex) => {
    setTasks(prev => {
      const dragTask = prev[dragIndex];
      const result = [...prev];
      result.splice(dragIndex, 1);
      result.splice(hoverIndex, 0, dragTask);
      return result;
    });
  }, [setTasks]);

  const markAllCompleted = useCallback(() => {
    setTasks(prev => prev.map(task => ({ ...task, completed: true })));
  }, [setTasks]);

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'completed': return tasks.filter(t => t.completed);
      case 'pending': return tasks.filter(t => !t.completed);
      default: return tasks;
    }
  }, [tasks, filter]);

  const taskStats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length
  }), [tasks]);

  const contextValue = useMemo(() => ({
    tasks, filteredTasks, filter, taskStats,
    addTask, toggleTask, deleteTask, setFilter, reorderTasks, markAllCompleted, setTasks
  }), [tasks, filteredTasks, filter, taskStats, addTask, toggleTask, deleteTask, setFilter, reorderTasks, markAllCompleted, setTasks]);

  return <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>;
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within TaskProvider');
  return context;
};
