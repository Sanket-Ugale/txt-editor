import { FiMinus, FiPlus, FiTrash2, FiClipboard, FiFilm, FiFileText, FiGlobe, FiImage } from 'react-icons/fi';
import React from 'react';
import { PdfPageSize, PdfOrientation } from '@/utils/editorUtils';

interface SettingsPanelProps {
  fontSize: number;
  setFontSize: (size: number) => void;
  fontFamily: string;
  setFontFamily: (font: string) => void;
  fontOptions: { value: string, label: string }[];
  handleUndo: () => void;
  handleRedo: () => void;
  undoStack: string[];
  redoStack: string[];
  clearText: () => void;
  copyToClipboard: () => void;
  downloadText: () => void;
  exportAsMarkdown: () => void;
  exportAsPDF: (pageSize?: PdfPageSize, orientation?: PdfOrientation) => void;
  exportAsHtml: () => void;
  exportAsWord: () => void;
  exportAsImage: () => void;
  isDark: boolean;
}

export default function SettingsPanel({
  fontSize,
  setFontSize,
  fontFamily,
  setFontFamily,
  fontOptions,
  handleUndo,
  handleRedo,
  undoStack,
  redoStack,
  clearText,
  copyToClipboard,
  downloadText,
  exportAsMarkdown,
  exportAsPDF,
  exportAsHtml,
  exportAsWord,
  exportAsImage,
  isDark
}: SettingsPanelProps) {

  return (
    <div className={`p-5 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-x border-b shadow-inner transition-all duration-300 animate-fadeIn relative z-settings`} style={{ isolation: 'isolate' }}>
      <div className="flex flex-wrap items-center gap-6">
        <div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setFontSize(Math.max(12, fontSize - 2))}
              className={`p-1.5 rounded ${
                isDark 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-200 hover:bg-gray-300'
              } transition-colors duration-200`}
            >
              <FiMinus className="h-4 w-4" />
            </button>
            <span className="text-sm w-6 text-center font-medium">{fontSize}</span>
            <button 
              onClick={() => setFontSize(Math.min(32, fontSize + 2))}
              className={`p-1.5 rounded ${
                isDark 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-200 hover:bg-gray-300'
              } transition-colors duration-200`}
            >
              <FiPlus className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className={`px-3 py-2 rounded-md ${
              isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
          >
            {fontOptions.map(font => (
              <option key={font.value} value={font.value}>{font.label}</option>
            ))}
          </select>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <ActionButton 
            onClick={handleUndo}
            disabled={undoStack.length === 0}
            icon={<UndoIcon />} 
            label="Undo"
            isDark={isDark} 
            variant="secondary"
            title="Undo (Ctrl+Z)"
          />
          <ActionButton 
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            icon={<RedoIcon />} 
            label="Redo"
            isDark={isDark} 
            variant="secondary"
            title="Redo (Ctrl+Y)"
          />
          <span className="border-r h-8 mx-1 border-gray-300 dark:border-gray-700"></span>
          <ActionButton 
            onClick={clearText}
            icon={<FiTrash2 className="h-4 w-4" />} 
            label="Clear"
            isDark={isDark} 
            variant="danger"
          />
          <ActionButton 
            onClick={copyToClipboard}
            icon={<FiClipboard className="h-4 w-4" />} 
            label="Copy"
            isDark={isDark} 
            variant="secondary"
          />
        </div>
      </div>

      {/* Export Options Section */}
      <div className="mt-3 border-t pt-3 border-gray-300 dark:border-gray-700">
        <div className="text-sm font-medium mb-2">Export Options:</div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              console.log("Direct Text button clicked");
              try {
                downloadText();
                console.log("Text download function called");
              } catch (error) {
                console.error("Error in Text download:", error);
              }
            }} 
            className={`py-1.5 px-3 text-sm rounded-md flex items-center gap-1.5 ${
              isDark ? 'bg-blue-700 hover:bg-blue-600 text-white' : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
            }`}
          >
            <FiFileText className="h-4 w-4" />
            TXT
          </button>
          <button
            onClick={() => {
              console.log("Direct Markdown button clicked");
              try {
                exportAsMarkdown();
                console.log("Markdown export function called");
              } catch (error) {
                console.error("Error in Markdown export:", error);
              }
            }} 
            className={`py-1.5 px-3 text-sm rounded-md flex items-center gap-1.5 ${
              isDark ? 'bg-purple-700 hover:bg-purple-600 text-white' : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
            }`}
          >
            <FiFileText className="h-4 w-4" />
            MD
          </button>
          <button
            onClick={() => {
              console.log("Direct HTML button clicked");
              try {
                exportAsHtml();
                console.log("HTML export function called");
              } catch (error) {
                console.error("Error in HTML export:", error);
              }
            }} 
            className={`py-1.5 px-3 text-sm rounded-md flex items-center gap-1.5 ${
              isDark ? 'bg-green-700 hover:bg-green-600 text-white' : 'bg-green-100 hover:bg-green-200 text-green-700'
            }`}
          >
            <FiGlobe className="h-4 w-4" />
            HTML
          </button>
          <button
            onClick={() => {
              console.log("Direct Word button clicked");
              try {
                exportAsWord();
                console.log("Word export function called");
              } catch (error) {
                console.error("Error in Word export:", error);
              }
            }} 
            className={`py-1.5 px-3 text-sm rounded-md flex items-center gap-1.5 ${
              isDark ? 'bg-cyan-700 hover:bg-cyan-600 text-white' : 'bg-cyan-100 hover:bg-cyan-200 text-cyan-700'
            }`}
          >
            <FiFileText className="h-4 w-4" />
            DOC
          </button>
          <button
            onClick={() => {
              console.log("Direct PDF button clicked");
              try {
                exportAsPDF(PdfPageSize.A4, PdfOrientation.PORTRAIT);
                console.log("PDF export function called");
              } catch (error) {
                console.error("Error in PDF export:", error);
              }
            }} 
            className={`py-1.5 px-3 text-sm rounded-md flex items-center gap-1.5 ${
              isDark ? 'bg-red-700 hover:bg-red-600 text-white' : 'bg-red-100 hover:bg-red-200 text-red-700'
            }`}
          >
            <FiFilm className="h-4 w-4" />
            PDF
          </button>
          <button
            onClick={() => {
              console.log("Direct Image button clicked");
              try {
                exportAsImage();
                console.log("Image export function called");
              } catch (error) {
                console.error("Error in Image export:", error);
              }
            }} 
            className={`py-1.5 px-3 text-sm rounded-md flex items-center gap-1.5 ${
              isDark ? 'bg-amber-700 hover:bg-amber-600 text-white' : 'bg-amber-100 hover:bg-amber-200 text-amber-700'
            }`}
          >
            <FiImage className="h-4 w-4" />
            PNG
          </button>
        </div>

        {/* PDF Options */}
        <div className="mt-2">
          <div className="text-xs font-semibold mb-1">PDF Options:</div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => exportAsPDF(PdfPageSize.A4, PdfOrientation.LANDSCAPE)}
              className={`py-1 px-2 text-xs rounded-md flex items-center gap-1 ${
                isDark ? 'bg-red-900 hover:bg-red-800 text-white' : 'bg-red-50 hover:bg-red-100 text-red-800'
              }`}
            >
              A4 Landscape
            </button>
            <button
              onClick={() => exportAsPDF(PdfPageSize.LETTER, PdfOrientation.PORTRAIT)}
              className={`py-1 px-2 text-xs rounded-md flex items-center gap-1 ${
                isDark ? 'bg-red-900 hover:bg-red-800 text-white' : 'bg-red-50 hover:bg-red-100 text-red-800'
              }`}
            >
              Letter
            </button>
            <button
              onClick={() => exportAsPDF(PdfPageSize.LEGAL, PdfOrientation.PORTRAIT)}
              className={`py-1 px-2 text-xs rounded-md flex items-center gap-1 ${
                isDark ? 'bg-red-900 hover:bg-red-800 text-white' : 'bg-red-50 hover:bg-red-100 text-red-800'
              }`}
            >
              Legal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  icon: React.ReactNode;
  label: string;
  isDark: boolean;
  variant: 'primary' | 'secondary' | 'danger';
  title?: string;
}

function ActionButton({ onClick, disabled, icon, label, isDark, variant, title }: ActionButtonProps) {
  const getButtonStyle = () => {
    if (disabled) {
      return isDark 
        ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
        : 'bg-gray-100 text-gray-400 cursor-not-allowed';
    }

    switch (variant) {
      case 'primary':
        return isDark 
          ? 'bg-blue-700 hover:bg-blue-600 text-white' 
          : 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'danger':
        return isDark 
          ? 'bg-red-800 hover:bg-red-700 text-white' 
          : 'bg-red-100 hover:bg-red-200 text-red-700';
      default:
        return isDark 
          ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
          : 'bg-gray-200 hover:bg-gray-300 text-gray-700';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`py-2 px-3 text-sm rounded-md flex items-center gap-1.5 transition-all duration-200 ${getButtonStyle()}`}
      title={title}
    >
      {icon}
      {label}
    </button>
  );
}

function UndoIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7v6h6"></path>
      <path d="M3 13c0-4.97 4.03-9 9-9a9 9 0 0 1 9 9c0 4.97-4.03 9-9 9a9 9 0 0 1-8-5"></path>
    </svg>
  );
}

function RedoIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 7v6h-6"></path>
      <path d="M21 13c0-4.97-4.03-9-9-9a9 9 0 0 0-9 9c0 4.97 4.03 9 9 9a9 9 0 0 0 8-5"></path>
    </svg>
  );
}
