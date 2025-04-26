import { motion } from 'framer-motion';

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
    <div className={`overflow-hidden ${isDark ? 'bg-gray-800 bg-opacity-80 backdrop-blur-sm border-gray-700' : 'bg-white bg-opacity-80 backdrop-blur-sm border-gray-200'} border-x border-b`}>
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className={`w-full px-3 py-2 rounded-md text-sm ${
                isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'
              } border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              value={replaceQuery}
              onChange={(e) => setReplaceQuery(e.target.value)}
              placeholder="Replace with..."
              className={`w-full px-3 py-2 rounded-md text-sm ${
                isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'
              } border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <ActionButton 
              label="Find" 
              onClick={handleSearch} 
              isDark={isDark} 
              variant="primary"
            />
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
  );
}

interface ActionButtonProps {
  onClick: () => void;
  label: string;
  isDark: boolean;
  variant: 'primary' | 'secondary' | 'danger';
}

function ActionButton({ onClick, label, isDark, variant }: ActionButtonProps) {
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
          ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
          : 'bg-gray-200 hover:bg-gray-300 text-gray-700';
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`py-2 px-3 text-sm rounded-md flex items-center gap-1.5 transition-all duration-200 ${getButtonStyle()} shadow-sm`}
    >
      {label}
    </motion.button>
  );
}
