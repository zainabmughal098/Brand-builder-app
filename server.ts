import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize GoogleGenAI SDK on server with telemetry User-Agent
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI:', err);
  }
}

// In-memory data store with disk persistence backup
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch {
    // Ignore in read-only environments
  }
}

const CAMPAIGNS_FILE = path.join(DATA_DIR, 'campaigns.json');
const ACTIVITIES_FILE = path.join(DATA_DIR, 'activities.json');

function loadCampaigns() {
  if (fs.existsSync(CAMPAIGNS_FILE)) {
    try {
      const content = fs.readFileSync(CAMPAIGNS_FILE, 'utf-8');
      return JSON.parse(content);
    } catch {
      return null;
    }
  }
  return null;
}

function saveCampaigns(campaigns: any[]) {
  try {
    fs.writeFileSync(CAMPAIGNS_FILE, JSON.stringify(campaigns, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not persist campaigns to disk:', err);
  }
}

function loadActivities() {
  if (fs.existsSync(ACTIVITIES_FILE)) {
    try {
      const content = fs.readFileSync(ACTIVITIES_FILE, 'utf-8');
      return JSON.parse(content);
    } catch {
      return null;
    }
  }
  return null;
}

function saveActivities(activities: any[]) {
  try {
    fs.writeFileSync(ACTIVITIES_FILE, JSON.stringify(activities, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not persist activities to disk:', err);
  }
}

// In-memory state
let inMemoryCampaigns = loadCampaigns() || [];
let inMemoryActivities = loadActivities() || [
  {
    id: 'act-init-1',
    campaignId: 'camp-aura-sound',
    author: 'bsai23024',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    action: 'Campaign Initialized',
    details: 'Locked Visual DNA: Obsidian Ceramic, Alabaster & Burnished Amber with Zero-Human constraint.',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    type: 'edit',
  },
  {
    id: 'act-init-2',
    campaignId: 'camp-aura-sound',
    author: 'Marcus Wei (Art Director)',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    action: 'Generated 4 Mediums',
    details: 'Generated Highway Billboard, Newspaper Broadsheet, Studio Instagram, and Transit Lightbox with Nano-Banana.',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    type: 'generate',
  },
];

// Active SSE Collaborator clients
interface SSEClient {
  id: string;
  res: Response;
  name: string;
  color: string;
}
let sseClients: SSEClient[] = [];

function broadcastToClients(eventType: string, data: any) {
  const message = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach((client) => {
    try {
      client.res.write(message);
    } catch {
      // Ignore dead connection
    }
  });
}

// REST API Endpoints

// Server status
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    preferredModel: 'gemini-3.1-flash-lite-image',
    alternateModel: 'gemini-nano-banana-2.1',
    activeCollaborators: sseClients.length + 1,
    timestamp: new Date().toISOString(),
  });
});

// SSE Stream for Real-time Collaboration
app.get('/api/collaborators/stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const clientId = `client-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  const clientName = (req.query.name as string) || `Collaborator ${Math.floor(Math.random() * 900 + 100)}`;
  const colors = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4'];
  const clientColor = colors[Math.floor(Math.random() * colors.length)];

  const newClient: SSEClient = { id: clientId, res, name: clientName, color: clientColor };
  sseClients.push(newClient);

  // Send initial welcome & connected clients
  res.write(`event: init\ndata: ${JSON.stringify({ clientId, activeCount: sseClients.length })}\n\n`);

  // Broadcast collaborator joined
  broadcastToClients('collaborator_joined', {
    clientId,
    name: clientName,
    color: clientColor,
    activeCount: sseClients.length,
  });

  req.on('close', () => {
    sseClients = sseClients.filter((c) => c.id !== clientId);
    broadcastToClients('collaborator_left', {
      clientId,
      activeCount: sseClients.length,
    });
  });
});

