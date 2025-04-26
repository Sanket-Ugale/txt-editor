import React from 'react';

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
    <div 
      className={`mt-4 p-3 rounded-lg flex flex-wrap justify-between items-center text-sm ${
        isDark ? 'bg-gray-800 bg-opacity-80 backdrop-blur-sm text-gray-400' : 'bg-white bg-opacity-80 backdrop-blur-sm text-gray-600'
      } shadow-md transition-all duration-300`}
    >
      <div className="flex gap-5">
        <div className="flex items-center px-2 py-1 bg-opacity-20 rounded-md bg-blue-500">
          <div className="font-medium">{stats.words}</div>
          <div className="ml-1 opacity-80">words</div>
        </div>
        <div className="flex items-center px-2 py-1 bg-opacity-20 rounded-md bg-green-500">
          <div className="font-medium">{stats.chars}</div>
          <div className="ml-1 opacity-80">characters</div>
        </div>
        <div className="flex items-center px-2 py-1 bg-opacity-20 rounded-md bg-purple-500">
          <div className="font-medium">{stats.lines}</div>
          <div className="ml-1 opacity-80">lines</div>
        </div>
      </div>
      <div className="flex items-center">
        <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
        Auto-saved at {formattedTime}
      </div>
    </div>
  );
}
