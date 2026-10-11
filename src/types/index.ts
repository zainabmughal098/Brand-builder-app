export type MediumType =
  | 'billboard'
  | 'newspaper'
  | 'social_post'
  | 'subway_poster'
  | 'magazine_spread'
  | 'storefront_display'
  | 'packaging_unboxing'
  | 'digital_hero';

export interface MediumMeta {
  type: MediumType;
  label: string;
  category: 'Outdoor' | 'Print' | 'Digital' | 'Retail';
  aspectRatio: '16:9' | '1:1' | '3:4' | '4:3' | '9:16';
  defaultResolution: string;
  printDpi?: number;
  environmentDescription: string;
  mockupContext: string;
}

export interface MediumAsset {
  id: string;
  mediumType: MediumType;
  title: string;
  aspectRatio: '16:9' | '1:1' | '3:4' | '4:3' | '9:16';
  imageUrl: string;
  headline: string;
  subcopy: string;
  mediumDescription: string;
  status: 'ready' | 'generating' | 'failed';
  modelUsed: string;
  resolution: string;
  fileSizeBytes: number;
  prompt: string;
  negativePrompt: string;
  generatedAt: string;
  consistencyScore: number; // 90-99%
}

export interface VisualDNA {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  colorNames: {
    primary: string;
    secondary: string;
    accent: string;
  };
  materials: string[];
  silhouette: string;
  finish: string;
  typographyStyle: string;
  brandMark: string;
  lightingStyle: string;
}

export interface Campaign {
  id: string;
  name: string;
  productName: string;
  category: string;
  tagline: string;
  description: string;
  targetAudience: string;
  brandEssence: string;
  brandVoiceTone?: number; // 0 (Minimalist/Professional) to 100 (Bold/Disruptive)
  modelVariant: 'gemini-3.1-flash-lite-image' | 'gemini-nano-banana-2.1';
  visualDna: VisualDNA;
  mediums: MediumAsset[];
  updatedAt: string;
  createdAt: string;
  lastEditedBy: string;
  version: number;
}

export interface ActivityLog {
  id: string;
  campaignId: string;
  author: string;
  authorAvatar: string;
  action: string;
  details: string;
  timestamp: string;
  type: 'edit' | 'generate' | 'export' | 'sync' | 'collab';
}

export interface Collaborator {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  status: 'online' | 'editing' | 'idle';
  activeField?: string;
  lastActive: number;
}
