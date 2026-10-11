import React, { useState } from 'react';
import {
  Sparkles,
  Download,
  History,
  Moon,
  Sun,
  Cloud,
  FileSpreadsheet,
  FileCode,
  FolderArchive,
  ChevronDown,
  Users,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { Campaign, Collaborator } from '../types';
import { exportCampaignToCSV, exportCampaignToJSON } from '../utils/exportData';

interface NavbarProps {
  campaign: Campaign;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  collaborators: Collaborator[];
  onOpenDownloads: () => void;
  onOpenHistory: () => void;
  onOpenCampaignSwitcher: () => void;
  onOpenConsistencyCheck: () => void;
  onForceSync: () => void;
  isSyncing: boolean;
  onBulkZipDownload: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  campaign,
  theme,
  toggleTheme,
  collaborators,
  onOpenDownloads,
  onOpenHistory,
  onOpenCampaignSwitcher,
  onOpenConsistencyCheck,
  onForceSync,
  isSyncing,
  onBulkZipDownload,
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Identity & Campaign Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-bold shadow-sm tracking-tight text-lg">
              BB
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-neutral-900 dark:text-white text-sm md:text-base">
                  Brand Builder
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <Sparkles className="w-2.5 h-2.5" />
                  Nano-Banana
                </span>
                <span className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  Zero-Humans Enforced
                </span>
              </div>
            </div>
          </div>

          <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 mx-1 hidden sm:block" />

          {/* Campaign Selector Trigger */}
          <button
            onClick={onOpenCampaignSwitcher}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left transition-colors border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700"
            title="Switch or view campaign history"
          >
            <div className="max-w-[140px] md:max-w-[200px] truncate">
              <span className="text-xs font-semibold text-neutral-900 dark:text-white block truncate">
                {campaign.name}
              </span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block truncate">
                v{campaign.version} • {campaign.productName}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          </button>
        </div>

        {/* Center: Real-Time Collaborators & Cloud Sync Status */}
        <div className="hidden md:flex items-center gap-4">
          {/* Cloud Sync Status */}
          <button
            onClick={onForceSync}
            disabled={isSyncing}
            className="flex items-center gap-2 text-xs font-mono text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors px-2 py-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
            title="Cloud synchronization status across devices. Click to force sync."
          >
            <div className="relative flex items-center justify-center">
              <span
                className={`w-2 h-2 rounded-full ${
                  isSyncing ? 'bg-amber-400 animate-ping' : 'bg-emerald-500'
                }`}
              />
              <span
                className={`absolute w-2 h-2 rounded-full ${
                  isSyncing ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
              />
            </div>
            <span className="flex items-center gap-1">
              <Cloud className="w-3.5 h-3.5 text-neutral-400" />
              {isSyncing ? 'Syncing...' : 'Cloud Synced'}
            </span>
            {isSyncing && <RefreshCw className="w-3 h-3 animate-spin text-neutral-400" />}
          </button>

          {/* Active Collaborators */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-neutral-200 dark:border-neutral-800">
            <div className="flex -space-x-1.5 overflow-hidden">
              {collaborators.slice(0, 3).map((collab) => (
                <div
                  key={collab.id}
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-neutral-900 overflow-hidden relative"
                  title={`${collab.name} (${collab.role}) - ${collab.status}`}
                >
                  <img
                    src={collab.avatar}
                    alt={collab.name}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full ring-1 ring-white ${
                      collab.status === 'editing'
                        ? 'bg-amber-500 animate-pulse'
                        : 'bg-emerald-500'
                    }`}
                  />
                </div>
              ))}
            </div>
            <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
              {collaborators.length} active
            </span>
          </div>
        </div>

        {/* Right: Actions & Tools */}
        <div className="flex items-center gap-2">
          {/* Consistency Comparator button */}
          <button
            onClick={onOpenConsistencyCheck}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors border border-neutral-200 dark:border-neutral-700"
            title="Inspect visual consistency across billboard, newspaper, and social shots"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden lg:inline">Consistency Check</span>
            <span className="lg:hidden">Compare</span>
          </button>

          {/* Dedicated Downloads Dashboard button */}
          <button
            onClick={onOpenDownloads}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 shadow-sm transition-all"
            title="Open High-Resolution Downloads Dashboard"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Downloads</span>
            <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-neutral-700 dark:bg-neutral-200 text-neutral-100 dark:text-neutral-800 font-mono">
              {campaign.mediums.length}
            </span>
          </button>

          {/* Export Menu Dropdown (CSV / JSON / Bulk ZIP) */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors border border-neutral-200 dark:border-neutral-700"
              title="Raw data & bulk export"
            >
              <FolderArchive className="w-4 h-4" />
            </button>

            {showExportMenu && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowExportMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xl z-40 py-1.5 text-xs">
                  <div className="px-3 py-1 font-semibold text-neutral-400 uppercase tracking-wider text-[10px]">
                    Export Formats
                  </div>
                  <button
                    onClick={() => {
                      exportCampaignToCSV(campaign);
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                    <div>
                      <div className="font-medium">Raw Analytics (CSV)</div>
                      <div className="text-[10px] text-neutral-500">For Excel, Sheets & BI pipelines</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      exportCampaignToJSON(campaign);
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
                  >
                    <FileCode className="w-4 h-4 text-blue-500" />
                    <div>
                      <div className="font-medium">Raw Brand Data (JSON)</div>
                      <div className="text-[10px] text-neutral-500">Complete schema & prompt tokens</div>
                    </div>
                  </button>
                  <div className="h-px bg-neutral-200 dark:bg-neutral-700 my-1" />
                  <button
                    onClick={() => {
                      onBulkZipDownload();
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
                  >
                    <FolderArchive className="w-4 h-4 text-amber-500" />
                    <div>
                      <div className="font-medium">Bulk Download (ZIP)</div>
                      <div className="text-[10px] text-neutral-500">All high-res images + metadata</div>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Activity History Log Drawer Trigger */}
          <button
            onClick={onOpenHistory}
            className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors border border-neutral-200 dark:border-neutral-700"
            title="View activity history log & collaborative audit trail"
          >
            <History className="w-4 h-4" />
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors border border-neutral-200 dark:border-neutral-700"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
