import { motion } from 'framer-motion';

interface WelcomeModalProps {
  isDark: boolean;
  onClose: () => void;
}

export default function WelcomeModal({ isDark, onClose }: WelcomeModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
    >
      <motion.div 
        className={`relative max-w-md w-full rounded-xl p-6 ${isDark ? 'bg-black-800' : 'bg-white'} shadow-2xl`}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold">Welcome to TextEditor Pro 👋</h2>
          <button 
            onClick={onClose}
            className="text-black-500 hover:text-black-800 dark:hover:text-black-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          <p>Here are some quick tips to get you started:</p>
          
          <div className="grid grid-cols-2 gap-3 my-4">
            <div className={`p-3 rounded-lg ${isDark ? 'bg-black-700' : 'bg-black-100'}`}>
              <div className="font-medium mb-1">Formatting</div>
              <p className="text-sm opacity-80">Use the formatting toolbar or keyboard shortcuts to style your text</p>
            </div>
            
            <div className={`p-3 rounded-lg ${isDark ? 'bg-black-700' : 'bg-black-100'}`}>
              <div className="font-medium mb-1">Auto-save</div>
              <p className="text-sm opacity-80">Your work is automatically saved as you type</p>
            </div>
            
            <div className={`p-3 rounded-lg ${isDark ? 'bg-black-700' : 'bg-black-100'}`}>
              <div className="font-medium mb-1">Dark Mode</div>
              <p className="text-sm opacity-80">Toggle between light and dark themes with the sun/moon icon</p>
            </div>
            
            <div className={`p-3 rounded-lg ${isDark ? 'bg-black-700' : 'bg-black-100'}`}>
              <div className="font-medium mb-1">Export Options</div>
              <p className="text-sm opacity-80">Download your work as TXT, Markdown, or PDF</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className={`w-full py-2 px-4 rounded-md ${
              isDark ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-500 hover:bg-blue-600'
            } text-white font-medium transition-colors duration-200`}
          >
            Get Started
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
