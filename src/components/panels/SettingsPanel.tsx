import { FiMinus, FiPlus, FiTrash2, FiClipboard, FiFilm, FiFileText, FiGlobe, FiImage, FiSettings } from 'react-icons/fi';
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
    <div 
      className={`p-6 rounded-lg ${isDark ? 'bg-black-800 border-black-700' : 'bg-white border-black-200'} 
      border shadow-lg transition-all duration-300 animate-fadeIn relative z-settings mb-4 mx-4 mt-2`} 
      style={{ isolation: 'isolate' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FiSettings className="h-5 w-5 text-blue-500" />
          <h3 className={`font-medium ${isDark ? 'text-white' : 'text-black-800'}`}>Document Settings</h3>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Text Size Section */}
        <div className={`p-4 rounded-lg ${isDark ? 'bg-black-700' : 'bg-black-100'}`}>
          <h4 className={`text-sm font-medium mb-3 ${isDark ? 'text-white' : 'text-black-700'}`}>Text Size</h4>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setFontSize(Math.max(12, fontSize - 2))}
              className={`p-2 rounded-full ${
                isDark 
                  ? 'bg-black-600 hover:bg-black-500 text-white' 
                  : 'bg-black-200 hover:bg-black-300 text-black-700'
              } transition-colors duration-200 flex items-center justify-center`}
              aria-label="Decrease font size"
            >
              <FiMinus className="h-4 w-4" />
            </button>
            <span className={`text-sm w-8 text-center font-medium ${isDark ? 'text-white' : 'text-black-800'}`}>{fontSize}</span>
            <button 
              onClick={() => setFontSize(Math.min(32, fontSize + 2))}
              className={`p-2 rounded-full ${
                isDark 
                  ? 'bg-black-600 hover:bg-black-500 text-white' 
                  : 'bg-black-200 hover:bg-black-300 text-black-700'
              } transition-colors duration-200 flex items-center justify-center`}
              aria-label="Increase font size"
            >
              <FiPlus className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Font Family Section */}
        <div className={`p-4 rounded-lg ${isDark ? 'bg-black-700' : 'bg-black-100'}`}>
          <h4 className={`text-sm font-medium mb-3 ${isDark ? 'text-white' : 'text-black-700'}`}>Font</h4>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className={`w-full px-3 py-2 rounded-md ${
              isDark ? 'bg-black-600 border-black-500 text-white' : 'bg-white border-black-300 text-black-800'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
            aria-label="Select font family"
          >
            {fontOptions.map(font => (
              <option key={font.value} value={font.value}>{font.label}</option>
            ))}
          </select>
        </div>
        
        {/* Document Actions */}
        <div className={`p-4 rounded-lg ${isDark ? 'bg-black-700' : 'bg-black-100'}`}>
          <h4 className={`text-sm font-medium mb-3 ${isDark ? 'text-white' : 'text-black-700'}`}>Document Actions</h4>
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
            <ActionButton 
              onClick={copyToClipboard}
              icon={<FiClipboard className="h-4 w-4" />} 
              label="Copy"
              isDark={isDark} 
              variant="secondary"
            />
            <ActionButton 
              onClick={clearText}
              icon={<FiTrash2 className="h-4 w-4" />} 
              label="Clear"
              isDark={isDark} 
              variant="danger"
            />
          </div>
        </div>
      </div>

      {/* Export Options Section */}
      <div className="mt-6">
        <div className={`text-sm font-medium mb-3 pb-2 border-b ${isDark ? 'border-black-700 text-white' : 'border-black-300 text-black-700'}`}>
          Export Options
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <ExportButton 
            onClick={downloadText} 
            icon={<FiFileText className="h-4 w-4" />} 
            label="TXT" 
            color="blue" 
            isDark={isDark} 
          />
          <ExportButton 
            onClick={exportAsMarkdown} 
            icon={<FiFileText className="h-4 w-4" />} 
            label="MD" 
            color="purple" 
            isDark={isDark} 
          />
          <ExportButton 
            onClick={exportAsHtml} 
            icon={<FiGlobe className="h-4 w-4" />} 
            label="HTML" 
            color="green" 
            isDark={isDark} 
          />
          <ExportButton 
            onClick={exportAsWord} 
            icon={<FiFileText className="h-4 w-4" />} 
            label="DOC" 
            color="cyan" 
            isDark={isDark} 
          />
          <ExportButton 
            onClick={() => exportAsPDF(PdfPageSize.A4, PdfOrientation.PORTRAIT)} 
            icon={<FiFilm className="h-4 w-4" />} 
            label="PDF" 
            color="red" 
            isDark={isDark} 
          />
          <ExportButton 
            onClick={exportAsImage} 
            icon={<FiImage className="h-4 w-4" />} 
            label="PNG" 
            color="amber" 
            isDark={isDark} 
          />
        </div>

        {/* PDF Options */}
        <div className="mt-4">
          <div className={`text-xs font-medium mb-2 ${isDark ? 'text-white' : 'text-black-700'}`}>
            PDF Options
          </div>
          <div className="flex flex-wrap gap-2">
            <PdfOptionButton 
              onClick={() => exportAsPDF(PdfPageSize.A4, PdfOrientation.PORTRAIT)} 
              label="A4 Portrait" 
              isDark={isDark} 
            />
            <PdfOptionButton 
              onClick={() => exportAsPDF(PdfPageSize.A4, PdfOrientation.LANDSCAPE)} 
              label="A4 Landscape" 
              isDark={isDark} 
            />
            <PdfOptionButton 
              onClick={() => exportAsPDF(PdfPageSize.LETTER, PdfOrientation.PORTRAIT)} 
              label="Letter" 
              isDark={isDark} 
            />
            <PdfOptionButton 
              onClick={() => exportAsPDF(PdfPageSize.LEGAL, PdfOrientation.PORTRAIT)} 
              label="Legal" 
              isDark={isDark} 
            />
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
        ? 'bg-black-800 text-black-600 cursor-not-allowed opacity-50' 
        : 'bg-black-100 text-black-400 cursor-not-allowed opacity-50';
    }

    switch (variant) {
      case 'primary':
        return isDark 
          ? 'bg-blue-600 hover:bg-blue-500 text-white' 
          : 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'danger':
        return isDark 
          ? 'bg-red-600 hover:bg-red-500 text-white' 
          : 'bg-red-100 hover:bg-red-200 text-red-700';
      default:
        return isDark 
          ? 'bg-black-600 hover:bg-black-500 text-black-200' 
          : 'bg-black-200 hover:bg-black-300 text-black-700';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`py-1.5 px-3 text-sm rounded-md flex items-center gap-1.5 transition-all duration-200 ${getButtonStyle()}`}
      title={title}
    >
      {icon}
      {label}
    </button>
  );
}

interface ExportButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  color: 'blue' | 'purple' | 'green' | 'cyan' | 'red' | 'amber';
  isDark: boolean;
}

function ExportButton({ onClick, icon, label, color, isDark }: ExportButtonProps) {
  const getButtonStyle = () => {
    switch (color) {
      case 'blue':
        return isDark 
          ? 'bg-blue-700 hover:bg-blue-600 text-white ring-blue-700' 
          : 'bg-blue-100 hover:bg-blue-200 text-blue-800 ring-blue-200';
      case 'purple':
        return isDark 
          ? 'bg-purple-700 hover:bg-purple-600 text-white ring-purple-700' 
          : 'bg-purple-100 hover:bg-purple-200 text-purple-800 ring-purple-200';
      case 'green':
        return isDark 
          ? 'bg-green-700 hover:bg-green-600 text-white ring-green-700' 
          : 'bg-green-100 hover:bg-green-200 text-green-800 ring-green-200';
      case 'cyan':
        return isDark 
          ? 'bg-cyan-700 hover:bg-cyan-600 text-white ring-cyan-700' 
          : 'bg-cyan-100 hover:bg-cyan-200 text-cyan-800 ring-cyan-200';
      case 'red':
        return isDark 
          ? 'bg-red-700 hover:bg-red-600 text-white ring-red-700' 
          : 'bg-red-100 hover:bg-red-200 text-red-800 ring-red-200';
      case 'amber':
        return isDark 
          ? 'bg-amber-700 hover:bg-amber-600 text-white ring-amber-700' 
          : 'bg-amber-100 hover:bg-amber-200 text-amber-800 ring-amber-200';
      default:
        return '';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`py-2 px-3 text-sm rounded-md flex flex-col items-center justify-center gap-1.5 transition-all duration-200 hover:ring-2 ${getButtonStyle()}`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

function PdfOptionButton({ onClick, label, isDark }: { onClick: () => void; label: string; isDark: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`py-1.5 px-3 text-xs rounded-md transition-all duration-200 font-medium ${
        isDark 
          ? 'bg-red-900 hover:bg-red-800 text-white' 
          : 'bg-red-50 hover:bg-red-100 text-red-800 hover:ring-1 hover:ring-red-200'
      }`}
    >
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
