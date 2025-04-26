import React, { RefObject } from 'react';

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
    <div 
      className={`rounded-b-xl relative z-editor ${
        isDark 
          ? 'bg-gray-800 bg-opacity-80 backdrop-blur-sm border border-gray-700' 
          : 'bg-white bg-opacity-80 backdrop-blur-sm border border-gray-200'
      } shadow-xl transition-colors duration-300 overflow-hidden`}
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
          isDark ? 'bg-transparent text-gray-200' : 'bg-transparent text-gray-800'
        } ${isFocused ? isDark ? 'ring-2 ring-blue-500' : 'ring-2 ring-blue-400' : ''} placeholder-gray-500`}
        style={{ 
          fontSize: `${fontSize}px`,
          lineHeight: '1.7',
          fontFamily: fontFamily,
          minHeight: '70vh'
        }}
        dir="ltr"
        placeholder="Start typing here..."
        spellCheck="true"
      ></textarea>
    </div>
  );
}
