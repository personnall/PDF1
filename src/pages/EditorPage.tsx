import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  FileText, Download, CheckCircle2, Trash2, RotateCcw, RotateCw,
  Info, Settings as SettingsIcon, ZoomIn, ZoomOut, Maximize, Moon, Sun,
  Minimize, Type, Layout, Search, Image as ImageIcon, Table, Scissors, FolderOpen, FileUp, FileDown,
  Wrench, Home, HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PDFDocument } from '../components/PDFDocument';
import SettingsPanel from '../components/SettingsPanel';
import StylingPanel from '../components/StylingPanel';
import HeaderFooterPanel from '../components/HeaderFooterPanel';
import ProjectSidebar from '../components/ProjectSidebar';
import FindReplace from '../components/FindReplace';
import HelpPanel from '../components/HelpPanel';
import StablePreview from '../components/StablePreview';
import { useProjectManager } from '../hooks/useProjectManager';
import type { PageSettings } from '../types/settings';
import type { TextStyling } from '../types/styling';
import type { HeaderFooterSettings } from '../types/headerFooter';
import type { Project } from '../types/project';

const EditorPage: React.FC = () => {
  const {
    projects, currentProject, createProject, deleteProject,
    loadProject, saveProject, duplicateProject, renameProject
  } = useProjectManager();

  // State
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [settings, setSettings] = useState<PageSettings | null>(null);
  const [styling, setStyling] = useState<TextStyling | null>(null);
  const [hfSettings, setHfSettings] = useState<HeaderFooterSettings | null>(null);

  const [sidebarTab, setSidebarTab] = useState<'page' | 'style' | 'hf' | null>(null);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isFindReplaceOpen, setIsFindReplaceOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isPreviewDark, setIsPreviewDark] = useState(false);
  const [fitMode, setFitMode] = useState<'none' | 'width' | 'page'>('none');

  // Preview Debounce (Increased to 2.5s for stability)
  const [previewData, setPreviewData] = useState<{
    content: string;
    title: string;
    settings: PageSettings | null;
    styling: TextStyling | null;
    hfSettings: HeaderFooterSettings | null;
  }>({ content: '', title: '', settings: null, styling: null, hfSettings: null });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPreviewData({ content, title, settings, styling, hfSettings });
    }, 1500);
    return () => clearTimeout(timeout);
  }, [content, title, settings, styling, hfSettings]);

  // Undo/Redo State
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isInternalChange = useRef(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Stats
  const charCount = useMemo(() => content.length, [content]);
  const wordCount = useMemo(() => content.trim() === '' ? 0 : content.trim().split(/\s+/).length, [content]);

  // Load last project
  useEffect(() => {
    if (!currentProject) {
      if (projects.length > 0) {
        const last = loadProject(projects[0].id);
        if (last) { syncState(last); }
      } else {
        const fresh = createProject();
        syncState(fresh);
      }
    }
  }, [projects, currentProject, loadProject, createProject]);

  const syncState = (project: Project) => {
    setTitle(project.title);
    setContent(project.content);
    setSettings(project.settings);
    setStyling(project.styling);
    setHfSettings(project.hf);
    setPreviewData({
        content: project.content,
        title: project.title,
        settings: project.settings,
        styling: project.styling,
        hfSettings: project.hf
    });
  };

  // Auto-save logic
  useEffect(() => {
    if (!currentProject || !settings || !styling || !hfSettings) return;
    setIsSaved(false);
    const timeout = setTimeout(() => {
      saveProject({ ...currentProject, title, content, settings, styling, hf: hfSettings, updatedAt: Date.now() });
      setIsSaved(true);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [title, content, settings, styling, hfSettings, currentProject, saveProject]);

  // Undo/Redo Logic
  useEffect(() => {
    if (isInternalChange.current) { isInternalChange.current = false; return; }
    const lastEntry = history[historyIndex];
    if (content !== lastEntry) {
      const timeout = setTimeout(() => {
        setHistory(prev => {
          const newHistory = prev.slice(0, historyIndex + 1);
          newHistory.push(content);
          if (newHistory.length > 50) newHistory.shift();
          return newHistory;
        });
        setHistoryIndex(() => Math.min(historyIndex + 1, 49));
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [content, history, historyIndex]);

  // Fit Logic
  useEffect(() => {
    if (fitMode === 'none' || !previewContainerRef.current || !settings) return;
    const container = previewContainerRef.current;
    const containerWidth = container.clientWidth - 64;
    const containerHeight = container.clientHeight - 64;
    const docWidth = settings.orientation === 'portrait' ? 595 : 842;
    const docHeight = settings.orientation === 'portrait' ? 842 : 595;
    if (fitMode === 'width') setZoom(containerWidth / docWidth);
    else if (fitMode === 'page') setZoom(Math.min(containerWidth / docWidth, containerHeight / docHeight));
  }, [fitMode, settings?.orientation, settings]);

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

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setContent(e.target?.result as string);
    reader.readAsText(file);
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
       const base64 = readerEvent.target?.result as string;
       const width = prompt("Enter image width (e.g., 50% or 200px):", "100%") || "100%";
       setContent(prev => prev + `\n[image:${base64}|${width}]`);
    };
    reader.readAsDataURL(file);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  if (!settings || !styling || !hfSettings) return null;

  return (
    <div className={`h-screen flex flex-col overflow-hidden ${isPreviewDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <header className="bg-white border-b border-gray-200 px-4 h-16 flex items-center justify-between z-10 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
          <Link to="/" className="p-2 hover:bg-gray-100 rounded-lg text-gray-500" title="Go to Home">
            <Home className="w-5 h-5" />
          </Link>
          <button onClick={() => setIsProjectsOpen(!isProjectsOpen)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500" title="Projects">
            <FolderOpen className="w-5 h-5" />
          </button>
          <Link to="/tools" className="p-2 hover:bg-gray-100 rounded-lg text-gray-500" title="PDF Tools">
            <Wrench className="w-5 h-5" />
          </Link>
          <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>
          <div className="flex items-center gap-2 overflow-hidden">
            <FileText className="text-blue-600 w-5 h-5 flex-shrink-0" />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-sm font-semibold bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-100 rounded px-2 py-1 w-24 sm:w-48 lg:w-64 truncate"
              placeholder="Project Title"
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
          <div className="hidden lg:flex items-center gap-1 mr-2 bg-gray-100 p-1 rounded-lg">
            <button onClick={() => setIsFindReplaceOpen(!isFindReplaceOpen)} className="p-1.5 rounded hover:bg-white text-gray-600" title="Find & Replace"><Search className="w-4 h-4" /></button>
            <button onClick={() => imageInputRef.current?.click()} className="p-1.5 rounded hover:bg-white text-gray-600" title="Insert Image"><ImageIcon className="w-4 h-4" /></button>
            <button onClick={() => setContent(p => p + `\n| Header 1 | Header 2 |\n| Cell 1 | Cell 2 |`)} className="p-1.5 rounded hover:bg-white text-gray-600" title="Insert Table"><Table className="w-4 h-4" /></button>
            <button onClick={() => setContent(p => p + `\n[page-break]\n`)} className="p-1.5 rounded hover:bg-white text-gray-600" title="Page Break"><Scissors className="w-4 h-4" /></button>
            <button onClick={() => !content.includes('[toc]') && setContent(p => `[toc]\n\n` + p)} className="p-1.5 rounded hover:bg-white text-gray-600" title="Table of Contents"><FileText className="w-4 h-4" /></button>
            <div className="w-px h-4 bg-gray-300 mx-1"></div>
            <button onClick={() => fileInputRef.current?.click()} className="p-1.5 rounded hover:bg-white text-gray-600" title="Import Text File"><FileUp className="w-4 h-4" /></button>
            <button onClick={handleExportText} className="p-1.5 rounded hover:bg-white text-gray-600" title="Export as Text"><FileDown className="w-4 h-4" /></button>
            <div className="w-px h-4 bg-gray-300 mx-1"></div>
            <button onClick={() => setIsHelpOpen(!isHelpOpen)} className={`p-1.5 rounded transition-colors ${isHelpOpen ? 'bg-blue-600 text-white' : 'hover:bg-white text-gray-600'}`} title="Help Guide"><HelpCircle className="w-4 h-4" /></button>
          </div>

          <input type="file" ref={imageInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
          <input type="file" ref={fileInputRef} onChange={handleImport} accept=".txt" className="hidden" />

          <div className="flex bg-gray-100 p-1 rounded-lg mr-1 sm:mr-2">
             <button onClick={() => setSidebarTab(sidebarTab === 'page' ? null : 'page')} className={`p-1.5 rounded-md transition-all ${sidebarTab === 'page' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} title="Page Settings"><SettingsIcon className="w-4 h-4" /></button>
             <button onClick={() => setSidebarTab(sidebarTab === 'style' ? null : 'style')} className={`p-1.5 rounded-md transition-all ${sidebarTab === 'style' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} title="Styling"><Type className="w-4 h-4" /></button>
             <button onClick={() => setSidebarTab(sidebarTab === 'hf' ? null : 'hf')} className={`p-1.5 rounded-md transition-all ${sidebarTab === 'hf' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} title="Header & Footer"><Layout className="w-4 h-4" /></button>
          </div>

          <PDFDownloadLink
            document={<PDFDocument title={title} content={content} settings={settings} styling={styling} hf={hfSettings} />}
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

      <main className="flex-1 flex overflow-hidden relative">
        {isProjectsOpen && (
          <ProjectSidebar
            projects={projects}
            currentProjectId={currentProject?.id}
            onSelect={(id) => { const p = loadProject(id); if (p) syncState(p); }}
            onCreate={() => { const p = createProject(); syncState(p); }}
            onDelete={deleteProject}
            onDuplicate={duplicateProject}
            onRename={renameProject}
            onClose={() => setIsProjectsOpen(false)}
          />
        )}

        {isFindReplaceOpen && <FindReplace content={content} onReplace={setContent} onClose={() => setIsFindReplaceOpen(false)} />}
        {isHelpOpen && <HelpPanel onClose={() => setIsHelpOpen(false)} />}

        <div className="flex-1 flex flex-col bg-white border-r border-gray-200 transition-all flex">
          <div className="flex items-center justify-between px-6 py-2 bg-gray-50/50 border-b border-gray-100 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            <div className="flex gap-4">
              <span>Editor</span>
              <span className="text-gray-500 lowercase normal-case flex items-center gap-1 font-medium"><Info className="w-3 h-3" /> {wordCount} words, {charCount} chars</span>
            </div>
            <div className="flex gap-2">
              <button onClick={undo} disabled={historyIndex <= 0} className="hover:text-blue-600 disabled:opacity-30"><RotateCcw className="w-4 h-4" /></button>
              <button onClick={redo} disabled={historyIndex >= history.length - 1} className="hover:text-blue-600 disabled:opacity-30"><RotateCw className="w-4 h-4" /></button>
              <button onClick={() => setContent('')} className="hover:text-red-500 pl-2 border-l border-gray-200"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 p-8 md:p-12 text-lg leading-relaxed focus:outline-none resize-none bg-transparent font-serif"
            placeholder="Start your professional document..."
          />
        </div>

        <div ref={previewContainerRef} className={`flex-1 overflow-hidden flex flex-col ${isPreviewDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <div className={`flex items-center justify-between px-6 py-2 border-b ${isPreviewDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'}`}>
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">PDF Preview</span>
             <div className="flex items-center gap-2">
                <div className="flex items-center bg-black/5 rounded-lg p-0.5">
                  <button onClick={() => setZoom(z => Math.max(0.2, z-0.1))} className="p-1 hover:bg-white rounded"><ZoomOut className="w-3 h-3 text-gray-500" /></button>
                  <span className="px-2 text-[10px] font-bold text-gray-500">{Math.round(zoom*100)}%</span>
                  <button onClick={() => setZoom(z => Math.min(3, z+0.1))} className="p-1 hover:bg-white rounded"><ZoomIn className="w-3 h-3 text-gray-500" /></button>
                  <div className="w-px h-3 bg-gray-300 mx-1"></div>
                  <button onClick={() => setFitMode('width')} className={`p-1 rounded ${fitMode === 'width' ? 'bg-white shadow-sm' : ''}`}><Maximize className="w-3 h-3 text-gray-500" /></button>
                  <button onClick={() => setFitMode('page')} className={`p-1 rounded ${fitMode === 'page' ? 'bg-white shadow-sm' : ''}`}><Minimize className="w-3 h-3 text-gray-500" /></button>
                </div>
                <button onClick={() => setIsPreviewDark(!isPreviewDark)} className={`p-1.5 rounded-lg ${isPreviewDark ? 'bg-yellow-400' : 'bg-gray-200'}`}>{isPreviewDark ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}</button>
             </div>
          </div>
          <div className="flex-1 overflow-auto custom-scrollbar">
             {previewData.settings && previewData.styling && previewData.hfSettings ? (
                <StablePreview
                  title={previewData.title}
                  content={previewData.content}
                  settings={previewData.settings}
                  styling={previewData.styling}
                  hf={previewData.hfSettings}
                  zoom={zoom}
                />
             ) : (
               <div className="h-full flex items-center justify-center text-gray-400 animate-pulse">Initializing Preview...</div>
             )}
          </div>
        </div>

        {sidebarTab && (
          <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto p-6 flex-shrink-0">
             {sidebarTab === 'page' && <SettingsPanel settings={settings} onChange={setSettings} />}
             {sidebarTab === 'style' && <StylingPanel styling={styling} onChange={setStyling} />}
             {sidebarTab === 'hf' && <HeaderFooterPanel settings={hfSettings} onChange={setHfSettings} />}
          </div>
        )}
      </main>
    </div>
  );
};

export default EditorPage;
