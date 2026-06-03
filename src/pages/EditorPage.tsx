import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Download,
  ArrowLeft,
  Eye,
  Edit3,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { PDFDocument } from '../components/PDFDocument';

const EditorPage: React.FC = () => {
  const [title, setTitle] = useState('My Document');
  const [content, setContent] = useState('');
  const [view, setView] = useState<'split' | 'edit' | 'preview'>('split');
  const [isSaved, setIsSaved] = useState(false);

  // Auto-save simulation
  useEffect(() => {
    setIsSaved(false);
    const timeout = setTimeout(() => {
      setIsSaved(true);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [title, content]);

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all content?')) {
      setContent('');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Toolbar */}
      <header className="bg-white border-b border-gray-200 px-4 h-16 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <FileText className="text-blue-600 w-5 h-5" />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-sm font-semibold bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-100 rounded px-2 py-1 w-32 sm:w-64"
              placeholder="Document Title"
            />
            {isSaved && (
              <span className="flex items-center gap-1 text-[10px] text-gray-400 font-medium bg-gray-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                <CheckCircle2 className="w-3 h-3" />
                Saved
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle (Mobile) */}
          <div className="flex bg-gray-100 p-1 rounded-lg mr-2 sm:hidden">
            <button
              onClick={() => setView('edit')}
              className={`p-1.5 rounded-md ${view === 'edit' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('preview')}
              className={`p-1.5 rounded-md ${view === 'preview' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Desktop View Controls */}
          <div className="hidden sm:flex bg-gray-100 p-1 rounded-lg mr-2">
            <button
              onClick={() => setView('edit')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${view === 'edit' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Edit
            </button>
            <button
              onClick={() => setView('split')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${view === 'split' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Split
            </button>
            <button
              onClick={() => setView('preview')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${view === 'preview' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Preview
            </button>
          </div>

          <PDFDownloadLink
            document={<PDFDocument title={title} content={content} />}
            fileName={`${title.replace(/\s+/g, '_') || 'document'}.pdf`}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            {({ loading }) => (
              <>
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">{loading ? 'Preparing...' : 'Download'}</span>
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
          <div className="flex items-center justify-between px-6 py-3 bg-gray-50/50 border-b border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Editor</span>
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
          />
        </div>

        {/* Preview Side */}
        <div className={`bg-gray-100 transition-all duration-300 overflow-hidden flex flex-col ${
          view === 'edit' ? 'hidden' : 'flex-1'
        }`}>
          <div className="flex items-center justify-between px-6 py-3 bg-gray-100 border-b border-gray-200/50">
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
