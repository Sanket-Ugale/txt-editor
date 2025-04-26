import { FiType, FiSearch, FiBold, FiSettings, FiSun, FiMoon, FiGithub, FiFile } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface HeaderProps {
  fileName: string;
  setFileName: (name: string) => void;
  lastSaved: Date;
  isDark: boolean;
  toggleTheme: () => void;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
  setShowFormatting: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSettings: React.Dispatch<React.SetStateAction<boolean>>;
  showSearch: boolean;
  showFormatting: boolean;
  showSettings: boolean;
  createNewDocument: () => void;
}

export default function Header({
  fileName,
  setFileName,
  lastSaved,
  isDark,
  toggleTheme,
  setShowSearch,
  setShowFormatting,
  setShowSettings,
  showSearch,
  showFormatting,
  showSettings,
  createNewDocument
}: HeaderProps) {
  const formattedTime = lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <header className={`w-full py-4 px-6 rounded-t-xl ${
      isDark ? 'bg-gray-800 bg-opacity-80 backdrop-blur-sm' : 'bg-white bg-opacity-80 backdrop-blur-sm'
    } shadow-lg flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center transition-all duration-300`}>
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
          <FiType className="h-5 w-5" />
        </div>
        <div>
          <input 
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className={`font-medium text-lg px-3 py-1.5 rounded-md border ${
              isDark ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400' : 'bg-gray-50 border-gray-300 focus:border-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 w-full sm:w-auto max-w-[220px] transition-all duration-200`}
            placeholder="Untitled Document"
          />
          <div className="text-xs text-gray-500 ml-2 mt-1 flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-1 animate-pulse"></span>
            Last saved at {formattedTime}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 flex-wrap justify-end">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={createNewDocument}
          className={`py-2 px-3 rounded-md flex items-center gap-2 ${
            isDark ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
          } transition-all duration-200 shadow-sm`}
          title="Create New Document"
        >
          <FiFile className="h-4 w-4" />
          <span className="text-sm font-medium">New</span>
        </motion.button>
        
        <div className="flex gap-2 bg-opacity-50 rounded-lg p-1">
          <HeaderButton 
            icon={<FiSearch />} 
            onClick={() => setShowSearch(prev => !prev)}
            isActive={showSearch}
            title="Search (Ctrl+F)"
            isDark={isDark}
          />
          <HeaderButton 
            icon={<FiBold />} 
            onClick={() => setShowFormatting(prev => !prev)}
            isActive={showFormatting}
            title="Formatting Options"
            isDark={isDark}
          />
          <HeaderButton 
            icon={<FiSettings />} 
            onClick={() => setShowSettings(prev => !prev)}
            isActive={showSettings}
            title="Settings"
            isDark={isDark}
          />
          <HeaderButton 
            icon={isDark ? <FiSun /> : <FiMoon />} 
            onClick={toggleTheme}
            isActive={false}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            isDark={isDark}
          />
        </div>
        <a
          href="https://github.com/yourusername/txt-editor"
          target="_blank"
          rel="noopener noreferrer"
          className={`p-2.5 rounded-lg transition-all duration-200 ${
            isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700'
          }`}
          title="View on GitHub"
        >
          <FiGithub className="h-4 w-4" />
        </a>
      </div>
    </header>
  );
}

interface HeaderButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  isActive: boolean;
  title: string;
  isDark: boolean;
}

function HeaderButton({ icon, onClick, isActive, title, isDark }: HeaderButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`p-2.5 rounded-lg transition-all duration-200 ${
        isActive 
          ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md' 
          : isDark 
            ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
            : 'hover:bg-gray-200 text-gray-700 hover:text-gray-900'
      }`}
      title={title}
    >
      {icon}
    </motion.button>
  );
}
