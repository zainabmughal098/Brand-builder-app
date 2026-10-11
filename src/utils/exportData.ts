import { Campaign, MediumAsset } from '../types';

export function exportCampaignToCSV(campaign: Campaign): void {
  const headers = [
    'Campaign ID',
    'Campaign Name',
    'Product Name',
    'Category',
    'Medium Type',
    'Medium Title',
    'Aspect Ratio',
    'Resolution',
    'Model Used',
    'Consistency Score (%)',
    'Estimated File Size (KB)',
    'Primary Color',
    'Secondary Color',
    'Materials',
    'Silhouette Profile',
    'Finish',
    'Headline',
    'Subcopy',
    'Generation Timestamp',
    'Full Generation Prompt',
    'Enforced Negative Prompt',
    'Last Edited By',
  ];

  const rows = campaign.mediums.map((asset) => [
    sanitizeCSV(campaign.id),
    sanitizeCSV(campaign.name),
    sanitizeCSV(campaign.productName),
    sanitizeCSV(campaign.category),
    sanitizeCSV(asset.mediumType),
    sanitizeCSV(asset.title),
    sanitizeCSV(asset.aspectRatio),
    sanitizeCSV(asset.resolution),
    sanitizeCSV(asset.modelUsed),
    asset.consistencyScore.toString(),
    Math.round(asset.fileSizeBytes / 1024).toString(),
    sanitizeCSV(campaign.visualDna.primaryColor),
    sanitizeCSV(campaign.visualDna.secondaryColor),
    sanitizeCSV(campaign.visualDna.materials.join(', ')),
    sanitizeCSV(campaign.visualDna.silhouette),
    sanitizeCSV(campaign.visualDna.finish),
    sanitizeCSV(asset.headline),
    sanitizeCSV(asset.subcopy),
    sanitizeCSV(asset.generatedAt),
    sanitizeCSV(asset.prompt),
    sanitizeCSV(asset.negativePrompt),
    sanitizeCSV(campaign.lastEditedBy),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((r) => r.map((field) => `"${field.replace(/"/g, '""')}"`).join(',')),
  ].join('\r\n');

  downloadBlob(
    new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }),
    `${slugify(campaign.productName)}_campaign_analytics_${formatDateShort(new Date())}.csv`
  );
}

export function exportCampaignToJSON(campaign: Campaign): void {
  const payload = {
    $schema: 'https://brandbuilder.internal/schemas/v2/campaign.json',
    exportedAt: new Date().toISOString(),
    campaignId: campaign.id,
    metadata: {
      name: campaign.name,
      productName: campaign.productName,
      category: campaign.category,
      tagline: campaign.tagline,
      description: campaign.description,
      targetAudience: campaign.targetAudience,
      brandEssence: campaign.brandEssence,
      version: campaign.version,
      lastEditedBy: campaign.lastEditedBy,
      createdAt: campaign.createdAt,
      updatedAt: campaign.updatedAt,
    },
    visualIdentityLock: {
      modelFamily: 'Nano-Banana',
      modelVariant: campaign.modelVariant,
      colorPalette: campaign.visualDna,
      humanNegativeConstraintEnforced: true,
      artDirection: 'Professional Minimalist, Zero-Human, Editorial Mockup',
    },
    deliverables: campaign.mediums.map((m) => ({
      id: m.id,
      mediumType: m.mediumType,
      title: m.title,
      aspectRatio: m.aspectRatio,
      resolution: m.resolution,
      fileSizeBytes: m.fileSizeBytes,
      consistencyScore: m.consistencyScore,
      headline: m.headline,
      subcopy: m.subcopy,
      prompt: m.prompt,
      negativePrompt: m.negativePrompt,
      generatedAt: m.generatedAt,
      modelUsed: m.modelUsed,
      imageRef: m.imageUrl.startsWith('data:') ? 'base64_embedded' : m.imageUrl,
    })),
  };

  const jsonStr = JSON.stringify(payload, null, 2);
  downloadBlob(
    new Blob([jsonStr], { type: 'application/json' }),
    `${slugify(campaign.productName)}_brand_data_${formatDateShort(new Date())}.json`
  );
}

export function downloadImage(asset: MediumAsset, productName: string): void {
  const filename = `${slugify(productName)}_${asset.mediumType}_${asset.aspectRatio.replace(':', 'x')}_hires.png`;
  
  // If it's a data URL or normal URL
  const link = document.createElement('a');
  link.href = asset.imageUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function sanitizeCSV(text: string | undefined): string {
  if (!text) return '';
  return text.replace(/\r?\n|\r/g, ' ').trim();
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

function formatDateShort(date: Date): string {
  return date.toISOString().split('T')[0];
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
