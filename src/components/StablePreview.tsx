import React, { useState, useEffect } from 'react';
import { usePDF } from '@react-pdf/renderer';
import { PDFDocument } from './PDFDocument';
import type { PageSettings } from '../types/settings';
import type { TextStyling } from '../types/styling';
import type { HeaderFooterSettings } from '../types/headerFooter';
import { Loader2 } from 'lucide-react';

interface StablePreviewProps {
  title: string;
  content: string;
  settings: PageSettings;
  styling: TextStyling;
  hf: HeaderFooterSettings;
  zoom: number;
}

const StablePreview: React.FC<StablePreviewProps> = ({ title, content, settings, styling, hf, zoom }) => {
  const [instance, updateInstance] = usePDF({
    document: <PDFDocument title={title} content={content} settings={settings} styling={styling} hf={hf} />,
  });

  const [activeUrl, setInstanceUrl] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Update instance when props change (debounced in parent or here)
  useEffect(() => {
    setIsUpdating(true);
    updateInstance(<PDFDocument title={title} content={content} settings={settings} styling={styling} hf={hf} />);
  }, [title, content, settings, styling, hf, updateInstance]);

  useEffect(() => {
    if (!instance.loading && instance.url) {
      // Small delay to ensure the PDF is ready
      const timer = setTimeout(() => {
        setInstanceUrl(instance.url);
        setIsUpdating(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [instance.loading, instance.url]);

  return (
    <div className="relative w-full h-full bg-gray-100 flex items-center justify-center overflow-hidden">
      {isUpdating && (
        <div className="absolute top-4 right-4 z-20 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2 text-[10px] font-bold text-blue-600 animate-in fade-in zoom-in">
          <Loader2 className="w-3 h-3 animate-spin" />
          REFRESHING...
        </div>
      )}

      {activeUrl ? (
        <iframe
          src={`${activeUrl}#toolbar=0&navpanes=0&scrollbar=0`}
          className="w-full h-full border-none transition-opacity duration-300 shadow-2xl bg-white"
          style={{
            opacity: isUpdating ? 0.8 : 1,
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            width: settings.orientation === 'portrait' ? '595px' : '842px',
            height: settings.orientation === 'portrait' ? '842px' : '595px',
          }}
          title="PDF Preview"
        />
      ) : (
        <div className="flex flex-col items-center gap-4 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-sm font-medium uppercase tracking-widest">Preparing Document...</p>
        </div>
      )}
    </div>
  );
};

export default StablePreview;
