import React from 'react';
import type { TextStyling } from '../types/styling';
import { Type, AlignLeft, AlignCenter, AlignRight, AlignJustify, Bold, Columns } from 'lucide-react';

interface StylingPanelProps {
  styling: TextStyling;
  onChange: (styling: TextStyling) => void;
}

const StylingPanel: React.FC<StylingPanelProps> = ({ styling, onChange }) => {
  const update = (key: keyof TextStyling, value: any) => {
    onChange({ ...styling, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Type className="w-4 h-4 text-blue-600" />
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Typography</h3>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Font Family */}
        <div>
          <label className="block text-[10px] text-gray-400 uppercase mb-1">Font Family</label>
          <select
            value={styling.fontFamily}
            onChange={(e) => update('fontFamily', e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="Helvetica">Helvetica (Sans)</option>
            <option value="Times-Roman">Times New Roman (Serif)</option>
            <option value="Courier">Courier (Mono)</option>
          </select>
        </div>

        {/* Layout: Columns */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Columns className="w-3 h-3 text-gray-400" />
            <label className="block text-[10px] text-gray-400 uppercase">Columns</label>
          </div>
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                onClick={() => update('columns', num)}
                className={`flex-1 py-1 rounded text-xs transition-all ${
                  styling.columns === num ? 'bg-white shadow-sm text-blue-600 font-bold' : 'text-gray-400'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Font Size & Weight */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] text-gray-400 uppercase mb-1">Size</label>
            <input
              type="number"
              value={styling.fontSize}
              onChange={(e) => update('fontSize', Number(e.target.value))}
              className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-[10px] text-gray-400 uppercase mb-1">Weight</label>
            <button
              onClick={() => update('fontWeight', styling.fontWeight === 'bold' ? 'normal' : 'bold')}
              className={`w-full py-1.5 rounded border text-xs flex items-center justify-center gap-1 transition-all ${
                styling.fontWeight === 'bold' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-gray-50 border-gray-200 text-gray-600'
              }`}
            >
              <Bold className="w-3 h-3" /> Bold
            </button>
          </div>
        </div>

        {/* Alignment */}
        <div>
          <label className="block text-[10px] text-gray-400 uppercase mb-1">Alignment</label>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {(['left', 'center', 'right', 'justify'] as const).map((align) => (
              <button
                key={align}
                onClick={() => update('textAlign', align)}
                className={`flex-1 flex justify-center py-1 rounded transition-all ${
                  styling.textAlign === align ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'
                }`}
              >
                {align === 'left' && <AlignLeft className="w-3 h-3" />}
                {align === 'center' && <AlignCenter className="w-3 h-3" />}
                {align === 'right' && <AlignRight className="w-3 h-3" />}
                {align === 'justify' && <AlignJustify className="w-3 h-3" />}
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div>
          <label className="block text-[10px] text-gray-400 uppercase mb-1">Text Color</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={styling.textColor}
              onChange={(e) => update('textColor', e.target.value)}
              className="w-8 h-8 rounded border-0 p-0 cursor-pointer overflow-hidden"
            />
            <input
              type="text"
              value={styling.textColor}
              onChange={(e) => update('textColor', e.target.value)}
              className="flex-1 bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none"
            />
          </div>
        </div>

        {/* Spacing Details */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-2">
           <div>
              <label className="block text-[10px] text-gray-400 uppercase mb-1">Line Height</label>
              <input type="number" step="0.1" value={styling.lineHeight} onChange={(e) => update('lineHeight', Number(e.target.value))} className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-xs" />
           </div>
           <div>
              <label className="block text-[10px] text-gray-400 uppercase mb-1">Column Gap</label>
              <input type="number" value={styling.columnGap} onChange={(e) => update('columnGap', Number(e.target.value))} className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-xs" />
           </div>
           <div>
              <label className="block text-[10px] text-gray-400 uppercase mb-1">Para Spacing</label>
              <input type="number" value={styling.paragraphSpacing} onChange={(e) => update('paragraphSpacing', Number(e.target.value))} className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-xs" />
           </div>
           <div>
              <label className="block text-[10px] text-gray-400 uppercase mb-1">Section Spacing</label>
              <input type="number" value={styling.sectionSpacing} onChange={(e) => update('sectionSpacing', Number(e.target.value))} className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-xs" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default StylingPanel;
