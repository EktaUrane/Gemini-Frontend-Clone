import React from 'react';
import { useThemeStore } from '../../store/themeStore';
import { MdLightMode, MdDarkMode } from 'react-icons/md';

const DarkModeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  return (
    <button
      onClick={toggleDarkMode}
      className="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-md hover:scale-105 transition-transform duration-200 z-50"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? <MdLightMode size={24} /> : <MdDarkMode size={24} />}
    </button>
  );
};

export default DarkModeToggle;