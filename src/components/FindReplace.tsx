import React, { useState } from 'react';
import { Search, Replace, X } from 'lucide-react';

interface FindReplaceProps {
  content: string;
  onReplace: (newContent: string) => void;
  onClose: () => void;
}

const FindReplace: React.FC<FindReplaceProps> = ({ content, onReplace, onClose }) => {
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');

  const handleReplaceAll = () => {
    if (!findText) return;
    const newContent = content.split(findText).join(replaceText);
    onReplace(newContent);
  };

  return (
    <div className="absolute top-20 right-10 z-50 bg-white shadow-2xl rounded-xl border border-gray-200 p-4 w-72 animate-in slide-in-from-top-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Find & Replace</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded text-gray-400">
           <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 w-3 h-3 text-gray-400" />
          <input
            type="text"
            placeholder="Find..."
            value={findText}
            onChange={(e) => setFindText(e.target.value)}
            className="w-full pl-7 pr-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <Replace className="absolute left-2 top-2.5 w-3 h-3 text-gray-400" />
          <input
            type="text"
            placeholder="Replace with..."
            value={replaceText}
            onChange={(e) => setReplaceText(e.target.value)}
            className="w-full pl-7 pr-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={handleReplaceAll}
            className="flex-1 bg-blue-600 text-white py-1.5 rounded text-xs font-semibold hover:bg-blue-700"
          >
            Replace All
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindReplace;
