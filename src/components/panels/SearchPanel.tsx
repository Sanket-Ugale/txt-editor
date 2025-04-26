import { motion } from 'framer-motion';
import { FiSearch, FiRefreshCw } from 'react-icons/fi';

interface SearchPanelProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  replaceQuery: string;
  setReplaceQuery: (query: string) => void;
  handleSearch: () => void;
  handleReplace: () => void;
  handleReplaceAll: () => void;
  isDark: boolean;
}

export default function SearchPanel({
  searchQuery,
  setSearchQuery,
  replaceQuery,
  setReplaceQuery,
  handleSearch,
  handleReplace,
  handleReplaceAll,
  isDark
}: SearchPanelProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`overflow-hidden ${isDark ? 'bg-black-800 bg-opacity-90 backdrop-blur-sm border-black-700' : 'bg-white bg-opacity-90 backdrop-blur-sm border-black-200'} border rounded-lg shadow-lg mx-4 mb-2`}
    >
      <div className="p-4">
        <div className="flex items-center gap-2 text-blue-500 mb-3">
          <FiSearch className="h-4 w-4" />
          <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-black-700'}`}>Search & Replace</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className={`block text-xs font-medium ${isDark ? 'text-black-300' : 'text-black-600'}`}>
              Find
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search text..."
                className={`w-full px-3 py-2 pl-9 rounded-md text-sm ${
                  isDark ? 'bg-black-700 border-black-600 text-white placeholder-black-400' : 'bg-black-50 border-black-300 placeholder-black-500'
                } border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
              />
              <FiSearch className={`absolute left-3 top-2.5 h-4 w-4 ${isDark ? 'text-black-400' : 'text-black-500'}`} />
            </div>
            <ActionButton 
              label="Find" 
              onClick={handleSearch} 
              isDark={isDark} 
              variant="primary"
              icon={<FiSearch className="h-4 w-4" />}
            />
          </div>
          
          <div className="space-y-2">
            <label className={`block text-xs font-medium ${isDark ? 'text-black-300' : 'text-black-600'}`}>
              Replace
            </label>
            <div className="relative">
              <input
                type="text"
                value={replaceQuery}
                onChange={(e) => setReplaceQuery(e.target.value)}
                placeholder="Replace with..."
                className={`w-full px-3 py-2 pl-9 rounded-md text-sm ${
                  isDark ? 'bg-black-700 border-black-600 text-white placeholder-black-400' : 'bg-black-50 border-black-300 placeholder-black-500'
                } border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
              />
              <FiRefreshCw className={`absolute left-3 top-2.5 h-4 w-4 ${isDark ? 'text-black-400' : 'text-black-500'}`} />
            </div>
            <div className="flex gap-2">
              <ActionButton 
                label="Replace" 
                onClick={handleReplace} 
                isDark={isDark} 
                variant="secondary"
              />
              <ActionButton 
                label="Replace All" 
                onClick={handleReplaceAll} 
                isDark={isDark} 
                variant="secondary"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface ActionButtonProps {
  onClick: () => void;
  label: string;
  isDark: boolean;
  variant: 'primary' | 'secondary' | 'danger';
  icon?: React.ReactNode;
}

function ActionButton({ onClick, label, isDark, variant, icon }: ActionButtonProps) {
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return isDark 
          ? 'bg-blue-600 hover:bg-blue-500 text-white' 
          : 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'danger':
        return isDark 
          ? 'bg-red-700 hover:bg-red-600 text-white' 
          : 'bg-red-500 hover:bg-red-600 text-white';
      default:
        return isDark 
          ? 'bg-black-700 hover:bg-black-600 text-black-200' 
          : 'bg-black-200 hover:bg-black-300 text-black-700';
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`py-2 px-3 text-sm rounded-md flex items-center justify-center gap-1.5 transition-all duration-200 ${getButtonStyle()} shadow-sm w-full btn-hover-effect`}
    >
      {icon}
      {label}
    </motion.button>
  );
}
