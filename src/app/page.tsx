'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useHotkeys } from 'react-hotkeys-hook';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocalStorageValue } from '@react-hookz/web';
import { motion, AnimatePresence } from 'framer-motion';

// Import components
import Header from '@/components/layout/Header';
import SearchPanel from '@/components/panels/SearchPanel';
import FormattingPanel from '@/components/panels/FormattingPanel';
import SettingsPanel from '@/components/panels/SettingsPanel';
import TextEditor from '@/components/editor/TextEditor';
import StatusBar from '@/components/layout/StatusBar';
import WelcomeModal from '@/components/modals/WelcomeModal';

// Import utilities
import { getTextStatistics, downloadAsText, downloadAsMarkdown, downloadAsPDF, downloadAsHtml, downloadAsWord, downloadAsImage, PdfPageSize, PdfOrientation } from '@/utils/editorUtils';

export default function Home() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Use correct type for useLocalStorageValue
  const textStorage = useLocalStorageValue<string>('editorText', {
    defaultValue: 'Start typing here...'
  });
  const text = textStorage.value ?? 'Start typing here...';
  const setText = textStorage.set;
  
  const fileNameStorage = useLocalStorageValue<string>('fileName', {
    defaultValue: 'Untitled Document'
  });
  const fileName = fileNameStorage.value ?? 'Untitled Document';
  const setFileName = fileNameStorage.set;
  
  const [isFocused, setIsFocused] = useState(false);
  
  const fontSizeStorage = useLocalStorageValue<number>('fontSize', {
    defaultValue: 16
  });
  const fontSize = fontSizeStorage.value ?? 16;
  const setFontSize = fontSizeStorage.set;
  
  const fontFamilyStorage = useLocalStorageValue<string>('fontFamily', {
    defaultValue: 'var(--font-inter)'
  });
  const fontFamily = fontFamilyStorage.value ?? 'var(--font-inter)';
  const setFontFamily = fontFamilyStorage.set;
  
  const [showSettings, setShowSettings] = useState(false);
  const [showFormatting, setShowFormatting] = useState(false);
  // Selection state is used in handleSelect but can be removed if not needed elsewhere
  // Commenting out to fix the unused variable error
  // const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [replaceQuery, setReplaceQuery] = useState('');
  const [lastSaved, setLastSaved] = useState(new Date());
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const editorRef = useRef<HTMLTextAreaElement>(null!) as React.RefObject<HTMLTextAreaElement>;
  // Make contentRef non-nullable to match expected type in TextEditor component
  const contentRef = useRef<HTMLDivElement>(null!) as React.RefObject<HTMLDivElement>;
  const [welcomeModal, setWelcomeModal] = useState(false);

  // Font family options - now using custom loaded fonts
  const fontOptions = [
    { value: 'var(--font-inter)', label: 'Inter' },
    { value: 'var(--font-poppins)', label: 'Poppins' },
    { value: 'var(--font-roboto-mono)', label: 'Roboto Mono' },
    { value: 'Arial', label: 'Arial' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Times New Roman', label: 'Times New Roman' },
  ];

  // Wait for component to mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    
    // Force the theme once on initial load
    const currentTheme = localStorage.getItem('theme') || 'light';
    setTheme(currentTheme);
    
    // Apply theme class directly to document element
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }

    // Save initial state to undo stack if not already there
    if (undoStack.length === 0 && text) {
      setUndoStack([text]);
    }

    // Show welcome modal for new users
    const hasVisited = localStorage.getItem('visited');
    if (!hasVisited) {
      setWelcomeModal(true);
      localStorage.setItem('visited', 'true');
    }
  }, [setTheme, text, undoStack.length]);

  // Update theme whenever it changes
  useEffect(() => {
    if (!mounted) return;

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.documentElement.style.backgroundColor = '#121212';
      document.body.style.backgroundColor = '#121212';
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      document.documentElement.style.backgroundColor = '#f9fafb';
      document.body.style.backgroundColor = '#f9fafb';
    }
  }, [theme, mounted]);

  // Save text changes with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (text !== undoStack[0]) {
        setLastSaved(new Date());
      }
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [text, undoStack]);

  // Register keyboard shortcuts
  useHotkeys('ctrl+s, cmd+s', (e) => {
    e.preventDefault();
    handleDownloadText();
    toast.success('Document saved!', {
      icon: () => <span>💾</span>,
      position: 'bottom-center'
    });
  });

  useHotkeys('ctrl+f, cmd+f', (e) => {
    e.preventDefault();
    setShowSearch(true);
  });

  useHotkeys('ctrl+z, cmd+z', (e) => {
    e.preventDefault();
    handleUndo();
  });

  useHotkeys('ctrl+y, cmd+shift+z', (e) => {
    e.preventDefault();
    handleRedo();
  });

  useHotkeys('ctrl+b, cmd+b', (e) => {
    e.preventDefault();
    applyFormatting('bold');
  });

  useHotkeys('ctrl+i, cmd+i', (e) => {
    e.preventDefault();
    applyFormatting('italic');
  });

  useHotkeys('ctrl+u, cmd+u', (e) => {
    e.preventDefault();
    applyFormatting('underline');
  });

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    // Visual feedback for theme change
    toast.info(`${newTheme === 'dark' ? 'Dark' : 'Light'} mode activated`, {
      icon: () => (
        <span role="img" aria-label="theme icon">
          {newTheme === 'dark' ? '🌙' : '☀️'}
        </span>
      ),
      position: 'bottom-center',
      autoClose: 1500
    });
  };

  // Handle text change and save to undo stack
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    
    // Save current text to undo stack if it's different
    if (newText !== text) {
      setUndoStack(prev => [text, ...prev.slice(0, 19)]); // Keep last 20 states
      setRedoStack([]); // Clear redo stack on new change
    }
    
    setText(newText);
  };
  
  // Track selection changes
  const handleSelect = () => {
    if (editorRef.current) {
      
      
      // We can use these values directly here if needed
      // console.log(`Selection: ${selectionStart} to ${selectionEnd}`);
    }
  };

  // Undo functionality
  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previous = undoStack[0];
      setUndoStack(prev => prev.slice(1)); // Remove first item
      setRedoStack(prev => [text, ...prev]); // Add current text to redo stack
      setText(previous);
      
      toast.info('Undo action', {
        position: 'bottom-center',
        autoClose: 1000,
        hideProgressBar: true,
        icon: () => <span>⏪</span>
      });
    }
  };

  // Redo functionality
  const handleRedo = () => {
    if (redoStack.length > 0) {
      const next = redoStack[0];
      setRedoStack(prev => prev.slice(1)); // Remove first item
      setUndoStack(prev => [text, ...prev]); // Add current text to undo stack
      setText(next);
      
      toast.info('Redo action', {
        position: 'bottom-center',
        autoClose: 1000,
        hideProgressBar: true,
        icon: () => <span>⏩</span>
      });
    }
  };

  // Clear text functionality with confirmation
  const clearText = () => {
    // Add current text to undo stack before clearing
    setUndoStack(prev => [text, ...prev.slice(0, 19)]);
    setText('');
    toast.info('Text cleared', { icon: () => <span>🧹</span> });
  };

  // Download text as .txt file
  const handleDownloadText = () => {
    console.log("handleDownloadText called with:", text, fileName);
    try {
      downloadAsText(text, fileName);
      
      // Visual feedback animation using toast
      toast.success('Downloaded as TXT', { 
        icon: () => <span>📄</span>,
        position: 'bottom-center'
      });
      console.log("Text download completed successfully");
    } catch (error) {
      console.error("Error in text download:", error);
      toast.error('Failed to download as text', {
        icon: () => <span>❌</span>,
        position: 'bottom-center'
      });
    }
  };

  // Export as PDF functionality
  const handleExportAsPDF = async (pageSize?: PdfPageSize, orientation?: PdfOrientation) => {
    console.log("handleExportAsPDF called with:", text, fileName, fontSize, pageSize, orientation);
    try {
      await downloadAsPDF(text, fileName, fontSize, pageSize, orientation);
      console.log("PDF export completed successfully");
    } catch (error) {
      console.error("Error in PDF export:", error);
      toast.error('Failed to export as PDF', {
        icon: () => <span>❌</span>,
        position: 'bottom-center'
      });
    }
  };

  // Export as Markdown functionality
  const handleExportAsMarkdown = () => {
    console.log("handleExportAsMarkdown called with:", text, fileName);
    try {
      downloadAsMarkdown(text, fileName);
      
      toast.success('Downloaded as Markdown', {
        icon: () => <span>📝</span>,
        position: 'bottom-center'
      });
      console.log("Markdown export completed successfully");
    } catch (error) {
      console.error("Error in Markdown export:", error);
      toast.error('Failed to export as Markdown', {
        icon: () => <span>❌</span>,
        position: 'bottom-center'
      });
    }
  };

  // Export as HTML functionality
  const handleExportAsHtml = () => {
    console.log("handleExportAsHtml called with:", text, fileName);
    try {
      downloadAsHtml(text, fileName);
      console.log("HTML export completed successfully");
    } catch (error) {
      console.error("Error in HTML export:", error);
      toast.error('Failed to export as HTML', {
        icon: () => <span>❌</span>,
        position: 'bottom-center'
      });
    }
  };

  // Export as Word functionality
  const handleExportAsWord = () => {
    console.log("handleExportAsWord called with:", text, fileName);
    try {
      downloadAsWord(text, fileName);
      console.log("Word export completed successfully");
    } catch (error) {
      console.error("Error in Word export:", error);
      toast.error('Failed to export as Word', {
        icon: () => <span>❌</span>,
        position: 'bottom-center'
      });
    }
  };

  // Export as Image functionality
  const handleExportAsImage = () => {
    console.log("handleExportAsImage called with contentRef and fileName:", fileName);
    if (!contentRef.current) {
      console.error("ContentRef is null");
      toast.error('Could not capture the editor content');
      return;
    }
    try {
      downloadAsImage(contentRef, fileName);
      console.log("Image export completed successfully");
    } catch (error) {
      console.error("Error in Image export:", error);
      toast.error('Failed to export as image', {
        icon: () => <span>❌</span>,
        position: 'bottom-center'
      });
    }
  };

  // Copy to clipboard functionality
  const copyToClipboard = () => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Text copied to clipboard!', {
        icon: () => <span>📋</span>,
        position: 'bottom-center'
      });
    }, (err) => {
      console.error('Could not copy text: ', err);
      toast.error('Failed to copy text', {
        icon: () => <span>❌</span>
      });
    });
  };

  // Format selected text
  const applyFormatting = (format: 'bold' | 'italic' | 'underline' | 'code' | 'list') => {
    if (!editorRef.current) return;
    
    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    if (start === end) return; // No selection
    
    const selectedText = text.substring(start, end);
    let formattedText = '';
    
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `_${selectedText}_`;
        break;
      case 'code':
        formattedText = `\`${selectedText}\``;
        break;
      case 'list':
        formattedText = selectedText
          .split('\n')
          .map((line: string) => `- ${line}`)
          .join('\n');
        break;
    }
    
    // Update text with formatting
    const newText = text.substring(0, start) + formattedText + text.substring(end);
    
    // Add to undo stack
    setUndoStack(prev => [text, ...prev.slice(0, 19)]);
    setText(newText);
    
    // Visual feedback
    const formatNames = {
      bold: 'Bold',
      italic: 'Italic',
      underline: 'Underlined',
      code: 'Code',
      list: 'List'
    };
    
    toast.info(`Applied ${formatNames[format]} formatting`, {
      position: 'bottom-center',
      autoClose: 1000,
      hideProgressBar: true
    });
    
    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + formattedText.length);
    }, 0);
  };

  // Indent text functionality
  const indentText = () => {
    if (!editorRef.current) return;
    
    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    // Get selected text lines
    const selectedText = text.substring(start, end);
    const lines = selectedText.split('\n');
    
    // Add indentation to each line
    const indentedText = lines.map((line: string) => `  ${line}`).join('\n');
    
    // Update text with indentation
    const newText = text.substring(0, start) + indentedText + text.substring(end);
    
    // Add to undo stack
    setUndoStack(prev => [text, ...prev.slice(0, 19)]);
    setText(newText);
    
    // Visual feedback
    toast.info('Text indented', {
      position: 'bottom-center',
      autoClose: 1000,
      hideProgressBar: true
    });
    
    // Restore focus
    setTimeout(() => {
      textarea.focus();
    }, 0);
  };

  // Outdent text functionality
  const outdentText = () => {
    if (!editorRef.current) return;
    
    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    // Get selected text lines
    const selectedText = text.substring(start, end);
    const lines = selectedText.split('\n');
    
    // Remove indentation from each line
    const outdentedText = lines
      .map((line: string) => line.startsWith('  ') ? line.substring(2) : line)
      .join('\n');
    
    // Update text with removed indentation
    const newText = text.substring(0, start) + outdentedText + text.substring(end);
    
    // Add to undo stack
    setUndoStack(prev => [text, ...prev.slice(0, 19)]);
    setText(newText);
    
    // Visual feedback
    toast.info('Text outdented', {
      position: 'bottom-center',
      autoClose: 1000,
      hideProgressBar: true
    });
    
    // Restore focus
    setTimeout(() => {
      textarea.focus();
    }, 0);
  };

  // Search functionality
  const handleSearch = () => {
    if (!searchQuery.trim() || !editorRef.current) return;
    
    const textarea = editorRef.current;
    const searchStart = textarea.selectionEnd;
    const index = text.indexOf(searchQuery, searchStart);
    
    if (index !== -1) {
      textarea.focus();
      textarea.setSelectionRange(index, index + searchQuery.length);
    } else {
      // Try from the beginning
      const fromStartIndex = text.indexOf(searchQuery);
      if (fromStartIndex !== -1) {
        textarea.focus();
        textarea.setSelectionRange(fromStartIndex, fromStartIndex + searchQuery.length);
        toast.info('Search wrapped to beginning');
      } else {
        toast.info(`No matches found for "${searchQuery}"`);
      }
    }
  };

  // Replace functionality
  const handleReplace = () => {
    if (!searchQuery.trim() || !editorRef.current) return;
    
    const textarea = editorRef.current;
    const currentSelection = textarea.selectionStart !== textarea.selectionEnd &&
                            text.substring(textarea.selectionStart, textarea.selectionEnd) === searchQuery;
    
    if (currentSelection) {
      const newText = 
        text.substring(0, textarea.selectionStart) + 
        replaceQuery + 
        text.substring(textarea.selectionEnd);
      
      // Add to undo stack
      setUndoStack(prev => [text, ...prev.slice(0, 19)]);
      setText(newText);
      
      // Update selection
      const newPosition = textarea.selectionStart + replaceQuery.length;
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(newPosition, newPosition);
      }, 0);
    } else {
      // Find and select the next occurrence
      handleSearch();
    }
  };

  // Replace all functionality
  const handleReplaceAll = () => {
    if (!searchQuery.trim()) return;
    
    // Count occurrences
    let count = 0;
    let pos = -1;
    
    while ((pos = text.indexOf(searchQuery, pos + 1)) !== -1) {
      count++;
    }
    
    if (count > 0) {
      // Add to undo stack
      setUndoStack(prev => [text, ...prev.slice(0, 19)]);
      
      // Replace all occurrences
      const updatedText = text.split(searchQuery).join(replaceQuery);
      setText(updatedText);
      toast.success(`Replaced ${count} occurrence${count !== 1 ? 's' : ''}`);
    } else {
      toast.info(`No matches found for "${searchQuery}"`);
    }
  };

  // Function to create a new document
  const createNewDocument = () => {
    if (text !== 'Start typing here...' && text !== '') {
      setUndoStack(prev => [text, ...prev.slice(0, 19)]);
    }
    setText('Start typing here...');
    setFileName('Untitled Document');
    
    toast.success('New document created', {
      icon: () => <span>📄</span>,
      position: 'bottom-center'
    });
  };
  
  if (!mounted) return null;

  const currentTheme = theme === 'system' ? resolvedTheme : theme;
  const isDark = currentTheme === 'dark';
  const stats = getTextStatistics(text);

  return (
    <main 
      className={`min-h-screen transition-all duration-500 ${
        isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200' : 'bg-gradient-to-br from-blue-50 to-gray-100 text-gray-800'
      }`}
    >
      <div className="container mx-auto py-6 px-4 max-w-5xl">
        {/* Header using imported component */}
        <Header 
          fileName={fileName}
          setFileName={setFileName}
          lastSaved={lastSaved}
          isDark={isDark}
          toggleTheme={toggleTheme}
          setShowSearch={setShowSearch}
          setShowFormatting={setShowFormatting}
          setShowSettings={setShowSettings}
          showSearch={showSearch}
          showFormatting={showFormatting}
          showSettings={showSettings}
          createNewDocument={createNewDocument}
        />
        
        {/* Search Panel - conditionally rendered with animation */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <SearchPanel 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                replaceQuery={replaceQuery}
                setReplaceQuery={setReplaceQuery}
                handleSearch={handleSearch}
                handleReplace={handleReplace}
                handleReplaceAll={handleReplaceAll}
                isDark={isDark}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Formatting Panel - conditionally rendered with animation */}
        <AnimatePresence>
          {showFormatting && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <FormattingPanel 
                applyFormatting={applyFormatting}
                indentText={indentText}
                outdentText={outdentText}
                isDark={isDark}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Settings Panel - conditionally rendered with animation */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <SettingsPanel 
                fontSize={fontSize}
                setFontSize={setFontSize}
                fontFamily={fontFamily}
                setFontFamily={setFontFamily}
                fontOptions={fontOptions}
                handleUndo={handleUndo}
                handleRedo={handleRedo}
                undoStack={undoStack}
                redoStack={redoStack}
                clearText={clearText}
                copyToClipboard={copyToClipboard}
                downloadText={handleDownloadText}
                exportAsMarkdown={handleExportAsMarkdown}
                exportAsPDF={handleExportAsPDF}
                exportAsHtml={handleExportAsHtml}
                exportAsWord={handleExportAsWord}
                exportAsImage={handleExportAsImage}
                isDark={isDark}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Text Editor Component */}
        <motion.div 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <TextEditor 
            text={text}
            handleTextChange={handleTextChange}
            handleSelect={handleSelect}
            editorRef={editorRef}
            isFocused={isFocused}
            setIsFocused={setIsFocused}
            fontSize={fontSize}
            fontFamily={fontFamily}
            isDark={isDark}
            contentRef={contentRef}
          />
        </motion.div>
        
        {/* Status Bar Component */}
        <motion.div 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <StatusBar 
            stats={stats}
            lastSaved={lastSaved}
            isDark={isDark}
          />
        </motion.div>

        {/* Toast notifications container */}
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={isDark ? "dark" : "light"}
        />
        
        {/* Welcome Modal */}
        <AnimatePresence>
          {welcomeModal && (
            <WelcomeModal
              isDark={isDark}
              onClose={() => setWelcomeModal(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}