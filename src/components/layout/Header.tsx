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
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`w-full py-4 px-6 rounded-xl ${
        isDark ? 'bg-black-800 bg-opacity-90 backdrop-blur-lg border border-black-700' : 'bg-white bg-opacity-90 backdrop-blur-lg border border-black-200'
      } shadow-xl flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center transition-all duration-300 mx-4 mt-4 mb-2`}
    >
      <div className="flex items-center gap-4">
        <motion.div 
          whileHover={{ rotate: 5, scale: 1.05 }}
          className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg"
        >
          <FiType className="h-5 w-5" />
        </motion.div>
        <div>
          <div className="relative group">
            <input 
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className={`font-medium text-lg px-3 py-1.5 rounded-md border ${
                isDark ? 'bg-black-700 border-black-600 text-white focus:border-blue-400' : 'bg-black-50 border-black-300 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 w-full sm:w-auto max-w-[220px] transition-all duration-200`}
              placeholder="Untitled Document"
            />
            <div className={`absolute h-0.5 bottom-0 left-0 ${isDark ? 'bg-blue-500' : 'bg-blue-400'} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded`} style={{ width: 'calc(100% - 16px)', margin: '0 8px' }}></div>
          </div>
          <div className="text-xs mt-1 flex items-center gap-1">
            <span className={`inline-block h-2 w-2 rounded-full bg-green-500 mr-1 animate-pulse`}></span>
            <span className={`${isDark ? 'text-black-400' : 'text-black-500'}`}>Last saved at {formattedTime}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 flex-wrap justify-end">
        <div className={`flex rounded-lg p-1 ${isDark ? 'bg-black-700' : 'bg-black-100'}`}>
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
        </div>
        
        <div className={`flex gap-1 rounded-lg p-1 ${isDark ? 'bg-black-700' : 'bg-black-100'}`}>
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
        
        <motion.a
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          href="https://github.com/yourusername/txt-editor"
          target="_blank"
          rel="noopener noreferrer"
          className={`p-2.5 rounded-lg transition-all duration-200 ${
            isDark ? 'bg-black-700 hover:bg-black-600 text-black-300 hover:text-white' : 'bg-black-100 hover:bg-black-200 text-black-700'
          }`}
          title="View on GitHub"
        >
          <FiGithub className="h-4 w-4" />
        </motion.a>
      </div>
    </motion.header>
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
          ? isDark
            ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-md' 
            : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md'
          : isDark 
            ? 'hover:bg-black-600 text-black-300 hover:text-white' 
            : 'hover:bg-black-200 text-black-700 hover:text-black-900'
      }`}
      title={title}
    >
      {icon}
    </motion.button>
  );
}
