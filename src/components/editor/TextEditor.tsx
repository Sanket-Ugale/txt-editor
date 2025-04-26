import React, { RefObject, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TextEditorProps {
  text: string;
  handleTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSelect: () => void;
  editorRef: RefObject<HTMLTextAreaElement>;
  contentRef: RefObject<HTMLDivElement>;
  isFocused: boolean;
  setIsFocused: (focused: boolean) => void;
  fontSize: number;
  fontFamily: string;
  isDark: boolean;
}

export default function TextEditor({
  text,
  handleTextChange,
  handleSelect,
  editorRef,
  contentRef,
  isFocused,
  setIsFocused,
  fontSize,
  fontFamily,
  isDark
}: TextEditorProps) {
  // State for formatted content
  const [formattedHtml, setFormattedHtml] = useState<string>('');

  // Parse and format text for visual display while keeping raw text for export
  useEffect(() => {
    // Format text for visual display (convert markdown-style formatting to HTML)
    const formatText = (rawText: string) => {
      const formatted = rawText
        // Format bold text (**text**)
        .replace(/\*\*(.*?)\*\*/g, '<span class="font-bold">$1</span>')
        // Format italic text (*text*)
        .replace(/\*(.*?)\*/g, '<span class="italic">$1</span>')
        // Format underlined text (_text_)
        .replace(/_(.*?)_/g, '<span class="underline">$1</span>')
        // Format code text (`text`)
        .replace(/`(.*?)`/g, '<span class="font-mono bg-opacity-20 px-1 rounded bg-gray-500">$1</span>')
        // Convert newlines to line breaks
        .replace(/\n/g, '<br>');
      
      return formatted;
    };
    
    setFormattedHtml(formatText(text));
  }, [text]);

  // Sync scroll between the textarea and formatted view
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const formattedDiv = document.getElementById('formatted-view');
    if (formattedDiv) {
      formattedDiv.scrollTop = textarea.scrollTop;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-xl relative z-editor ${
        isDark 
          ? 'bg-black-800 bg-opacity-90 backdrop-blur-sm border border-black-700' 
          : 'bg-white bg-opacity-95 backdrop-blur-sm border border-black-200'
      } shadow-2xl transition-colors duration-300 overflow-hidden mx-4 mb-4`}
      style={{ minHeight: '70vh' }}
      ref={contentRef}
    >
      <div className={`absolute inset-0 pointer-events-none ${isFocused ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
        <div className={`absolute inset-0 ${
          isDark ? 'bg-blue-500' : 'bg-blue-400'
        } opacity-5 rounded-xl`}></div>
        <div className={`absolute inset-0 border-2 ${
          isDark ? 'border-blue-500' : 'border-blue-400'
        } rounded-xl`}></div>
      </div>
      
      {/* Formatted text display (visual only, no editing) */}
      <div 
        id="formatted-view"
        className={`absolute inset-0 p-8 pointer-events-none overflow-auto whitespace-pre-wrap ${
          isDark ? 'text-white' : 'text-black-800'
        }`}
        style={{ 
          fontSize: `${fontSize}px`,
          lineHeight: '1.8',
          fontFamily: fontFamily,
          visibility: text ? 'visible' : 'hidden'
        }}
        dangerouslySetInnerHTML={{ __html: formattedHtml }}
      />
      
      {/* Actual textarea for editing (invisible but receives input) */}
      <textarea
        ref={editorRef}
        value={text}
        onChange={handleTextChange}
        onSelect={handleSelect}
        onScroll={handleScroll}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full h-full p-8 outline-none transition-all duration-300 resize-none ${
          isDark ? 'bg-transparent text-transparent' : 'bg-transparent text-transparent'
        } placeholder-black-500 caret-current`}
        style={{ 
          fontSize: `${fontSize}px`,
          lineHeight: '1.8',
          fontFamily: fontFamily,
          minHeight: '70vh',
          caretColor: isDark ? 'white' : 'black'
        }}
        dir="ltr"
        placeholder="Start typing here..."
        spellCheck="true"
      ></textarea>
    </motion.div>
  );
}
