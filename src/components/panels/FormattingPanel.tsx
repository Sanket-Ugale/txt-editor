import { FiBold, FiItalic, FiUnderline, FiAlignLeft, FiAlignRight, FiList, FiCode, FiEdit } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface FormattingPanelProps {
  applyFormatting: (format: 'bold' | 'italic' | 'underline' | 'code' | 'list') => void;
  indentText: () => void;
  outdentText: () => void;
  isDark: boolean;
}

export default function FormattingPanel({
  applyFormatting,
  indentText,
  outdentText,
  isDark
}: FormattingPanelProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`overflow-hidden ${
        isDark ? 'bg-black-800 bg-opacity-90 backdrop-blur-sm border-black-700' : 'bg-white bg-opacity-90 backdrop-blur-sm border-black-200'
      } border rounded-lg shadow-lg mx-4 mb-2`}
    >
      <div className="p-3 flex items-center">
        <div className="flex items-center gap-2 text-blue-500 mr-4">
          <FiEdit className="h-4 w-4" />
          <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-black-700'}`}>Formatting Tools</span>
        </div>
        
        <div className="grid grid-flow-col auto-cols-max gap-1">
          <div className={`flex bg-opacity-50 rounded-lg p-1 ${isDark ? 'bg-black-700' : 'bg-black-100'}`}>
            <FormatButton 
              onClick={() => applyFormatting('bold')} 
              icon={<FiBold />} 
              title="Bold (Ctrl+B)"
              isDark={isDark}
            />
            <FormatButton 
              onClick={() => applyFormatting('italic')} 
              icon={<FiItalic />} 
              title="Italic (Ctrl+I)"
              isDark={isDark}
            />
            <FormatButton 
              onClick={() => applyFormatting('underline')} 
              icon={<FiUnderline />} 
              title="Underline (Ctrl+U)"
              isDark={isDark}
            />
          </div>
          
          <div className={`flex bg-opacity-50 rounded-lg p-1 ${isDark ? 'bg-black-700' : 'bg-black-100'}`}>
            <FormatButton 
              onClick={() => applyFormatting('code')} 
              icon={<FiCode />} 
              title="Code"
              isDark={isDark}
            />
            <FormatButton 
              onClick={() => applyFormatting('list')} 
              icon={<FiList />} 
              title="List"
              isDark={isDark}
            />
          </div>
          
          <div className={`flex bg-opacity-50 rounded-lg p-1 ${isDark ? 'bg-black-700' : 'bg-black-100'}`}>
            <FormatButton 
              onClick={indentText} 
              icon={<FiAlignRight />} 
              title="Indent"
              isDark={isDark}
            />
            <FormatButton 
              onClick={outdentText} 
              icon={<FiAlignLeft />} 
              title="Outdent"
              isDark={isDark}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface FormatButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  isDark: boolean;
}

function FormatButton({ onClick, icon, title, isDark }: FormatButtonProps) {
  return (
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      title={title}
      className={`p-2 rounded-md transition-all duration-200 btn-hover-effect ${
        isDark 
          ? 'hover:bg-black-600 text-black-300 hover:text-white' 
          : 'hover:bg-black-200 text-black-700 hover:text-black-900'
      }`}
    >
      {icon}
    </motion.button>
  );
}
