import { jsPDF } from 'jspdf';
import { toast } from 'react-toastify';
import React from 'react';
import html2canvas from 'html2canvas';

// Text statistics
export const getTextStatistics = (text: string) => {
  const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  const chars = text.length;
  const lines = text.split('\n').length;
  
  return { words, chars, lines };
};

// Export functions
export const downloadAsText = (text: string, fileName: string) => {
  console.log("downloadAsText called with:", text?.length || 0, "chars,", fileName);
  try {
    const element = document.createElement('a');
    const file = new Blob([text || ''], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${fileName || 'texteditor-note'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    console.log("Text download completed");
  } catch (error) {
    console.error("Error in downloadAsText:", error);
    throw error;
  }
};

export const downloadAsMarkdown = (text: string, fileName: string) => {
  console.log("downloadAsMarkdown called with:", text?.length || 0, "chars,", fileName);
  try {
    const element = document.createElement('a');
    const file = new Blob([text || ''], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = `${fileName || 'texteditor-note'}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    console.log("Markdown download completed");
  } catch (error) {
    console.error("Error in downloadAsMarkdown:", error);
    throw error;
  }
};

// Helper function to convert text to HTML
const textToHtml = (text: string, fileName: string) => {
  // Replace line breaks with <br> tags
  const htmlContent = text
    .replace(/\n/g, '<br>')
    // Basic Markdown support
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
    .replace(/_(.*?)_/g, '<u>$1</u>') // Underline
    .replace(/`(.*?)`/g, '<code>$1</code>') // Code
    // Convert bullet lists
    .replace(/^- (.*?)$/gm, '<li>$1</li>')
    .replace(/<li>(.*?)<\/li>/g, '<ul><li>$1</li></ul>')
    .replace(/<\/ul><ul>/g, '');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${fileName || 'TextEditor Document'}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 40px;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      border-bottom: 1px solid #ddd;
      padding-bottom: 10px;
    }
    code {
      background-color: #f5f5f5;
      padding: 2px 4px;
      border-radius: 3px;
      font-family: monospace;
    }
  </style>
</head>
<body>
  <h1>${fileName || 'Untitled Document'}</h1>
  <div>${htmlContent}</div>
</body>
</html>`;
};

// HTML Export
export const downloadAsHtml = (text: string, fileName: string) => {
  console.log("downloadAsHtml called with:", text?.length || 0, "chars,", fileName);
  try {
    const htmlContent = textToHtml(text || '', fileName || 'Untitled');
    const element = document.createElement('a');
    const file = new Blob([htmlContent], {type: 'text/html'});
    element.href = URL.createObjectURL(file);
    element.download = `${fileName || 'texteditor-note'}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast.success('Downloaded as HTML', {
      icon: () => React.createElement('span', {}, '🌐'),
      position: 'bottom-center'
    });
    console.log("HTML download completed");
  } catch (error) {
    console.error("Error in downloadAsHtml:", error);
    toast.error('Failed to export as HTML', {
      icon: () => React.createElement('span', {}, '❌')
    });
    throw error;
  }
};

// Microsoft Word (DOCX) Export
export const downloadAsWord = (text: string, fileName: string) => {
  console.log("downloadAsWord called with:", text?.length || 0, "chars,", fileName);
  try {
    const htmlContent = textToHtml(text || '', fileName || 'Untitled');
    // Use the msSaveBlob API if available (Microsoft browsers)
    const nav = window.navigator as Navigator & { msSaveOrOpenBlob?: (blob: Blob, fileName: string) => void };
    if (nav && nav.msSaveOrOpenBlob) {
      console.log("Using msSaveOrOpenBlob API");
      const blob = new Blob([htmlContent], { type: 'application/msword' });
      nav.msSaveOrOpenBlob(blob, `${fileName || 'texteditor-note'}.doc`);
      return;
    }
    
    // For other browsers - use HTML with MS Word header
    console.log("Using data URI method for Word export");
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
                  "xmlns:w='urn:schemas-microsoft-com:office:word' " +
                  "xmlns='http://www.w3.org/TR/REC-html40'>" +
                  "<head><meta charset='utf-8'><title>Export HTML to Word</title></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + htmlContent + footer;
    
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = `${fileName || 'texteditor-note'}.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
    
    toast.success('Downloaded as Word document', {
      icon: () => React.createElement('span', {}, '📝'),
      position: 'bottom-center'
    });
    console.log("Word download completed");
  } catch (error) {
    console.error("Error in downloadAsWord:", error);
    toast.error('Failed to export as Word document', {
      icon: () => React.createElement('span', {}, '❌')
    });
    throw error;
  }
};

// Image Export (PNG)
export const downloadAsImage = async (contentRef: React.RefObject<HTMLDivElement>, fileName: string) => {
  if (!contentRef.current) {
    toast.error('Could not capture the editor content');
    return;
  }
  
  try {
    toast.info('Preparing image...', {
      autoClose: false,
      toastId: 'image-processing',
      icon: () => React.createElement('span', {}, '🔄')
    });
    
    const canvas = await html2canvas(contentRef.current, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff' // White background for better visibility
    });
    
    const imageUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${fileName || 'texteditor-note'}.png`;
    link.href = imageUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.dismiss('image-processing');
    toast.success('Downloaded as PNG image', {
      icon: () => React.createElement('span', {}, '🖼️'),
      position: 'bottom-center'
    });
  } catch (error) {
    console.error('Image export error:', error);
    toast.dismiss('image-processing');
    toast.error('Failed to export as image', {
      icon: () => React.createElement('span', {}, '❌')
    });
  }
};

// PDF Types
export enum PdfPageSize {
  A4 = 'a4',
  LETTER = 'letter',
  LEGAL = 'legal'
}

export enum PdfOrientation {
  PORTRAIT = 'portrait',
  LANDSCAPE = 'landscape'
}

export const downloadAsPDF = async (
  text: string, 
  fileName: string, 
  fontSize: number,
  pageSize: PdfPageSize = PdfPageSize.A4,
  orientation: PdfOrientation = PdfOrientation.PORTRAIT,
  headerText?: string,
  footerText?: string
) => {
  try {
    toast.info('Preparing PDF...', { 
      autoClose: false, 
      toastId: 'pdf-processing',
      icon: () => React.createElement('span', {}, '🔄')
    });
    
    // Create a new jsPDF instance
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: pageSize,
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
    pdf.line(20, 23, orientation === PdfOrientation.PORTRAIT ? 190 : 277, 23);
    
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
    
    // Header and footer settings
    const hasHeader = headerText && headerText.trim() !== '';
    const hasFooter = footerText && footerText.trim() !== '';
    
    // Create a function to add header and footer to each page
    const addHeaderFooter = (pageNum: number) => {
      if (hasHeader) {
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100); // Gray color for header/footer
        pdf.text(headerText!, margin, 10); // Header at 10mm from top
        
        // Add a light line below the header
        pdf.setDrawColor(200, 200, 200);
        pdf.line(margin, 13, pageWidth - margin, 13);
        
        // Reset colors
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(fontSize * 0.75);
      }
      
      if (hasFooter) {
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        
        // Add a light line above the footer
        pdf.setDrawColor(200, 200, 200);
        pdf.line(margin, pageHeight - 13, pageWidth - margin, pageHeight - 13);
        
        // Add page number to footer if specified with {page} placeholder
        let footerContent = footerText!;
        if (footerContent.includes('{page}')) {
          footerContent = footerContent.replace('{page}', (pageNum + 1).toString());
        }
        
        pdf.text(footerContent, margin, pageHeight - 10); // Footer at 10mm from bottom
        
        // Reset colors
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(fontSize * 0.75);
      }
    };
    
    // Add text to pages
    let currentPage = 0;
    let y = startY;
    
    // Add header and footer to first page
    addHeaderFooter(currentPage);
    
    for (let i = 0; i < textLines.length; i++) {
      // If we've reached the bottom margin or first line of a new page
      if (y > pageHeight - (margin + (hasFooter ? 10 : 0)) || 
          (currentPage > 0 && y === startY)) {
        pdf.addPage();
        currentPage++;
        y = startY;
        
        // Add header and footer to the new page
        addHeaderFooter(currentPage);
      }
      
      // Add the text line
      pdf.text(textLines[i], margin, y);
      y += lineHeight;
    }
    
    // Save the PDF
    pdf.save(`${fileName || 'texteditor-note'}.pdf`);
    
    toast.dismiss('pdf-processing');
    toast.success(`Downloaded as PDF (${pageSize.toUpperCase()}, ${orientation})`, {
      icon: () => React.createElement('span', {}, '📑'),
      position: 'bottom-center'
    });
    
  } catch (error) {
    console.error('PDF generation error:', error);
    toast.dismiss('pdf-processing');
    toast.error('Failed to generate PDF. Please try again.', {
      icon: () => React.createElement('span', {}, '❌')
    });
  }
};
