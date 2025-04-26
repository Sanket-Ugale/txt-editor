import React from 'react';
import { motion } from 'framer-motion';

interface StatusBarProps {
  stats: {
    words: number;
    chars: number;
    lines: number;
  };
  lastSaved: Date;
  isDark: boolean;
}

export default function StatusBar({ stats, lastSaved, isDark }: StatusBarProps) {
  const formattedTime = lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className={`mx-4 mb-4 p-4 rounded-xl flex flex-wrap justify-between items-center text-sm ${
        isDark ? 'bg-black-800 bg-opacity-90 backdrop-blur-sm text-black-400 border border-black-700' : 'bg-white bg-opacity-90 backdrop-blur-sm text-black-600 border border-black-200'
      } shadow-lg transition-all duration-300`}
    >
      <div className="flex flex-wrap gap-3">
        <StatItem 
          value={stats.words} 
          label="words" 
          color="blue" 
          isDark={isDark} 
        />
        <StatItem 
          value={stats.chars} 
          label="characters" 
          color="green" 
          isDark={isDark} 
        />
        <StatItem 
          value={stats.lines} 
          label="lines" 
          color="purple" 
          isDark={isDark} 
        />
      </div>
      <div className={`flex items-center px-3 py-1.5 rounded-md ${isDark ? 'bg-black-700' : 'bg-black-100'}`}>
        <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
        <span className={`${isDark ? 'text-black-300' : 'text-black-600'} font-medium`}>
          Auto-saved at {formattedTime}
        </span>
      </div>
    </motion.div>
  );
}

interface StatItemProps {
  value: number;
  label: string;
  color: 'blue' | 'green' | 'purple';
  isDark: boolean;
}

function StatItem({ value, label, color, isDark }: StatItemProps) {
  const getColorClass = () => {
    switch (color) {
      case 'blue':
        return isDark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800';
      case 'green':
        return isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800';
      case 'purple':
        return isDark ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-800';
      default:
        return '';
    }
  };

  return (
    <div className={`flex items-center px-3 py-1.5 rounded-md ${getColorClass()}`}>
      <div className="font-bold">{value.toLocaleString()}</div>
      <div className="ml-1.5 opacity-80">{label}</div>
    </div>
  );
}
