import React, { memo, useCallback } from 'react';
import { Sun, Moon, Trash2, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTasks } from '../context/TaskContext';

const Navbar = memo(() => {
  const { isDark, toggleTheme } = useTheme();
  const { taskStats, markAllCompleted, tasks, setTasks } = useTasks();

  const removePendingTasks = useCallback(() => {
    const hasPending = tasks.some(task => !task.completed);
    if (!hasPending) return alert('No pending tasks to remove!');
    if (window.confirm('Are you sure you want to remove all pending tasks?')) {
      setTasks(prev => prev.filter(task => task.completed));
    }
  }, [tasks, setTasks]);

  const completionPercentage = taskStats.total > 0 
    ? Math.round((taskStats.completed / taskStats.total) * 100) 
    : 0;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        
        {/* Logo + Title */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-500 animate-gradient-slow"></div>
          <h1 className="relative text-3xl font-extrabold bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 bg-clip-text text-transparent select-none animate-gradient-slow">
            ⚡ TaskMaster
          </h1>
        </div>

        {/* Stats + Actions */}
        <div className="flex items-center gap-4 flex-wrap justify-end">
          <div className="hidden md:flex gap-4 text-sm font-semibold">
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 shadow-md animate-fadeIn">
              <Check size={16} /> {taskStats.completed}
            </div>
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 shadow-md animate-fadeIn">
              🕒 {taskStats.pending}
            </div>
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-md animate-fadeIn">
              📊 {completionPercentage}%
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            {taskStats.pending > 0 && (
              <>
                <button
                  onClick={markAllCompleted}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-white font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:rotate-1"
                >
                  <Check size={16} className="inline-block mr-1 animate-bounce" /> Complete All
                </button>
                <button
                  onClick={removePendingTasks}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:-rotate-1"
                >
                  <Trash2 size={16} className="inline-block mr-1 animate-shake" /> Remove Pending
                </button>
              </>
            )}
            <button
              onClick={toggleTheme}
              className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-md hover:scale-110 transition-transform duration-300 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-blue-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
              {isDark ? <Sun size={20} className="animate-spin-slow" /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Extra Animations */}
      <style jsx>{`
        @keyframes animateGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-slow { background-size: 200% 200%; animation: animateGradient 10s ease infinite; }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        .animate-bounce { animation: bounce 1s infinite; }
        @keyframes shake { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-5deg); } 75% { transform: rotate(5deg); } }
        .animate-shake { animation: shake 0.5s infinite; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px);} to {opacity:1; transform:translateY(0);} }
        .animate-fadeIn { animation: fadeIn 0.5s ease forwards; }
      `}</style>
    </nav>
  );
});

export default Navbar;
