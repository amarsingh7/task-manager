import React from 'react';
import Navbar from './components/Navbar';
import TaskForm from './components/TaskForm';
import TaskFilter from './components/TaskFilter';
import TaskList from './components/TaskList';
import { ThemeProvider } from './context/ThemeContext';
import { TaskProvider } from './context/TaskContext';

const App = () => {
  return (
    <ThemeProvider>
      <TaskProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Navbar />
          <div className="container mx-auto px-4 py-8 max-w-2xl">
            <TaskForm />
            <TaskFilter />
            <TaskList />
          </div>
        </div>
      </TaskProvider>
    </ThemeProvider>
  );
};

export default App;
