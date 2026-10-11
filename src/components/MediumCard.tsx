import React from 'react';
import {
  Download,
  Maximize2,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Check,
  Copy,
  Layers,
  FileText,
} from 'lucide-react';
import { MediumAsset } from '../types';

interface MediumCardProps {
  asset: MediumAsset;
  productName: string;
  onInspect: (asset: MediumAsset) => void;
  onDownload: (asset: MediumAsset) => void;
  onRegenerate: (asset: MediumAsset) => void;
  isRegenerating: boolean;
}

export const MediumCard: React.FC<MediumCardProps> = ({
  asset,
  productName,
  onInspect,
  onDownload,
  onRegenerate,
  isRegenerating,
}) => {
  const [copied, setCopied] = React.useState(false);

  const copyPrompt = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(asset.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine aspect ratio class
  let aspectClass = 'aspect-video';
  if (asset.aspectRatio === '1:1') aspectClass = 'aspect-square';
  if (asset.aspectRatio === '3:4') aspectClass = 'aspect-[3/4]';
  if (asset.aspectRatio === '4:3') aspectClass = 'aspect-[4/3]';
  if (asset.aspectRatio === '9:16') aspectClass = 'aspect-[9/16]';

  return (
    <div className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col">
      {/* Card Header */}
      <div className="p-3.5 border-b border-neutral-100 dark:border-neutral-800/60 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-neutral-900 dark:text-white text-xs truncate">
              {asset.title}
            </span>
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
              {asset.aspectRatio}
            </span>
          </div>
          <p className="text-[10px] text-neutral-400 dark:text-neutral-500 truncate mt-0.5">
            {asset.mediumDescription}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Consistency Badge */}
          <span
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
            title="Locked Visual DNA Consistency Score"
          >
            <ShieldCheck className="w-2.5 h-2.5" />
            {asset.consistencyScore}%
          </span>
        </div>
      </div>

      {/* Image Container */}
      <div
        className={`relative w-full ${aspectClass} bg-neutral-100 dark:bg-neutral-950 overflow-hidden cursor-pointer`}
        onClick={() => onInspect(asset)}
      >
        {asset.imageUrl ? (
          <img
            src={asset.imageUrl}
            alt={asset.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-neutral-400">
            <Layers className="w-8 h-8 mb-2 stroke-1" />
            <span className="text-xs font-mono">Render pending</span>
          </div>
        )}

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-neutral-950/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onInspect(asset);
            }}
            className="p-2.5 rounded-full bg-white/90 text-neutral-900 hover:bg-white shadow-md transition-transform hover:scale-110"
            title="Inspect high resolution mockup"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload(asset);
            }}
            className="p-2.5 rounded-full bg-white/90 text-neutral-900 hover:bg-white shadow-md transition-transform hover:scale-110"
            title="Download high-res asset"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRegenerate(asset);
            }}
            disabled={isRegenerating}
            className="p-2.5 rounded-full bg-white/90 text-neutral-900 hover:bg-white shadow-md transition-transform hover:scale-110 disabled:opacity-50"
            title="Regenerate single medium shot"
          >
            <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Model Engine Tag */}
        <div className="absolute bottom-2 left-2 pointer-events-none">
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-black/60 text-white backdrop-blur-md flex items-center gap-1 border border-white/10">
            <Sparkles className="w-2.5 h-2.5 text-amber-400" />
            Nano-Banana
          </span>
        </div>
      </div>

      {/* Card Footer / Copy & Specs */}
      <div className="p-3.5 space-y-2 text-xs flex-1 flex flex-col justify-between">
        <div>
          <div className="font-bold text-neutral-900 dark:text-neutral-100 line-clamp-1">
            {asset.headline}
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-0.5">
            {asset.subcopy}
          </p>
        </div>

        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/60 flex items-center justify-between text-[10px] font-mono text-neutral-400">
          <span>{asset.resolution}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={copyPrompt}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-0.5"
              title="Copy generation prompt"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Prompt'}</span>
            </button>
            <span>•</span>
            <button
              onClick={() => onDownload(asset)}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors font-medium flex items-center gap-0.5 text-neutral-700 dark:text-neutral-300"
            >
              <Download className="w-3 h-3" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
