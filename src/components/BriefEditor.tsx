import React, { useState } from 'react';
import {
  Sparkles,
  Lock,
  Layers,
  Palette,
  ShieldAlert,
  Plus,
  X,
  Cpu,
  ChevronRight,
  Sliders,
  CheckSquare,
  Square,
  Wand2,
} from 'lucide-react';
import { Campaign, MediumType, VisualDNA } from '../types';
import { MEDIUM_CATALOG } from '../data/defaultCampaigns';

interface BriefEditorProps {
  campaign: Campaign;
  onChange: (updated: Partial<Campaign>) => void;
  onGenerate: (selectedMediums: MediumType[]) => void;
  isGenerating: boolean;
  onFieldFocus?: (fieldName: string) => void;
}

const PRESET_PALETTES = [
  {
    name: 'Obsidian & Amber',
    primary: '#1E2128',
    secondary: '#E2E8F0',
    accent: '#D97706',
    primaryName: 'Deep Obsidian',
    secondaryName: 'Alabaster',
    accentName: 'Burnished Amber',
  },
  {
    name: 'Titanium & Crimson',
    primary: '#2B2D42',
    secondary: '#8D99AE',
    accent: '#EF233C',
    primaryName: 'Titanium Graphite',
    secondaryName: 'Frosted Steel',
    accentName: 'Signal Crimson',
  },
  {
    name: 'Ceramic & Sage',
    primary: '#264653',
    secondary: '#E9D8A6',
    accent: '#2A9D8F',
    primaryName: 'Nordic Clay',
    secondaryName: 'Warm Sand',
    accentName: 'Mineral Sage',
  },
  {
    name: 'Swiss Monochrome',
    primary: '#111827',
    secondary: '#F3F4F6',
    accent: '#6B7280',
    primaryName: 'Carbon Pitch',
    secondaryName: 'Pure White',
    accentName: 'Neutral Slate',
  },
];

