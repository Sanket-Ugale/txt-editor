'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useHotkeys } from 'react-hotkeys-hook';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jsPDF } from 'jspdf';
import { 
  FiBold, FiItalic, FiUnderline, FiAlignLeft, 
  FiAlignRight, FiList, FiClipboard, 
  FiDownload, FiSun, FiMoon, FiSettings, FiSearch,
  FiGithub, FiTrash2, FiPlus, FiMinus, FiType, FiCode
} from 'react-icons/fi';
import { useLocalStorageValue } from '@react-hookz/web';

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
    defaultValue: 'Inter'
  });
  const fontFamily = fontFamilyStorage.value ?? 'Inter';
  const setFontFamily = fontFamilyStorage.set;
  
  const [showSettings, setShowSettings] = useState(false);
  const [showFormatting, setShowFormatting] = useState(false);
  const [, setSelection] = useState({ start: 0, end: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [replaceQuery, setReplaceQuery] = useState('');
  const [lastSaved, setLastSaved] = useState(new Date());
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Font family options
  const fontOptions = [
    { value: 'Inter', label: 'Inter' },
    { value: 'Arial', label: 'Arial' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'monospace', label: 'Monospace' },
    { value: 'Courier New', label: 'Courier New' },
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
    downloadText();
    toast.success('Document saved!');
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
      setSelection({
        start: editorRef.current.selectionStart,
        end: editorRef.current.selectionEnd
      });
    }
  };

  // Undo functionality
  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previous = undoStack[0];
      setUndoStack(prev => prev.slice(1)); // Remove first item
      setRedoStack(prev => [text, ...prev]); // Add current text to redo stack
      setText(previous);
    }
  };

  // Redo functionality
  const handleRedo = () => {
    if (redoStack.length > 0) {
      const next = redoStack[0];
      setRedoStack(prev => prev.slice(1)); // Remove first item
      setUndoStack(prev => [text, ...prev]); // Add current text to undo stack
      setText(next);
    }
  };

  // Clear text functionality with confirmation
  const clearText = () => {
    // Add current text to undo stack before clearing
    setUndoStack(prev => [text, ...prev.slice(0, 19)]);
    setText('');
    toast.info('Text cleared');
  };

  // Download text as .txt file
  const downloadText = () => {
    const element = document.createElement('a');
    const file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${fileName || 'texteditor-note'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Downloaded as TXT');
  };

  // Export as PDF functionality
  const exportAsPDF = async () => {
    try {
      toast.info('Preparing PDF...', { autoClose: false, toastId: 'pdf-processing' });
      
      // Create a new jsPDF instance
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      // Set PDF properties
      pdf.setProperties({
        title: fileName || 'Text Editor Document',
        subject: 'Document created with Text Editor',
        creator: 'Text Editor',
        author: 'Text Editor User',
        keywords: 'text, document'
      });
      
      // Always use black text for better readability regardless of theme
      pdf.setTextColor(0, 0, 0);
      
      // Add title to PDF
      pdf.setFontSize(20);
      pdf.text(fileName || 'Untitled Document', 20, 20);
      
      // Add a line under the title - use dark gray for the line
      pdf.setDrawColor(50, 50, 50);
      pdf.line(20, 23, 190, 23);
      
      // Font settings for main content
      pdf.setFontSize(fontSize * 0.75); // Scale down font for PDF
      
      // Process text for potential markdown formatting
      // Just extract plain text for now as we want real text in PDF
      const processedText = text;
      
      // Define margins and starting position
      const margin = 20; // 20mm margin
      const startY = 30; // Start 30mm from top (after title)
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const contentWidth = pageWidth - (margin * 2);
      
      // Split text into lines that fit within the page width
      const textLines = pdf.splitTextToSize(processedText, contentWidth);
      
      // Calculate number of lines that fit on one page
      const lineHeight = fontSize * 0.3527; // Convert pt to mm (1pt = 0.3527mm)
      
      // Add text to pages
      let currentPage = 0;
      let y = startY;
      
      for (let i = 0; i < textLines.length; i++) {
        // If we've reached the bottom margin or first line of a new page
        if (y > pageHeight - margin || 
            (currentPage > 0 && y === startY)) {
          pdf.addPage();
          currentPage++;
          y = startY;
        }
        
        // Add the text line
        pdf.text(textLines[i], margin, y);
        y += lineHeight;
      }
      
      // Save the PDF
      pdf.save(`${fileName || 'texteditor-note'}.pdf`);
      
      // Close the toast and show success message
      toast.dismiss('pdf-processing');
      toast.success('Downloaded as PDF with selectable text');
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast.dismiss('pdf-processing');
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  // Export as Markdown functionality
  const exportAsMarkdown = () => {
    const element = document.createElement('a');
    const file = new Blob([text], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = `${fileName || 'texteditor-note'}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Downloaded as Markdown');
  };

  // Copy to clipboard functionality
  const copyToClipboard = () => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Text copied to clipboard!');
    }, (err) => {
      console.error('Could not copy text: ', err);
      toast.error('Failed to copy text');
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
    const newText = text;
    let pos = -1;
    
    while ((pos = newText.indexOf(searchQuery, pos + 1)) !== -1) {
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

  // Calculate statistics
  const getStatistics = () => {
    const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
    const chars = text.length;
    const lines = text.split('\n').length;
    
    return { words, chars, lines };
  };

  if (!mounted) return null;

  const currentTheme = theme === 'system' ? resolvedTheme : theme;
  const isDark = currentTheme === 'dark';
  const stats = getStatistics();
  const formattedTime = lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <main 
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-800'
      }`} 
      dir="ltr"
    >
      <div className="container mx-auto py-4 px-4 max-w-5xl">
        {/* Header */}
        <header className={`w-full py-3 px-6 rounded-t-xl ${
          isDark ? 'bg-gray-800' : 'bg-white'
        } shadow-md flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-blue-500 text-white">
              <FiType className="h-5 w-5" />
            </div>
            <div>
              <input 
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className={`font-medium text-lg px-2 py-1 rounded border ${
                  isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto max-w-[200px]`}
                placeholder="Untitled Document"
              />
              <div className="text-xs text-gray-500 ml-2 mt-0.5">
                Last saved at {formattedTime}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              onClick={() => setShowSearch(prev => !prev)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700'
              } ${showSearch ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
              title="Search (Ctrl+F)"
            >
              <FiSearch className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowFormatting(prev => !prev)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700'
              } ${showFormatting ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
              title="Formatting Options"
            >
              <FiBold className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowSettings(prev => !prev)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700'
              } ${showSettings ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
              title="Settings"
            >
              <FiSettings className="h-4 w-4" />
            </button>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
            </button>
            <a
              href="https://github.com/yourusername/txt-editor"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700'
              }`}
              title="View on GitHub"
            >
              <FiGithub className="h-4 w-4" />
            </a>
          </div>
        </header>
        
        {/* Search Panel - conditionally rendered */}
        {showSearch && (
          <div className={`p-3 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-x border-b`}>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className={`w-full px-3 py-2 rounded text-sm ${
                    isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                  } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  value={replaceQuery}
                  onChange={(e) => setReplaceQuery(e.target.value)}
                  placeholder="Replace with..."
                  className={`w-full px-3 py-2 rounded text-sm ${
                    isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                  } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSearch}
                  className={`px-3 py-2 rounded text-sm ${
                    isDark ? 'bg-blue-800 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  Find
                </button>
                <button
                  onClick={handleReplace}
                  className={`px-3 py-2 rounded text-sm ${
                    isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-600 hover:bg-gray-700 text-white'
                  }`}
                >
                  Replace
                </button>
                <button
                  onClick={handleReplaceAll}
                  className={`px-3 py-2 rounded text-sm ${
                    isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-600 hover:bg-gray-700 text-white'
                  }`}
                >
                  Replace All
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Formatting Toolbar - conditionally rendered */}
        {showFormatting && (
          <div className={`p-3 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-x border-b flex flex-wrap gap-2`}>
            <button 
              onClick={() => applyFormatting('bold')}
              title="Bold (Ctrl+B)"
              className={`p-2 rounded ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            >
              <FiBold className="h-4 w-4" />
            </button>
            <button 
              onClick={() => applyFormatting('italic')}
              title="Italic (Ctrl+I)"
              className={`p-2 rounded ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            >
              <FiItalic className="h-4 w-4" />
            </button>
            <button 
              onClick={() => applyFormatting('underline')}
              title="Underline (Ctrl+U)"
              className={`p-2 rounded ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            >
              <FiUnderline className="h-4 w-4" />
            </button>
            <button 
              onClick={() => applyFormatting('code')}
              title="Code"
              className={`p-2 rounded ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            >
              <FiCode className="h-4 w-4" />
            </button>
            <button 
              onClick={() => applyFormatting('list')}
              title="List"
              className={`p-2 rounded ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            >
              <FiList className="h-4 w-4" />
            </button>
            <span className="border-r h-6 mx-1 border-gray-300 dark:border-gray-700"></span>
            <button 
              onClick={indentText}
              title="Indent"
              className={`p-2 rounded ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            >
              <FiAlignRight className="h-4 w-4" />
            </button>
            <button 
              onClick={outdentText}
              title="Outdent"
              className={`p-2 rounded ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            >
              <FiAlignLeft className="h-4 w-4" />
            </button>
          </div>
        )}
        
        {/* Settings Panel - conditionally rendered */}
        {showSettings && (
          <div className={`p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-x border-b`}>
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Font Size</label>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                    className={`p-1 rounded ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                  >
                    <FiMinus className="h-4 w-4" />
                  </button>
                  <span className="text-sm w-6 text-center">{fontSize}</span>
                  <button 
                    onClick={() => setFontSize(Math.min(32, fontSize + 2))}
                    className={`p-1 rounded ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                  >
                    <FiPlus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Font Family</label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className={`px-2 py-1 rounded ${
                    isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-200 border-gray-300'
                  } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  {fontOptions.map(font => (
                    <option key={font.value} value={font.value}>{font.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handleUndo}
                  disabled={undoStack.length === 0}
                  className={`py-2 px-3 text-sm rounded flex items-center gap-1 ${
                    isDark 
                      ? undoStack.length === 0 ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600'
                      : undoStack.length === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                  title="Undo (Ctrl+Z)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 7v6h6"></path>
                    <path d="M3 13c0-4.97 4.03-9 9-9a9 9 0 0 1 9 9c0 4.97-4.03 9-9 9a9 9 0 0 1-8-5"></path>
                  </svg>
                  Undo
                </button>
                <button
                  onClick={handleRedo}
                  disabled={redoStack.length === 0}
                  className={`py-2 px-3 text-sm rounded flex items-center gap-1 ${
                    isDark 
                      ? redoStack.length === 0 ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600'
                      : redoStack.length === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                  title="Redo (Ctrl+Y)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 7v6h-6"></path>
                    <path d="M21 13c0-4.97-4.03-9-9-9a9 9 0 0 0-9 9c0 4.97 4.03 9 9 9a9 9 0 0 0 8-5"></path>
                  </svg>
                  Redo
                </button>
                <span className="border-r h-8 mx-1 border-gray-300 dark:border-gray-700"></span>
                <button
                  onClick={clearText}
                  className={`py-2 px-3 text-sm rounded flex items-center gap-1 ${
                    isDark ? 'bg-red-900 hover:bg-red-800 text-white' : 'bg-red-100 hover:bg-red-200 text-red-700'
                  }`}
                >
                  <FiTrash2 className="h-4 w-4" />
                  Clear
                </button>
                <button
                  onClick={copyToClipboard}
                  className={`py-2 px-3 text-sm rounded flex items-center gap-1 ${
                    isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  <FiClipboard className="h-4 w-4" />
                  Copy
                </button>
                <div className="relative group">
                  <button
                    className={`py-2 px-3 text-sm rounded flex items-center gap-1 ${
                      isDark ? 'bg-blue-900 hover:bg-blue-800 text-white' : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                    }`}
                  >
                    <FiDownload className="h-4 w-4" />
                    Export
                  </button>
                  <div className={`absolute z-10 right-0 mt-1 w-48 rounded-md shadow-lg py-1 ${
                    isDark ? 'bg-gray-800' : 'bg-white'
                  } ring-1 ring-black ring-opacity-5 hidden group-hover:block`}>
                    <button
                      onClick={downloadText}
                      className={`block px-4 py-2 text-sm w-full text-left ${
                        isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Download as TXT
                    </button>
                    <button
                      onClick={exportAsMarkdown}
                      className={`block px-4 py-2 text-sm w-full text-left ${
                        isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Download as Markdown
                    </button>
                    <button
                      onClick={exportAsPDF}
                      className={`block px-4 py-2 text-sm w-full text-left ${
                        isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Download as PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Editor Area */}
        <div 
          className={`rounded-b-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-colors duration-300 overflow-hidden`}
          style={{ minHeight: '70vh' }}
          ref={contentRef}
        >
          <textarea
            ref={editorRef}
            value={text}
            onChange={handleTextChange}
            onSelect={handleSelect}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`w-full h-full p-6 outline-none transition-all duration-300 resize-none ${
              isDark ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'
            } ${isFocused ? isDark ? 'ring-2 ring-blue-500' : 'ring-2 ring-blue-400' : ''}`}
            style={{ 
              fontSize: `${fontSize}px`,
              lineHeight: '1.6',
              fontFamily: fontFamily,
              minHeight: '70vh'
            }}
            dir="ltr"
            placeholder="Start typing here..."
            spellCheck="true"
          ></textarea>
        </div>
        
        {/* Status Bar */}
        <div className={`mt-4 p-2 rounded-lg flex flex-wrap justify-between items-center text-sm ${
          isDark ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'
        } shadow-sm`}>
          <div className="flex gap-4">
            <div>{stats.words} words</div>
            <div>{stats.chars} characters</div>
            <div>{stats.lines} lines</div>
          </div>
          <div className="flex items-center">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2"></span>
            Auto-saved at {formattedTime}
          </div>
        </div>

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
      </div>
    </main>
  );
}