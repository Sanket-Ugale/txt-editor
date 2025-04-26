import React, { RefObject } from 'react';
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
      
      <textarea
        ref={editorRef}
        value={text}
        onChange={handleTextChange}
        onSelect={handleSelect}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full h-full p-8 outline-none transition-all duration-300 resize-none ${
          isDark ? 'bg-transparent text-white' : 'bg-transparent text-black-800'
        } placeholder-black-500`}
        style={{ 
          fontSize: `${fontSize}px`,
          lineHeight: '1.8',
          fontFamily: fontFamily,
          minHeight: '70vh'
        }}
        dir="ltr"
        placeholder="Start typing here..."
        spellCheck="true"
      ></textarea>
    </motion.div>
  );
}