export const BriefEditor: React.FC<BriefEditorProps> = ({
  campaign,
  onChange,
  onGenerate,
  isGenerating,
  onFieldFocus,
}) => {
  const [selectedMediums, setSelectedMediums] = useState<MediumType[]>([
    'billboard',
    'newspaper',
    'social_post',
    'subway_poster',
  ]);
  const [newMaterial, setNewMaterial] = useState('');
  const [activeTab, setActiveTab] = useState<'brief' | 'dna' | 'mediums'>('brief');

  const dna = campaign.visualDna;

  const handleDnaChange = (field: keyof VisualDNA, value: any) => {
    onChange({
      visualDna: {
        ...dna,
        [field]: value,
      },
    });
  };

  const addMaterial = () => {
    if (!newMaterial.trim()) return;
    const updated = [...dna.materials, newMaterial.trim()];
    handleDnaChange('materials', updated);
    setNewMaterial('');
  };

  const removeMaterial = (index: number) => {
    const updated = dna.materials.filter((_, i) => i !== index);
    handleDnaChange('materials', updated);
  };

  const toggleMedium = (type: MediumType) => {
    if (selectedMediums.includes(type)) {
      if (selectedMediums.length > 1) {
        setSelectedMediums(selectedMediums.filter((m) => m !== type));
      }
    } else {
      setSelectedMediums([...selectedMediums, type]);
    }
  };

  const selectAllMediums = () => {
    setSelectedMediums(MEDIUM_CATALOG.map((m) => m.type));
  };

  return (
    <aside className="w-full lg:w-96 shrink-0 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm flex flex-col transition-colors">
      {/* Editor Header */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
              Campaign Spec
            </span>
          </div>
          <span className="text-[11px] font-mono text-neutral-400">
            Real-Time Synced
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-0.5 rounded-lg bg-neutral-200/60 dark:bg-neutral-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('brief')}
            className={`flex-1 py-1.5 rounded-md transition-all ${
              activeTab === 'brief'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-semibold'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Product Brief
          </button>
          <button
            onClick={() => setActiveTab('dna')}
            className={`flex-1 py-1.5 rounded-md transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'dna'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-semibold'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Lock className="w-3 h-3 text-amber-500" />
            Visual DNA
          </button>
          <button
            onClick={() => setActiveTab('mediums')}
            className={`flex-1 py-1.5 rounded-md transition-all ${
              activeTab === 'mediums'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-semibold'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Mediums ({selectedMediums.length})
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-280px)] text-xs">
        {/* TAB 1: PRODUCT BRIEF */}
        {activeTab === 'brief' && (
          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Product Name
              </label>
              <input
                type="text"
                value={campaign.productName}
                onFocus={() => onFieldFocus?.('productName')}
                onChange={(e) => onChange({ productName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white outline-hidden font-medium"
                placeholder="e.g. AURA Monolith Soundbar"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Industry Category
              </label>
              <input
                type="text"
                value={campaign.category}
                onFocus={() => onFieldFocus?.('category')}
                onChange={(e) => onChange({ category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white outline-hidden"
                placeholder="e.g. Acoustic Industrial Design"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Primary Tagline
              </label>
              <input
                type="text"
                value={campaign.tagline}
                onFocus={() => onFieldFocus?.('tagline')}
                onChange={(e) => onChange({ tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white outline-hidden"
                placeholder="e.g. Pure Acoustic Clarity in Monolithic Ceramic"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Product Description & Architectural Concept
              </label>
              <textarea
                rows={3}
                value={campaign.description}
                onFocus={() => onFieldFocus?.('description')}
                onChange={(e) => onChange({ description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white outline-hidden leading-relaxed"
                placeholder="Describe product geometry, tactile sensation, and functional purpose..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={campaign.targetAudience}
                  onFocus={() => onFieldFocus?.('targetAudience')}
                  onChange={(e) => onChange({ targetAudience: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-[11px]"
                  placeholder="Design purists..."
                />
              </div>
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Brand Essence
                </label>
                <input
                  type="text"
                  value={campaign.brandEssence}
                  onFocus={() => onFieldFocus?.('brandEssence')}
                  onChange={(e) => onChange({ brandEssence: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-[11px]"
                  placeholder="Restrained, sculptural..."
                />
              </div>
            </div>

            {/* Model Variant Selector */}
            <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-amber-500" />
                  Image Model Engine
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium">
                  Nano-Banana
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => onChange({ modelVariant: 'gemini-3.1-flash-lite-image' })}
                  className={`p-2 rounded-md border text-left transition-colors ${
                    campaign.modelVariant === 'gemini-3.1-flash-lite-image'
                      ? 'border-neutral-900 dark:border-white bg-white dark:bg-neutral-700 font-semibold text-neutral-900 dark:text-white'
                      : 'border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <div>Nano-Banana</div>
                  <div className="text-[9px] text-neutral-400">3.1-flash-lite (Fast)</div>
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ modelVariant: 'gemini-nano-banana-2.1' })}
                  className={`p-2 rounded-md border text-left transition-colors ${
                    campaign.modelVariant === 'gemini-nano-banana-2.1'
                      ? 'border-neutral-900 dark:border-white bg-white dark:bg-neutral-700 font-semibold text-neutral-900 dark:text-white'
                      : 'border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <div>Nano-Banana 2.1</div>
                  <div className="text-[9px] text-neutral-400">2K/4K Pro Resolution</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VISUAL DNA (CONSISTENCY LOCK) */}
        {activeTab === 'dna' && (
          <div className="space-y-4">
            {/* Consistency Lock Indicator */}
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
              <div className="flex items-center gap-1.5 font-semibold text-xs">
                <Lock className="w-3.5 h-3.5" />
                Visual Identity Locked
              </div>
              <p className="text-[11px] mt-1 text-emerald-700 dark:text-emerald-400 leading-normal">
                These design tokens are strictly injected into every medium prompt (billboard, newspaper, social) to ensure identical product silhouette, materials, and finish across all campaign assets.
              </p>
            </div>

            {/* Quick Palettes */}
            <div>
              <span className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Preset Color Schemes
              </span>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_PALETTES.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      onChange({
                        visualDna: {
                          ...dna,
                          primaryColor: preset.primary,
                          secondaryColor: preset.secondary,
                          accentColor: preset.accent,
                          colorNames: {
                            primary: preset.primaryName,
                            secondary: preset.secondaryName,
                            accent: preset.accentName,
                          },
                        },
                      });
                    }}
                    className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 text-left transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-[11px]">{preset.name}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10"
                          style={{ backgroundColor: preset.primary }}
                        />
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10"
                          style={{ backgroundColor: preset.secondary }}
                        />
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10"
                          style={{ backgroundColor: preset.accent }}
                        />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Swatches */}
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-neutral-500 uppercase">
                  Primary
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={dna.primaryColor}
                    onChange={(e) => handleDnaChange('primaryColor', e.target.value)}
                    className="w-7 h-7 rounded border-0 cursor-pointer p-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={dna.primaryColor}
                    onChange={(e) => handleDnaChange('primaryColor', e.target.value)}
                    className="w-full px-1.5 py-1 text-[11px] font-mono border border-neutral-300 dark:border-neutral-700 rounded bg-transparent"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-neutral-500 uppercase">
                  Secondary
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={dna.secondaryColor}
                    onChange={(e) => handleDnaChange('secondaryColor', e.target.value)}
                    className="w-7 h-7 rounded border-0 cursor-pointer p-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={dna.secondaryColor}
                    onChange={(e) => handleDnaChange('secondaryColor', e.target.value)}
                    className="w-full px-1.5 py-1 text-[11px] font-mono border border-neutral-300 dark:border-neutral-700 rounded bg-transparent"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-neutral-500 uppercase">
                  Accent
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={dna.accentColor}
                    onChange={(e) => handleDnaChange('accentColor', e.target.value)}
                    className="w-7 h-7 rounded border-0 cursor-pointer p-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={dna.accentColor}
                    onChange={(e) => handleDnaChange('accentColor', e.target.value)}
                    className="w-full px-1.5 py-1 text-[11px] font-mono border border-neutral-300 dark:border-neutral-700 rounded bg-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Materials List */}
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Signature Materials
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {dna.materials.map((mat, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 text-[11px]"
                  >
                    {mat}
                    <button
                      type="button"
                      onClick={() => removeMaterial(i)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMaterial}
                  onChange={(e) => setNewMaterial(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addMaterial())}
                  placeholder="e.g. Brushed Anodized Titanium"
                  className="flex-1 px-2.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-[11px]"
                />
                <button
                  type="button"
                  onClick={addMaterial}
                  className="px-2.5 py-1.5 rounded bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 font-medium"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Silhouette Profile */}
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Geometric Silhouette Profile
              </label>
              <input
                type="text"
                value={dna.silhouette}
                onChange={(e) => handleDnaChange('silhouette', e.target.value)}
                className="w-full px-3 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-[11px]"
                placeholder="e.g. Monolithic cylinder with 16mm chamfer"
              />
            </div>

            {/* Surface Finish */}
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Surface Finish
              </label>
              <input
                type="text"
                value={dna.finish}
                onChange={(e) => handleDnaChange('finish', e.target.value)}
                className="w-full px-3 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-[11px]"
                placeholder="e.g. Satin micro-sandblasted soft touch"
              />
            </div>

            {/* Brand Mark Motif */}
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Brand Emblem / Motif
              </label>
              <input
                type="text"
                value={dna.brandMark}
                onChange={(e) => handleDnaChange('brandMark', e.target.value)}
                className="w-full px-3 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-[11px]"
                placeholder="e.g. Debossed concentric minimalist ring"
              />
            </div>

            {/* Strict Negative Human Constraint Box */}
            <div className="p-3 rounded-lg bg-neutral-900 text-white dark:bg-black dark:border dark:border-neutral-800 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-400">
                <ShieldAlert className="w-3.5 h-3.5" />
                Negative Constraint: Zero Humans
              </div>
              <p className="text-[10px] text-neutral-300 leading-normal">
                Enforced by prompt rules: Images will NEVER include human subjects, hands holding products, faces, or pedestrian silhouettes. Pure architectural and still-life mockups only.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: MEDIUMS SELECTOR */}
        {activeTab === 'mediums' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                Target Advertising Mediums
              </span>
              <button
                type="button"
                onClick={selectAllMediums}
                className="text-[11px] text-neutral-500 hover:text-neutral-900 dark:hover:text-white font-medium"
              >
                Select All ({MEDIUM_CATALOG.length})
              </button>
            </div>

            <div className="space-y-2">
              {MEDIUM_CATALOG.map((medium) => {
                const isSelected = selectedMediums.includes(medium.type);
                return (
                  <div
                    key={medium.type}
                    onClick={() => toggleMedium(medium.type)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-800/80 shadow-xs'
                        : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 text-neutral-900 dark:text-white">
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Square className="w-4 h-4 text-neutral-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-neutral-900 dark:text-white text-xs">
                            {medium.label}
                          </span>
                          <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">
                            {medium.aspectRatio}
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-1">
                          {medium.environmentDescription}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Editor Footer / Primary Action */}
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 mt-auto">
        <button
          onClick={() => onGenerate(selectedMediums)}
          disabled={isGenerating || selectedMediums.length === 0}
          className="w-full py-2.5 px-4 rounded-lg bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-bold text-xs tracking-wide shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isGenerating ? (
            <>
              <Wand2 className="w-4 h-4 animate-spin text-amber-400" />
              <span>Generating Campaign ({selectedMediums.length} Mediums)...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Generate Across {selectedMediums.length} Mediums</span>
            </>
          )}
        </button>
        <div className="flex items-center justify-center gap-2 mt-2 text-[10px] font-mono text-neutral-400">
          <span>Nano-Banana Engine</span>
          <span>•</span>
          <span>300 DPI High-Res Assets</span>
        </div>
      </div>
    </aside>
  );
};
