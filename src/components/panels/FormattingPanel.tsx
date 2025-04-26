import { FiBold, FiItalic, FiUnderline, FiAlignLeft, FiAlignRight, FiList, FiCode } from 'react-icons/fi';
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
    <div className={`overflow-hidden ${isDark ? 'bg-gray-800 bg-opacity-80 backdrop-blur-sm border-gray-700' : 'bg-white bg-opacity-80 backdrop-blur-sm border-gray-200'} border-x border-b`}>
      <div className="p-4 flex flex-wrap gap-3">
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
        <span className="border-r h-6 mx-1 border-gray-300 dark:border-gray-700"></span>
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
      className={`p-2.5 rounded-md transition-all duration-200 ${
        isDark 
          ? 'hover:bg-gray-700 bg-gray-750 text-gray-200' 
          : 'hover:bg-gray-200 bg-gray-100 text-gray-700'
      } shadow-sm`}
    >
      {icon}
    </motion.button>
  );
}
