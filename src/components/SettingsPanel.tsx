import React from 'react';
import type { PageSettings, PageSize, Orientation, Unit } from '../types/settings';
import { Settings, Maximize2, Minimize2, Move } from 'lucide-react';

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

  return (
    <div className="flex flex-col gap-6 p-6 overflow-y-auto max-h-full bg-white border-l border-gray-200 w-80">
      <div className="flex items-center gap-2 mb-2">
        <Settings className="w-5 h-5 text-blue-600" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">Page Settings</h2>
      </div>

      <div className="space-y-4">
        {/* Page Size */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Page Size</label>
          <div className="grid grid-cols-2 gap-2">
            {(['A4', 'LETTER', 'LEGAL', 'A5'] as PageSize[]).map((size) => (
              <button
                key={size}
                onClick={() => updateSetting('pageSize', size)}
                className={`py-2 px-3 text-xs rounded-md border transition-all ${
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

        {/* Orientation */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Orientation</label>
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            {(['portrait', 'landscape'] as Orientation[]).map((mode) => (
              <button
                key={mode}
                onClick={() => updateSetting('orientation', mode)}
                className={`flex-1 py-1.5 px-3 text-xs rounded-md transition-all flex items-center justify-center gap-2 capitalize ${
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

        {/* Units */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Units</label>
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            {(['mm', 'px', 'in'] as Unit[]).map((unit) => (
              <button
                key={unit}
                onClick={() => updateSetting('unit', unit)}
                className={`flex-1 py-1.5 px-3 text-xs rounded-md transition-all ${
                  settings.unit === unit
                    ? 'bg-white shadow-sm text-blue-600 font-bold'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {unit}
              </button>
            ))}
          </div>
        </div>

        {/* Margins */}
        <div>
          <div className="flex items-center gap-2 mb-3">
             <Move className="w-3 h-3 text-gray-400" />
             <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Margins ({settings.unit})</label>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
              <div key={side}>
                <label className="block text-[10px] text-gray-400 uppercase mb-1">{side}</label>
                <input
                  type="number"
                  value={settings.margins[side]}
                  onChange={(e) => updateMargin(side, Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-gray-100">
        <p className="text-[10px] text-gray-400 leading-relaxed italic">
          Changes are applied instantly to the preview and will be reflected in the final PDF.
        </p>
      </div>
    </div>
  );
};

export default SettingsPanel;
