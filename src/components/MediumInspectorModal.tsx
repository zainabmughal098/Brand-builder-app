import React, { useState } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Info,
} from 'lucide-react';
import { Campaign, MediumAsset } from '../types';
import { downloadImage } from '../utils/exportData';

interface MediumInspectorModalProps {
  asset: MediumAsset | null;
  campaign: Campaign;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export const MediumInspectorModal: React.FC<MediumInspectorModalProps> = ({
  asset,
  campaign,
  onClose,
  onNavigate,
}) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!asset) return null;

  const copyPrompt = () => {
    navigator.clipboard.writeText(asset.prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleDownload = () => {
    downloadImage(asset, campaign.productName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 overflow-hidden animate-in fade-in duration-200">
      {/* Modal Dialog */}
      <div className="relative w-full max-w-6xl h-[90vh] bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col overflow-hidden text-xs">
        {/* Modal Top Bar */}
        <div className="h-14 px-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between shrink-0 bg-neutral-50/60 dark:bg-neutral-900/60">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-neutral-900 dark:text-white text-sm">
              {asset.title}
            </h3>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
              {asset.aspectRatio}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3 h-3" />
              {asset.consistencyScore}% Visual DNA Match
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('prev')}
              className="p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
              title="Previous medium"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('next')}
              className="p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
              title="Next medium"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 mx-1" />
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Hi-Res</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left: High-Res Image Canvas */}
          <div className="flex-1 bg-neutral-950 flex items-center justify-center p-4 relative overflow-auto group">
            {asset.imageUrl ? (
              <img
                src={asset.imageUrl}
                alt={asset.title}
                referrerPolicy="no-referrer"
                className={`max-h-full max-w-full object-contain rounded-lg shadow-2xl transition-all duration-300 ${
                  isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
                }`}
                onClick={() => setIsZoomed(!isZoomed)}
              />
            ) : null}

            {/* Zoom Toggle Pill */}
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="absolute bottom-4 right-4 p-2 rounded-lg bg-black/60 text-white backdrop-blur-md hover:bg-black/80 transition-colors flex items-center gap-1 text-[11px] font-mono border border-white/10"
            >
              {isZoomed ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
              <span>{isZoomed ? 'Reset Scale' : 'Zoom 125%'}</span>
            </button>

            {/* Model Badge */}
            <div className="absolute top-4 left-4">
              <span className="px-2 py-1 rounded bg-black/70 text-white backdrop-blur-md font-mono text-[10px] flex items-center gap-1.5 border border-white/10">
                <Sparkles className="w-3 h-3 text-amber-400" />
                {asset.modelUsed}
              </span>
            </div>
          </div>

          {/* Right: Technical Metadata & Brand Consistency Breakdown */}
          <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 space-y-4 overflow-y-auto">
            {/* Ad Copy */}
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                Medium Campaign Copy
              </span>
              <div className="font-bold text-neutral-900 dark:text-white text-sm mt-1">
                {asset.headline}
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed text-[11px]">
                {asset.subcopy}
              </p>
            </div>

            {/* Technical Specifications Table */}
            <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                Production Specifications
              </span>
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div className="p-2 rounded bg-neutral-100 dark:bg-neutral-800">
                  <span className="text-neutral-500 block text-[9px]">RESOLUTION</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    {asset.resolution}
                  </span>
                </div>
                <div className="p-2 rounded bg-neutral-100 dark:bg-neutral-800">
                  <span className="text-neutral-500 block text-[9px]">EST. FILE SIZE</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    {(asset.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
                <div className="p-2 rounded bg-neutral-100 dark:bg-neutral-800">
                  <span className="text-neutral-500 block text-[9px]">COLOR SPACE</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    sRGB / 300 DPI
                  </span>
                </div>
                <div className="p-2 rounded bg-neutral-100 dark:bg-neutral-800">
                  <span className="text-neutral-500 block text-[9px]">GENERATED</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    {new Date(asset.generatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Locked DNA Colors */}
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                Locked Color Identity
              </span>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1.5 p-1.5 rounded bg-neutral-100 dark:bg-neutral-800 flex-1">
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: campaign.visualDna.primaryColor }}
                  />
                  <span className="font-mono text-[10px] truncate">
                    {campaign.visualDna.primaryColor}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 p-1.5 rounded bg-neutral-100 dark:bg-neutral-800 flex-1">
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: campaign.visualDna.secondaryColor }}
                  />
                  <span className="font-mono text-[10px] truncate">
                    {campaign.visualDna.secondaryColor}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 p-1.5 rounded bg-neutral-100 dark:bg-neutral-800 flex-1">
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: campaign.visualDna.accentColor }}
                  />
                  <span className="font-mono text-[10px] truncate">
                    {campaign.visualDna.accentColor}
                  </span>
                </div>
              </div>
            </div>

            {/* Full Prompt Inspector */}
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                  Nano-Banana Prompt Chain
                </span>
                <button
                  onClick={copyPrompt}
                  className="flex items-center gap-1 font-mono text-[10px] text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                >
                  {copiedPrompt ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedPrompt ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-[11px] font-mono text-neutral-800 dark:text-neutral-200 leading-relaxed max-h-36 overflow-y-auto whitespace-pre-wrap select-all">
                {asset.prompt}
              </div>
            </div>

            {/* Negative Prompt Inspector */}
            <div>
              <span className="text-[10px] uppercase font-bold text-red-500 tracking-wider block mb-1">
                Enforced Negative Prompt (Zero Humans)
              </span>
              <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-[10px] font-mono text-red-700 dark:text-red-400">
                {asset.negativePrompt}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