// Update presence / active editing field
app.post('/api/collaborators/presence', (req: Request, res: Response) => {
  const { clientId, name, activeField, action } = req.body;
  broadcastToClients('presence_update', {
    clientId,
    name,
    activeField,
    action,
    timestamp: new Date().toISOString(),
  });
  res.json({ success: true });
});

// Get all campaigns
app.get('/api/campaigns', (req: Request, res: Response) => {
  res.json(inMemoryCampaigns);
});

// Save or sync campaign
app.post('/api/campaigns', (req: Request, res: Response) => {
  const updatedCampaign = req.body;
  if (!updatedCampaign || !updatedCampaign.id) {
    res.status(400).json({ error: 'Campaign ID required' });
    return;
  }

  const existingIdx = inMemoryCampaigns.findIndex((c: any) => c.id === updatedCampaign.id);
  if (existingIdx >= 0) {
    inMemoryCampaigns[existingIdx] = {
      ...updatedCampaign,
      updatedAt: new Date().toISOString(),
      version: (inMemoryCampaigns[existingIdx].version || 1) + 1,
    };
  } else {
    inMemoryCampaigns.push({
      ...updatedCampaign,
      createdAt: updatedCampaign.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    });
  }

  saveCampaigns(inMemoryCampaigns);

  // Broadcast campaign update to all collaborators
  broadcastToClients('campaign_updated', {
    campaignId: updatedCampaign.id,
    updatedBy: updatedCampaign.lastEditedBy || 'Anonymous',
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, campaign: updatedCampaign });
});

// Delete campaign
app.delete('/api/campaigns/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  inMemoryCampaigns = inMemoryCampaigns.filter((c: any) => c.id !== id);
  saveCampaigns(inMemoryCampaigns);
  broadcastToClients('campaign_deleted', { campaignId: id });
  res.json({ success: true });
});

// Activities
app.get('/api/activities', (req: Request, res: Response) => {
  const { campaignId } = req.query;
  if (campaignId) {
    res.json(inMemoryActivities.filter((a: any) => a.campaignId === campaignId));
  } else {
    res.json(inMemoryActivities);
  }
});

