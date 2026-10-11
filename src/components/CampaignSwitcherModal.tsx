import React, { useRef } from 'react';
import {
  X,
  Plus,
  FolderOpen,
  Copy,
  Trash2,
  Upload,
  Calendar,
  Layers,
  Sparkles,
  Check,
} from 'lucide-react';
import { Campaign } from '../types';

interface CampaignSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaigns: Campaign[];
  activeCampaignId: string;
  onSelectCampaign: (id: string) => void;
  onCreateNew: () => void;
  onDuplicate: (campaign: Campaign) => void;
  onDelete: (id: string) => void;
  onImportJSON: (imported: Campaign) => void;
}

export const CampaignSwitcherModal: React.FC<CampaignSwitcherModalProps> = ({
  isOpen,
  onClose,
  campaigns,
  activeCampaignId,
  onSelectCampaign,
  onCreateNew,
  onDuplicate,
  onDelete,
  onImportJSON,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.campaign) {
          onImportJSON(json.campaign);
        } else if (json.productName && json.visualDna) {
          onImportJSON(json);
        }
      } catch (err) {
        alert('Invalid campaign JSON format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 sm:p-6 overflow-hidden animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col overflow-hidden text-xs">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between shrink-0 bg-neutral-50/70 dark:bg-neutral-900/70">
          <div>
            <h2 className="text-base font-bold text-neutral-900 dark:text-white">
              Campaigns History & Cloud Switcher
            </h2>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
              Access previous campaign iterations, clone visual DNA setups, or create new product briefs.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="px-6 py-3 bg-neutral-100/50 dark:bg-neutral-800/40 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onCreateNew();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Brand Campaign</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-medium transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-neutral-500" />
              <span>Import JSON</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              className="hidden"
            />
          </div>

          <span className="font-mono text-[11px] text-neutral-500">
            {campaigns.length} campaigns saved
          </span>
        </div>

        {/* Campaign List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {campaigns.map((camp) => {
            const isActive = camp.id === activeCampaignId;
            return (
              <div
                key={camp.id}
                onClick={() => {
                  onSelectCampaign(camp.id);
                  onClose();
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isActive
                    ? 'border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-800/90 shadow-xs ring-1 ring-neutral-900 dark:ring-white'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-900 dark:text-white text-sm truncate">
                      {camp.name}
                    </span>
                    {isActive && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    )}
                    <span className="font-mono text-[10px] text-neutral-400">
                      v{camp.version}
                    </span>
                  </div>

                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-1">
                    {camp.productName} • {camp.tagline}
                  </div>

                  {/* Visual DNA Swatches & Specs */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <span
                        className="w-3 h-3 rounded-full border border-black/10"
                        style={{ backgroundColor: camp.visualDna?.primaryColor }}
                      />
                      <span
                        className="w-3 h-3 rounded-full border border-black/10"
                        style={{ backgroundColor: camp.visualDna?.secondaryColor }}
                      />
                      <span
                        className="w-3 h-3 rounded-full border border-black/10"
                        style={{ backgroundColor: camp.visualDna?.accentColor }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {camp.mediums?.length || 0} Deliverables
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      Updated {new Date(camp.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onDuplicate(camp)}
                    className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                    title="Duplicate campaign"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  {campaigns.length > 1 && (
                    <button
                      onClick={() => onDelete(camp.id)}
                      className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-950/50 text-neutral-400 hover:text-red-500 transition-colors"
                      title="Delete campaign"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
