import React, { useState } from 'react';
import {
  X,
  Download,
  FolderArchive,
  FileSpreadsheet,
  FileCode,
  CheckSquare,
  Square,
  Sparkles,
  ShieldCheck,
  HardDrive,
  Printer,
  Layers,
  ArrowDownToLine,
  Check,
} from 'lucide-react';
import JSZip from 'jszip';
import { Campaign, MediumAsset } from '../types';
import { exportCampaignToCSV, exportCampaignToJSON, downloadImage } from '../utils/exportData';

interface DownloadsDashboardProps {
  campaign: Campaign;
  onClose: () => void;
}

export const DownloadsDashboard: React.FC<DownloadsDashboardProps> = ({
  campaign,
  onClose,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    campaign.mediums.map((m) => m.id)
  );
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === campaign.mediums.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(campaign.mediums.map((m) => m.id));
    }
  };

  // Bulk ZIP Packaging
  const handleBulkZipDownload = async () => {
    if (selectedIds.length === 0) return;
    setIsZipping(true);
    setZipProgress(10);

    try {
      const zip = new JSZip();
      const assetsToPack = campaign.mediums.filter((m) => selectedIds.includes(m.id));

      // 1. Pack Images
      const imgFolder = zip.folder('high_resolution_renders');
      for (let i = 0; i < assetsToPack.length; i++) {
        const asset = assetsToPack[i];
        const filename = `${campaign.productName.toLowerCase().replace(/\s+/g, '_')}_${asset.mediumType}_${asset.aspectRatio.replace(':', 'x')}.png`;

        if (asset.imageUrl.startsWith('data:image')) {
          const base64Data = asset.imageUrl.split(',')[1];
          imgFolder?.file(filename, base64Data, { base64: true });
        } else if (asset.imageUrl) {
          // If URL, fetch as blob
          try {
            const resp = await fetch(asset.imageUrl);
            const blob = await resp.blob();
            imgFolder?.file(filename, blob);
          } catch {
            // fallback text
          }
        }
        setZipProgress(Math.round(10 + ((i + 1) / assetsToPack.length) * 60));
      }

      // 2. Pack Brand Metadata & DNA (JSON)
      const campaignMetadata = {
        campaignId: campaign.id,
        campaignName: campaign.name,
        productName: campaign.productName,
        category: campaign.category,
        tagline: campaign.tagline,
        visualDna: campaign.visualDna,
        exportedAt: new Date().toISOString(),
        engine: 'Nano-Banana (gemini-3.1-flash-lite-image)',
        enforcedNegativeConstraints: ['Zero Humans', 'No Hands', 'No Faces', 'Architecture & Still Life Only'],
        assets: assetsToPack.map((a) => ({
          medium: a.mediumType,
          aspectRatio: a.aspectRatio,
          resolution: a.resolution,
          consistencyScore: a.consistencyScore,
          headline: a.headline,
          prompt: a.prompt,
        })),
      };
      zip.file('campaign_metadata.json', JSON.stringify(campaignMetadata, null, 2));

      // 3. Pack README & Print Guidelines
      const readmeText = `# ${campaign.name} - High-Resolution Deliverables Package
Product: ${campaign.productName}
Tagline: ${campaign.tagline}
Generated with: Nano-Banana Image Engine
Art Direction: Professional Minimalist, Human-Free Architectural Mockup

## Asset Deliverables
${assetsToPack.map((a) => `- ${a.title} (${a.aspectRatio}, ${a.resolution})`).join('\n')}

## Print & Billboard Specifications
- Outdoor Billboard: 3840x2160 UHD (16:9)
- Newspaper: 2400x3200 300 DPI Broadsheet
- Social Editorial: 2048x2048 Retina 1:1
- Transit Lightbox: 2160x3840 9:16 Vertical
`;
      zip.file('README_PRINT_SPECS.txt', readmeText);

      setZipProgress(85);
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      setZipProgress(100);

      // Download trigger
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = `${campaign.productName.toLowerCase().replace(/\s+/g, '_')}_campaign_assets_bundle.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('ZIP generation error:', err);
    } finally {
      setIsZipping(false);
      setZipProgress(0);
    }
  };

  const totalBytes = campaign.mediums.reduce((acc, m) => acc + (m.fileSizeBytes || 0), 0);
  const totalMB = (totalBytes / (1024 * 1024)).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 sm:p-6 overflow-hidden animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[90vh] bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col overflow-hidden text-xs">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between shrink-0 bg-neutral-50/70 dark:bg-neutral-900/70">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                High-Resolution Downloads Dashboard
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                {campaign.productName}
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
              Export high-resolution master assets in 4K, 300 DPI print-ready formats, or download raw analytical datasets.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-6 border-b border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900/40">
          <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
              TOTAL DELIVERABLES
            </span>
            <div className="text-xl font-extrabold text-neutral-900 dark:text-white mt-1">
              {campaign.mediums.length} Mediums
            </div>
            <span className="text-[10px] text-neutral-500 block mt-0.5">
              All visual DNA synced
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
              EST. PACKAGE SIZE
            </span>
            <div className="text-xl font-extrabold text-neutral-900 dark:text-white mt-1">
              {totalMB} MB
            </div>
            <span className="text-[10px] text-neutral-500 block mt-0.5">
              Lossless PNG Master Renders
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
              PRINT & OUTDOOR READY
            </span>
            <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
              <Printer className="w-4 h-4" />
              300 DPI
            </div>
            <span className="text-[10px] text-neutral-500 block mt-0.5">
              Billboard & Broadsheet specs
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
              MODEL ENGINE
            </span>
            <div className="text-xl font-extrabold text-amber-500 mt-1 flex items-center gap-1 truncate">
              <Sparkles className="w-4 h-4 shrink-0" />
              Nano-Banana
            </div>
            <span className="text-[10px] text-neutral-500 block mt-0.5">
              Zero-Human Enforced
            </span>
          </div>
        </div>

        {/* Bulk Action Controls Bar */}
        <div className="px-6 py-3 bg-neutral-100/60 dark:bg-neutral-800/40 border-b border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-1.5 font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
            >
              {selectedIds.length === campaign.mediums.length ? (
                <CheckSquare className="w-4 h-4 text-emerald-500" />
              ) : (
                <Square className="w-4 h-4 text-neutral-400" />
              )}
              <span>
                {selectedIds.length === campaign.mediums.length
                  ? 'All Selected'
                  : `Select All (${selectedIds.length}/${campaign.mediums.length})`}
              </span>
            </button>
          </div>

          {/* Export Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportCampaignToCSV(campaign)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-medium transition-colors shadow-2xs"
              title="Export raw tabular data for analytical BI tools (Excel, Tableau, Sheets)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => exportCampaignToJSON(campaign)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-medium transition-colors shadow-2xs"
              title="Export enterprise brand schema for JSON pipelines"
            >
              <FileCode className="w-3.5 h-3.5 text-blue-500" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={handleBulkZipDownload}
              disabled={isZipping || selectedIds.length === 0}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <FolderArchive className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600" />
              <span>
                {isZipping
                  ? `Archiving ZIP (${zipProgress}%)...`
                  : `Bulk Download (${selectedIds.length} Assets ZIP)`}
              </span>
            </button>
          </div>
        </div>

        {/* Deliverables List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {campaign.mediums.map((asset) => {
            const isSelected = selectedIds.includes(asset.id);
            return (
              <div
                key={asset.id}
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'border-neutral-900 dark:border-white bg-white dark:bg-neutral-800/90 shadow-xs'
                    : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 opacity-75'
                }`}
              >
                {/* Left: Checkbox + Thumbnail */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <button
                    onClick={() => toggleSelect(asset.id)}
                    className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>

                  <div className="w-16 h-12 rounded-lg bg-neutral-200 dark:bg-neutral-950 overflow-hidden shrink-0 border border-neutral-300 dark:border-neutral-700">
                    {asset.imageUrl ? (
                      <img
                        src={asset.imageUrl}
                        alt={asset.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400 font-mono text-[9px]">
                        N/A
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-900 dark:text-white truncate">
                        {asset.title}
                      </span>
                      <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300">
                        {asset.aspectRatio}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                      <span className="font-mono">{asset.resolution}</span>
                      <span>•</span>
                      <span>{(asset.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB</span>
                      <span>•</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                        {asset.consistencyScore}% DNA Match
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Individual Download Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => downloadImage(asset, campaign.productName)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-medium transition-colors cursor-pointer"
                    title="Download this asset in master resolution"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PNG</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
