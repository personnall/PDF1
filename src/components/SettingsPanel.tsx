import React from 'react';
import type { PageSettings } from '../types/settings';
import { Settings, Maximize2, Minimize2, Move, Palette, ShieldCheck } from 'lucide-react';

interface SettingsPanelProps {
  settings: PageSettings;
  onChange: (settings: PageSettings) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onChange }) => {
  const updateSetting = (key: keyof PageSettings, value: any) => {
    onChange({ ...settings, [key]: value });
  };

  const updateMargin = (margin: keyof PageSettings['margins'], value: number) => {
    onChange({
      ...settings,
      margins: { ...settings.margins, [margin]: value }
    });
  };

  const updateWatermark = (key: keyof PageSettings['watermark'], value: any) => {
    onChange({
      ...settings,
      watermark: { ...settings.watermark, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Settings className="w-4 h-4 text-blue-600" />
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Page Configuration</h3>
      </div>

      <div className="space-y-6">
        {/* Page Essentials */}
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] text-gray-400 uppercase mb-1 tracking-wide">Page Size</label>
            <div className="grid grid-cols-2 gap-2">
              {(['A4', 'LETTER', 'LEGAL', 'A5'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => updateSetting('pageSize', size)}
                  className={`py-1.5 px-3 text-xs rounded-md border transition-all ${
                    settings.pageSize === size
                      ? 'border-blue-600 bg-blue-50 text-blue-600 font-bold'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-gray-400 uppercase mb-1 tracking-wide">Orientation</label>
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              {(['portrait', 'landscape'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => updateSetting('orientation', mode)}
                  className={`flex-1 py-1.5 px-3 text-[10px] rounded-md transition-all flex items-center justify-center gap-2 capitalize ${
                    settings.orientation === mode
                      ? 'bg-white shadow-sm text-blue-600 font-bold'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {mode === 'portrait' ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3 rotate-90" />}
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Colors & Borders */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
           <div className="flex items-center gap-2">
              <Palette className="w-3 h-3 text-gray-400" />
              <label className="block text-[10px] text-gray-400 uppercase tracking-wide">Appearance</label>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="block text-[8px] text-gray-400 uppercase mb-1">Background</label>
                 <input type="color" value={settings.backgroundColor} onChange={(e) => updateSetting('backgroundColor', e.target.value)} className="w-full h-8 rounded border-0 p-0" />
              </div>
              <div>
                 <label className="block text-[8px] text-gray-400 uppercase mb-1">Border Color</label>
                 <input type="color" value={settings.borderColor} onChange={(e) => updateSetting('borderColor', e.target.value)} className="w-full h-8 rounded border-0 p-0" />
              </div>
           </div>
           <div>
              <label className="block text-[8px] text-gray-400 uppercase mb-1">Border Width</label>
              <input type="range" min="0" max="10" value={settings.borderWidth} onChange={(e) => updateSetting('borderWidth', Number(e.target.value))} className="w-full" />
           </div>
        </div>

        {/* Watermark */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <ShieldCheck className="w-3 h-3 text-gray-400" />
                 <label className="block text-[10px] text-gray-400 uppercase tracking-wide">Watermark</label>
              </div>
              <input type="checkbox" checked={settings.watermark.enabled} onChange={(e) => updateWatermark('enabled', e.target.checked)} className="rounded" />
           </div>
           {settings.watermark.enabled && (
             <div className="space-y-3">
                <input
                  type="text"
                  value={settings.watermark.text}
                  onChange={(e) => updateWatermark('text', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs"
                  placeholder="Watermark text"
                />
                <div className="grid grid-cols-2 gap-2">
                   <div>
                      <label className="block text-[8px] text-gray-400 uppercase">Opacity</label>
                      <input type="number" step="0.1" min="0" max="1" value={settings.watermark.opacity} onChange={(e) => updateWatermark('opacity', Number(e.target.value))} className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs" />
                   </div>
                   <div>
                      <label className="block text-[8px] text-gray-400 uppercase">Rotation</label>
                      <input type="number" value={settings.watermark.rotation} onChange={(e) => updateWatermark('rotation', Number(e.target.value))} className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs" />
                   </div>
                </div>
             </div>
           )}
        </div>

        {/* Margins */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-2">
             <Move className="w-3 h-3 text-gray-400" />
             <label className="block text-[10px] text-gray-400 uppercase tracking-wide">Margins ({settings.unit})</label>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
              <div key={side}>
                <label className="block text-[8px] text-gray-400 uppercase mb-0.5">{side}</label>
                <input
                  type="number"
                  value={settings.margins[side]}
                  onChange={(e) => updateMargin(side, Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