app.post('/api/activities', (req: Request, res: Response) => {
  const activity = {
    ...req.body,
    id: req.body.id || `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    timestamp: new Date().toISOString(),
  };
  inMemoryActivities.unshift(activity);
  if (inMemoryActivities.length > 200) {
    inMemoryActivities = inMemoryActivities.slice(0, 200);
  }
  saveActivities(inMemoryActivities);

  broadcastToClients('activity_logged', activity);
  res.json(activity);
});

// Nano-Banana Image Generation Endpoint
app.post('/api/generate-medium', async (req: Request, res: Response) => {
  const {
    productName,
    category,
    tagline,
    visualDna,
    mediumType,
    aspectRatio = '1:1',
    customPrompt,
    modelVariant = 'gemini-3.1-flash-lite-image',
  } = req.body;

  if (!productName || !mediumType) {
    res.status(400).json({ error: 'Product name and medium type are required' });
    return;
  }

  // Construct rigorous prompt enforcing product consistency, visual DNA, and NO PEOPLE
  const promptParts = [
    `Product Campaign Advertisement for: "${productName}" (${category || 'Industrial Design'}).`,
    `Medium: ${mediumType.replace(/_/g, ' ').toUpperCase()} mockup in high-end architectural setting.`,
    `Visual DNA & Consistency Lock:`,
    `- Primary Color: ${visualDna?.primaryColor || '#1E1E24'} (${visualDna?.colorNames?.primary || 'Deep Tone'})`,
    `- Accent Color: ${visualDna?.accentColor || '#D97706'} (${visualDna?.colorNames?.accent || 'Highlight Tone'})`,
    `- Materials: ${(visualDna?.materials || ['Matte ceramic', 'Anodized titanium']).join(', ')}`,
    `- Silhouette Profile: ${visualDna?.silhouette || 'Monolithic sculptural form with chamfered geometry'}`,
    `- Finish: ${visualDna?.finish || 'Satin soft-touch surface'}`,
    `- Brand Mark: ${visualDna?.brandMark || 'Debossed minimalist circular emblem'}`,
    `Tagline / Context: "${tagline || 'Essential Elegance'}"`,
    customPrompt ? `Art Direction Note: ${customPrompt}` : '',
    `Visual Style: Professional, ultra-minimalist, gallery quality, crisp lighting, photorealistic industrial design mockup.`,
    `CRITICAL NEGATIVE REQUIREMENT: STRICTLY NO PEOPLE, NO HUMANS, NO HANDS, NO FACES, NO HUMAN SHADOWS, NO COMMUTERS. Pure still-life product centerpiece only.`,
  ]
    .filter(Boolean)
    .join('\n');

  // If Gemini API is available, invoke the Nano-Banana model
  if (ai && process.env.GEMINI_API_KEY) {
    try {
      console.log(`Calling Nano-Banana model (${modelVariant}) for ${productName} - ${mediumType}...`);

      const response = await ai.models.generateContent({
        model: modelVariant, // 'gemini-3.1-flash-lite-image' or 'gemini-nano-banana-2.1'
        contents: {
          parts: [{ text: promptParts }],
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any,
          },
        },
      });

      // Extract image part
      let generatedImageUrl = '';
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            const mime = part.inlineData.mimeType || 'image/png';
            generatedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (generatedImageUrl) {
        res.json({
          success: true,
          imageUrl: generatedImageUrl,
          modelUsed: `Nano-Banana (${modelVariant})`,
          prompt: promptParts,
          negativePrompt: 'people, human, crowd, face, hands, fingers, skin, blurred pedestrian',
          aspectRatio,
          source: 'gemini-nano-banana',
        });
        return;
      }
    } catch (err: any) {
      console.warn('Gemini Nano-Banana generation call encountered an error:', err?.message || err);
      // Fall through to procedural fallback response
      res.json({
        success: false,
        fallbackNeeded: true,
        error: err?.message || 'Nano-Banana quota limit or API response without image bytes',
        prompt: promptParts,
        aspectRatio,
      });
      return;
    }
  }

  // If no Gemini API Key is configured
  res.json({
    success: false,
    fallbackNeeded: true,
    error: 'No GEMINI_API_KEY detected in runtime environment. Using ultra-high-resolution procedural mockup.',
    prompt: promptParts,
    aspectRatio,
  });
});

// CSV Export Endpoint
app.get('/api/export/csv/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const campaign = inMemoryCampaigns.find((c: any) => c.id === id);
  if (!campaign) {
    res.status(404).send('Campaign not found');
    return;
  }

  const headers = ['Campaign', 'Product', 'Medium', 'Resolution', 'Aspect', 'Model', 'ConsistencyScore', 'PrimaryColor'];
  const rows = (campaign.mediums || []).map((m: any) => [
    campaign.name,
    campaign.productName,
    m.mediumType,
    m.resolution,
    m.aspectRatio,
    m.modelUsed,
    m.consistencyScore,
    campaign.visualDna?.primaryColor,
  ]);

  const csv = [headers.join(','), ...rows.map((r: any) => r.map((c: any) => `"${c}"`).join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${id}_analytics.csv"`);
  res.send(csv);
});

// JSON Export Endpoint
app.get('/api/export/json/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const campaign = inMemoryCampaigns.find((c: any) => c.id === id);
  if (!campaign) {
    res.status(404).json({ error: 'Campaign not found' });
    return;
  }

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="${id}_brand_raw.json"`);
  res.json({
    $schema: 'https://brandbuilder.internal/schemas/v2/campaign.json',
    campaign,
    exportedAt: new Date().toISOString(),
  });
});

// Setup Vite in Dev mode or serve static files in Production
async function setupServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Brand Builder server running at http://0.0.0.0:${PORT}`);
  });
}

setupServer();
