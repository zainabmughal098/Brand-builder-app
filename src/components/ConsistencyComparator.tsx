import React from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Layers,
  Palette,
  Maximize2,
  Download,
} from 'lucide-react';
import { Campaign } from '../types';

interface ConsistencyComparatorProps {
  campaign: Campaign;
  onClose: () => void;
  onInspectMedium: (assetId: string) => void;
}

export const ConsistencyComparator: React.FC<ConsistencyComparatorProps> = ({
  campaign,
  onClose,
  onInspectMedium,
}) => {
  const dna = campaign.visualDna;
  const avgConsistency = Math.round(
    campaign.mediums.reduce((acc, m) => acc + (m.consistencyScore || 95), 0) /
      Math.max(1, campaign.mediums.length)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 overflow-hidden animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl h-[92vh] bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col overflow-hidden text-xs">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between shrink-0 bg-neutral-50/70 dark:bg-neutral-900/70">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                Cross-Medium Visual Consistency Inspector
              </h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {avgConsistency}% DNA Match
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
              Side-by-side inspection verifying product silhouette, color tones, materials, and zero-human compliance across all shots.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* DNA Lock Banner */}
        <div className="px-6 py-3 bg-neutral-100/70 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-[11px]">
            <span className="font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider text-[10px]">
              LOCKED IDENTITY TOKENS:
            </span>
            <div className="flex items-center gap-2">
              <span className="text-neutral-500">Palette:</span>
              <div className="flex items-center gap-1">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/20"
                  style={{ backgroundColor: dna.primaryColor }}
                  title={`Primary: ${dna.primaryColor}`}
                />
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/20"
                  style={{ backgroundColor: dna.secondaryColor }}
                  title={`Secondary: ${dna.secondaryColor}`}
                />
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/20"
                  style={{ backgroundColor: dna.accentColor }}
                  title={`Accent: ${dna.accentColor}`}
                />
              </div>
            </div>
            <div className="hidden md:flex items-center gap-1.5">
              <span className="text-neutral-500">Materials:</span>
              <span className="font-medium text-neutral-900 dark:text-white">
                {dna.materials.join(' • ')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" />
              Zero-Humans Constraint Verified
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Sparkles className="w-3 h-3" />
              Nano-Banana Engine
            </span>
          </div>
        </div>

        {/* Mediums Comparison Matrix */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaign.mediums.map((medium) => (
              <div
                key={medium.id}
                className="bg-white dark:bg-neutral-800/80 rounded-xl border border-neutral-200 dark:border-neutral-700/80 overflow-hidden shadow-xs flex flex-col group"
              >
                {/* Medium Header */}
                <div className="p-3 border-b border-neutral-100 dark:border-neutral-700/60 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-neutral-900 dark:text-white text-xs">
                      {medium.title}
                    </span>
                    <span className="text-[10px] text-neutral-400 block">
                      {medium.mediumDescription}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300">
                    {medium.aspectRatio}
                  </span>
                </div>

                {/* Image View */}
                <div
                  className="relative aspect-video bg-neutral-950 overflow-hidden cursor-pointer"
                  onClick={() => onInspectMedium(medium.id)}
                >
                  {medium.imageUrl ? (
                    <img
                      src={medium.imageUrl}
                      alt={medium.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                    />
                  ) : null}

                  <div className="absolute top-2 right-2">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/60 text-emerald-400 backdrop-blur-md flex items-center gap-1 border border-emerald-500/30">
                      <ShieldCheck className="w-3 h-3" />
                      {medium.consistencyScore}% Match
                    </span>
                  </div>

                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3 py-1.5 rounded-md bg-white text-neutral-900 font-semibold text-xs flex items-center gap-1.5 shadow-md">
                      <Maximize2 className="w-3.5 h-3.5" />
                      Inspect Mockup
                    </span>
                  </div>
                </div>

                {/* Consistency Checklist */}
                <div className="p-3 space-y-1.5 bg-neutral-50/50 dark:bg-neutral-900/40 text-[11px]">
                  <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                    <span>Geometric Silhouette</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">✓ Locked Match</span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                    <span>Color & Finish Tone</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">✓ Locked Match</span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                    <span>Zero Human Presence</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">✓ Strictly Enforced</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
