import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, ArrowLeft, Combine, Scissors, FileArchive,
  ArrowRight, FileType, Upload, Loader2, AlertCircle
} from 'lucide-react';
import { mergePDFs, splitPDF, compressPDF } from '../services/pdfService';
import { convertDocxToText } from '../services/conversionService';
import { extractTextFromPptx } from '../services/pptxService';

const ToolsPage: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [splitRange, setSplitRange] = useState('1');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const tools = [
    { id: 'merge', name: 'Merge PDF', description: 'Combine multiple PDFs into one document', icon: Combine, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'split', name: 'Split PDF', description: 'Separate pages or ranges into new files', icon: Scissors, color: 'text-red-600', bg: 'bg-red-50' },
    { id: 'compress', name: 'Compress PDF', description: 'Reduce file size while preserving quality', icon: FileArchive, color: 'text-green-600', bg: 'bg-green-50' },
    { id: 'docx', name: 'DOCX to Project', description: 'Convert Word docs to editable text', icon: FileType, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 'pptx', name: 'PPTX to Project', description: 'Extract slides content to editable text', icon: FileType, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (type === 'merge') {
      setSelectedFiles(prev => [...prev, ...Array.from(files)]);
    } else {
      setSelectedFiles([files[0]]);
    }
  };

  const processFiles = async (type: string) => {
    if (selectedFiles.length === 0) return;
    setLoading(true);
    setError(null);

    try {
      if (type === 'merge') {
        const result = await mergePDFs(selectedFiles);
        downloadBlob(result, 'merged.pdf');
      } else if (type === 'split') {
        const results = await splitPDF(selectedFiles[0], splitRange);
        results.forEach((res, i) => downloadBlob(res, `split_part_${i+1}.pdf`));
      } else if (type === 'compress') {
        const result = await compressPDF(selectedFiles[0]);
        downloadBlob(result, 'compressed.pdf');
      } else if (type === 'docx' || type === 'pptx') {
        const text = type === 'docx'
          ? await convertDocxToText(selectedFiles[0])
          : await extractTextFromPptx(selectedFiles[0]);

        const blob = new Blob([text], { type: 'text/plain' });
        const buf = await blob.arrayBuffer();
        downloadBlob(new Uint8Array(buf), 'converted_content.txt');
      }

      // Cleanup
      setSelectedFiles([]);
      setActiveTool(null);
    } catch (err) {
      setError('An error occurred while processing. Please ensure files are valid.');
    } finally {
      setLoading(false);
    }
  };

  const downloadBlob = (data: Uint8Array, name: string) => {
    const blob = new Blob([data as any], { type: name.endsWith('.txt') ? 'text/plain' : 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <FileText className="text-white w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">PDF Tools</span>
          </div>
        </div>
        <Link to="/editor" className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors">
          Open Builder
        </Link>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold mb-4">Professional PDF Toolkit</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">Everything you need to manage your PDF documents in one place. No uploads to server, everything processed in your browser.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer relative overflow-hidden"
              onClick={() => {
                if (activeTool !== tool.id) {
                  setActiveTool(tool.id);
                  setSelectedFiles([]);
                }
              }}
            >
              <div className={`${tool.bg} ${tool.color} w-12 h-12 flex items-center justify-center rounded-xl mb-6 group-hover:scale-110 transition-transform`}>
                <tool.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">{tool.name}</h3>
              <p className="text-gray-500 text-sm mb-6">{tool.description}</p>

              <div className="flex items-center text-blue-600 text-sm font-bold gap-1 group-hover:gap-2 transition-all">
                Try Now <ArrowRight className="w-4 h-4" />
              </div>

              {activeTool === tool.id && (
                <div className="absolute inset-0 bg-white/98 rounded-2xl p-6 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-200 z-10">
                  <h4 className="font-bold mb-4 text-gray-900">{tool.name}</h4>

                  {loading ? (
                    <div className="flex flex-col items-center gap-2">
                       <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Processing...</span>
                    </div>
                  ) : selectedFiles.length > 0 ? (
                    <div className="w-full flex flex-col gap-3">
                       <div className="max-h-32 overflow-y-auto flex flex-col gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100">
                          {selectedFiles.map((f, i) => (
                            <div key={i} className="flex items-center justify-between text-[10px] bg-white p-2 rounded shadow-sm border border-gray-100 animate-in slide-in-from-left-2">
                               <span className="truncate max-w-[150px] font-medium text-gray-600">{f.name}</span>
                               <button onClick={(e) => { e.stopPropagation(); setSelectedFiles(prev => prev.filter((_, idx) => idx !== i)); }} className="text-red-400 hover:text-red-600 font-bold px-1">×</button>
                            </div>
                          ))}
                       </div>

                       <div className="flex flex-col gap-2">
                         {tool.id === 'merge' && (
                           <label className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors">
                              <Upload className="w-3 h-3 text-gray-400" />
                              <span className="text-[10px] font-bold text-gray-400 uppercase">Add More</span>
                              <input type="file" multiple className="hidden" accept=".pdf" onChange={(e) => handleFileSelection(e, tool.id)} />
                           </label>
                         )}
                         <button
                           onClick={(e) => { e.stopPropagation(); processFiles(tool.id); }}
                           className="w-full bg-blue-600 text-white py-3 rounded-xl text-xs font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
                         >
                           {tool.id === 'merge' ? `Merge ${selectedFiles.length} PDFs` : 'Convert Now'}
                         </button>
                       </div>
                    </div>
                  ) : (
                    <div className="w-full flex flex-col gap-4">
                      {tool.id === 'split' && (
                        <div className="flex flex-col gap-1 text-left">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Page Range (e.g. 1, 2-4)</label>
                          <input
                            type="text"
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100 focus:outline-none"
                            value={splitRange}
                            onChange={(e) => setSplitRange(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      )}
                      <label className="w-full flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-blue-200 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors">
                        <Upload className="w-6 h-6 text-blue-600" />
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          {tool.id === 'split' ? 'Select File to Split' : tool.id === 'merge' ? 'Select PDFs' : 'Choose File'}
                        </span>
                        <input
                          type="file"
                          multiple={tool.id === 'merge'}
                          className="hidden"
                          accept={tool.id === 'docx' ? '.docx' : tool.id === 'pptx' ? '.pptx' : '.pdf'}
                          onChange={(e) => handleFileSelection(e, tool.id)}
                        />
                      </label>
                    </div>
                  )}

                  <button
                    onClick={(e) => { e.stopPropagation(); setActiveTool(null); setSelectedFiles([]); }}
                    className="mt-6 text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <section className="mt-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-blue-200">
           <div className="max-w-xl text-center md:text-left">
              <h2 className="text-3xl font-bold mb-4">Professional Document Builder</h2>
              <p className="text-blue-100 text-lg">Create documents from scratch with our high-fidelity editor. Real-time preview, custom branding, and advanced layouts included.</p>
           </div>
           <Link to="/editor" className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-bold hover:shadow-xl hover:-translate-y-1 transition-all whitespace-nowrap">
              Open Editor
           </Link>
        </section>
      </main>

      <footer className="py-12 text-center border-t border-gray-100 mt-12 bg-white">
          <p className="text-gray-400 text-[10px] font-bold tracking-[0.2em] uppercase">Powered by PDF Builder Pro Engine</p>
      </footer>
    </div>
  );
};

export default ToolsPage;
