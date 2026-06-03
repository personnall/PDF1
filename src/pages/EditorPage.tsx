import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Download,
  ArrowLeft,
  Eye,
  Edit3,
  CheckCircle2,
  Trash2,
  RotateCcw,
  RotateCw,
  FileUp,
  FileDown,
  Info
} from 'lucide-react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { PDFDocument } from '../components/PDFDocument';

const STORAGE_KEY = 'pdf-builder-content';

const EditorPage: React.FC = () => {
  // State
  const [title, setTitle] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}-title`);
    return saved || 'My Document';
  });
  const [content, setContent] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}-content`);
    return saved || '';
  });
  const [view, setView] = useState<'split' | 'edit' | 'preview'>('split');
  const [isSaved, setIsSaved] = useState(false);

  // Undo/Redo State
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isInternalChange = useRef(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stats
  const charCount = content.length;
  const wordCount = content.trim() === '' ? 0 : content.trim().split(/\s+/).length;

  // Auto-save & Persistence
  useEffect(() => {
    setIsSaved(false);
    const timeout = setTimeout(() => {
      localStorage.setItem(`${STORAGE_KEY}-title`, title);
      localStorage.setItem(`${STORAGE_KEY}-content`, content);
      setIsSaved(true);
    }, 800);
    return () => clearTimeout(timeout);
  }, [title, content]);

  // Undo/Redo Logic
  useEffect(() => {
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }

    const lastEntry = history[historyIndex];
    if (content !== lastEntry) {
      const timeout = setTimeout(() => {
        setHistory(prev => {
          const newHistory = prev.slice(0, historyIndex + 1);
          newHistory.push(content);
          if (newHistory.length > 50) newHistory.shift();
          return newHistory;
        });
        setHistoryIndex(() => {
          const nextIdx = Math.min(historyIndex + 1, 49);
          return nextIdx;
        });
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [content, history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      isInternalChange.current = true;
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setContent(history[prevIndex]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isInternalChange.current = true;
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setContent(history[nextIndex]);
    }
  }, [history, historyIndex]);

  // Actions
  const handleClear = () => {
    if (confirm('Are you sure you want to clear all content?')) {
      setContent('');
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setContent(text);
      if (file.name.endsWith('.txt')) {
        setTitle(file.name.replace('.txt', ''));
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleExportText = () => {
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${title.replace(/\s+/g, '_') || 'document'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Toolbar */}
      <header className="bg-white border-b border-gray-200 px-4 h-16 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
          <Link to="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 flex-shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block flex-shrink-0"></div>
          <div className="flex items-center gap-2 overflow-hidden">
            <FileText className="text-blue-600 w-5 h-5 flex-shrink-0" />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-sm font-semibold bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-100 rounded px-2 py-1 w-24 sm:w-48 lg:w-64 truncate"
              placeholder="Document Title"
            />
            {isSaved && (
              <span className="hidden xs:flex items-center gap-1 text-[10px] text-gray-400 font-medium bg-gray-50 px-2 py-0.5 rounded-full uppercase tracking-wider flex-shrink-0">
                <CheckCircle2 className="w-3 h-3" />
                Saved
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-1 mr-2 bg-gray-100 p-1 rounded-lg">
            <button onClick={undo} disabled={historyIndex <= 0} className="p-1.5 rounded hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all text-gray-600">
              <RotateCcw className="w-4 h-4" />
            </button>
            <button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-1.5 rounded hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all text-gray-600">
              <RotateCw className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-gray-300 mx-1"></div>
            <button onClick={() => fileInputRef.current?.click()} className="p-1.5 rounded hover:bg-white hover:shadow-sm transition-all text-gray-600" title="Import Text File">
              <FileUp className="w-4 h-4" />
            </button>
            <button onClick={handleExportText} className="p-1.5 rounded hover:bg-white hover:shadow-sm transition-all text-gray-600" title="Export as Text">
              <FileDown className="w-4 h-4" />
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".txt,.md"
            className="hidden"
          />

          {/* View Toggle */}
          <div className="flex bg-gray-100 p-1 rounded-lg mr-1 sm:mr-2">
            <button
              onClick={() => setView('edit')}
              className={`p-1.5 sm:px-3 sm:py-1 rounded-md text-xs font-medium transition-all ${view === 'edit' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Edit3 className="w-4 h-4 sm:hidden" />
              <span className="hidden sm:inline">Edit</span>
            </button>
            <button
              onClick={() => setView('split')}
              className={`hidden sm:block px-3 py-1 text-xs font-medium rounded-md transition-all ${view === 'split' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Split
            </button>
            <button
              onClick={() => setView('preview')}
              className={`p-1.5 sm:px-3 sm:py-1 rounded-md text-xs font-medium transition-all ${view === 'preview' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Eye className="w-4 h-4 sm:hidden" />
              <span className="hidden sm:inline">Preview</span>
            </button>
          </div>

          <PDFDownloadLink
            document={<PDFDocument title={title} content={content} />}
            fileName={`${title.replace(/\s+/g, '_') || 'document'}.pdf`}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 sm:px-4 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
          >
            {({ loading }) => (
              <>
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">{loading ? '...' : 'Download'}</span>
              </>
            )}
          </PDFDownloadLink>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden">
        {/* Editor Side */}
        <div className={`flex-1 flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${
          view === 'preview' ? 'hidden' : 'flex'
        }`}>
          <div className="flex items-center justify-between px-6 py-2 bg-gray-50/50 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Editor</span>
              <div className="flex items-center gap-3 text-[10px] font-medium text-gray-500">
                <span className="flex items-center gap-1"><Info className="w-3 h-3" /> {wordCount} words</span>
                <span>{charCount} characters</span>
              </div>
            </div>
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
              title="Clear all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 p-8 md:p-12 text-lg leading-relaxed focus:outline-none resize-none bg-transparent font-serif placeholder:italic"
            placeholder="Start writing your document here..."
            spellCheck="false"
          />

          {/* Mobile Stats Bar */}
          <div className="md:hidden flex items-center justify-between px-6 py-2 bg-gray-50 border-t border-gray-100 text-[10px] font-medium text-gray-500">
             <div className="flex gap-3">
                <span>{wordCount} words</span>
                <span>{charCount} chars</span>
             </div>
             <div className="flex gap-2">
                <button onClick={undo} disabled={historyIndex <= 0} className="p-1 disabled:opacity-30"><RotateCcw className="w-3 h-3" /></button>
                <button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-1 disabled:opacity-30"><RotateCw className="w-3 h-3" /></button>
             </div>
          </div>
        </div>

        {/* Preview Side */}
        <div className={`bg-gray-100 transition-all duration-300 overflow-hidden flex flex-col ${
          view === 'edit' ? 'hidden' : 'flex-1'
        }`}>
          <div className="flex items-center justify-between px-6 py-2 bg-gray-100 border-b border-gray-200/50">
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">PDF Live Preview</span>
          </div>
          <div className="flex-1 p-4 md:p-8">
            <div className="h-full w-full bg-white shadow-2xl rounded-sm overflow-hidden">
              <PDFViewer className="w-full h-full border-none" showToolbar={false}>
                <PDFDocument title={title} content={content} />
              </PDFViewer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditorPage;
