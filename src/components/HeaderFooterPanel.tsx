import React from 'react';
import type { HeaderFooterSettings } from '../types/headerFooter';
import { Layout, ToggleLeft, ToggleRight, AlignLeft, AlignCenter, AlignRight, Image as ImageIcon, X } from 'lucide-react';

interface HeaderFooterPanelProps {
  settings: HeaderFooterSettings;
  onChange: (settings: HeaderFooterSettings) => void;
}

const HeaderFooterPanel: React.FC<HeaderFooterPanelProps> = ({ settings, onChange }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const updateHeader = (key: keyof HeaderFooterSettings['header'], value: any) => {
    onChange({ ...settings, header: { ...settings.header, [key]: value } });
  };

  const updateFooter = (key: keyof HeaderFooterSettings['footer'], value: any) => {
    onChange({ ...settings, footer: { ...settings.footer, [key]: value } });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        updateHeader('logo', readerEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layout className="w-4 h-4 text-blue-600" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Header</h3>
          </div>
          <button onClick={() => updateHeader('enabled', !settings.header.enabled)}>
            {settings.header.enabled ? <ToggleRight className="text-blue-600 w-6 h-6" /> : <ToggleLeft className="text-gray-300 w-6 h-6" />}
          </button>
        </div>

        {settings.header.enabled && (
          <div className="space-y-3 pl-1 animate-in fade-in slide-in-from-top-1">
            {/* Logo Upload */}
            <div>
              <label className="block text-[10px] text-gray-400 uppercase mb-1">Header Logo</label>
              {settings.header.logo ? (
                <div className="relative w-16 h-16 bg-gray-50 border border-gray-200 rounded p-1">
                  <img src={settings.header.logo} alt="Logo" className="w-full h-full object-contain" />
                  <button
                    onClick={() => updateHeader('logo', undefined)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-12 border border-dashed border-gray-200 rounded flex items-center justify-center gap-2 text-xs text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <ImageIcon className="w-4 h-4" /> Upload Logo
                </button>
              )}
              <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 uppercase mb-1">Header Text</label>
              <input
                type="text"
                value={settings.header.text}
                onChange={(e) => updateHeader('text', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-xs"
                placeholder="E.g. Company Name"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                <input type="checkbox" checked={settings.header.showTitle} onChange={(e) => updateHeader('showTitle', e.target.checked)} className="rounded" />
                Show Document Title
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                <input type="checkbox" checked={settings.header.showDate} onChange={(e) => updateHeader('showDate', e.target.checked)} className="rounded" />
                Show Current Date
              </label>
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 uppercase mb-1">Alignment</label>
              <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
                {(['left', 'center', 'right'] as const).map((align) => (
                  <button
                    key={align}
                    onClick={() => updateHeader('alignment', align)}
                    className={`px-3 py-1 rounded transition-all ${
                      settings.header.alignment === align ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'
                    }`}
                  >
                    {align === 'left' && <AlignLeft className="w-3 h-3" />}
                    {align === 'center' && <AlignCenter className="w-3 h-3" />}
                    {align === 'right' && <AlignRight className="w-3 h-3" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Section */}
      <div className="space-y-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layout className="w-4 h-4 text-blue-600 rotate-180" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Footer</h3>
          </div>
          <button onClick={() => updateFooter('enabled', !settings.footer.enabled)}>
            {settings.footer.enabled ? <ToggleRight className="text-blue-600 w-6 h-6" /> : <ToggleLeft className="text-gray-300 w-6 h-6" />}
          </button>
        </div>

        {settings.footer.enabled && (
          <div className="space-y-3 pl-1 animate-in fade-in slide-in-from-top-1">
             <div>
              <label className="block text-[10px] text-gray-400 uppercase mb-1">Footer Text</label>
              <input
                type="text"
                value={settings.footer.text}
                onChange={(e) => updateFooter('text', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-xs"
                placeholder="E.g. Internal Document"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                <input type="checkbox" checked={settings.footer.showPageNumbers} onChange={(e) => updateFooter('showPageNumbers', e.target.checked)} className="rounded" />
                Show Page Numbers
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                <input type="checkbox" checked={settings.footer.showCopyright} onChange={(e) => updateFooter('showCopyright', e.target.checked)} className="rounded" />
                Show Copyright
              </label>
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 uppercase mb-1">Alignment</label>
              <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
                {(['left', 'center', 'right'] as const).map((align) => (
                  <button
                    key={align}
                    onClick={() => updateFooter('alignment', align)}
                    className={`px-3 py-1 rounded transition-all ${
                      settings.footer.alignment === align ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'
                    }`}
                  >
                    {align === 'left' && <AlignLeft className="w-3 h-3" />}
                    {align === 'center' && <AlignCenter className="w-3 h-3" />}
                    {align === 'right' && <AlignRight className="w-3 h-3" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderFooterPanel;
