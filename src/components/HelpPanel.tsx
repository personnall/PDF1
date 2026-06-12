import React from 'react';
import { HelpCircle, X, Hash, Table, Image as ImageIcon, FileText, Scissors } from 'lucide-react';

interface HelpPanelProps {
  onClose: () => void;
}

const HelpPanel: React.FC<HelpPanelProps> = ({ onClose }) => {
  const guide = [
    { icon: Hash, title: "Headings", syntax: "# Heading 1\n## Heading 2", desc: "Markdown-style headings (up to 3 levels)." },
    { icon: Table, title: "Tables", syntax: "| Header 1 | Header 2 |\n| Cell 1 | Cell 2 |", desc: "Simple markdown tables." },
    { icon: ImageIcon, title: "Images", syntax: "[image:src|width]", desc: "Width can be % or px. Supports URLs and Base64." },
    { icon: FileText, title: "TOC", syntax: "[toc]", desc: "Inserts an automatic Table of Contents." },
    { icon: Scissors, title: "Page Break", syntax: "[page-break]", desc: "Forces content to start on a new page." },
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl border-l border-gray-200 z-50 flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-blue-50/50">
        <div className="flex items-center gap-2 text-blue-600">
          <HelpCircle className="w-5 h-5" />
          <h3 className="font-bold uppercase tracking-wider text-sm">Editor Guide</h3>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {guide.map((item, i) => (
          <div key={i} className="space-y-3">
            <div className="flex items-center gap-2">
               <item.icon className="w-4 h-4 text-gray-400" />
               <h4 className="font-bold text-gray-700 text-sm">{item.title}</h4>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            <div className="bg-gray-50 border border-gray-100 p-3 rounded-lg">
               <pre className="text-[10px] font-mono text-blue-600 whitespace-pre-wrap">{item.syntax}</pre>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-gray-50 border-t border-gray-100">
         <p className="text-[10px] text-gray-400 font-medium text-center uppercase tracking-widest">Type naturally, style instantly</p>
      </div>
    </div>
  );
};

export default HelpPanel;
