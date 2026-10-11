import { MediumType, VisualDNA } from '../types';

/**
 * Procedurally generates a high-resolution, photorealistic minimalist mockup
 * strictly respecting the product's Visual DNA and enforcing zero humans.
 */
export function generateProceduralMediumMockup(
  mediumType: MediumType,
  productName: string,
  tagline: string,
  visualDna: VisualDNA,
  aspectRatio: '16:9' | '1:1' | '3:4' | '4:3' | '9:16'
): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  // Dimensions based on aspect ratio (Retina / 2K scale)
  let width = 1600;
  let height = 1600;

  if (aspectRatio === '16:9') {
    width = 1920;
    height = 1080;
  } else if (aspectRatio === '3:4') {
    width = 1200;
    height = 1600;
  } else if (aspectRatio === '4:3') {
    width = 1600;
    height = 1200;
  } else if (aspectRatio === '9:16') {
    width = 1080;
    height = 1920;
  }

  canvas.width = width;
  canvas.height = height;

  const pColor = visualDna.primaryColor || '#1E1E24';
  const sColor = visualDna.secondaryColor || '#E5E5E5';
  const aColor = visualDna.accentColor || '#E07A5F';

  // Base background
  ctx.fillStyle = '#0F1115';
  ctx.fillRect(0, 0, width, height);

  switch (mediumType) {
    case 'billboard':
      renderBillboard(ctx, width, height, productName, tagline, pColor, sColor, aColor, visualDna);
      break;
    case 'newspaper':
      renderNewspaper(ctx, width, height, productName, tagline, pColor, sColor, aColor, visualDna);
      break;
    case 'social_post':
      renderSocialPost(ctx, width, height, productName, tagline, pColor, sColor, aColor, visualDna);
      break;
    case 'subway_poster':
      renderSubwayPoster(ctx, width, height, productName, tagline, pColor, sColor, aColor, visualDna);
      break;
    case 'magazine_spread':
      renderMagazineSpread(ctx, width, height, productName, tagline, pColor, sColor, aColor, visualDna);
      break;
    case 'storefront_display':
      renderStorefront(ctx, width, height, productName, tagline, pColor, sColor, aColor, visualDna);
      break;
    case 'packaging_unboxing':
      renderPackaging(ctx, width, height, productName, tagline, pColor, sColor, aColor, visualDna);
      break;
    case 'digital_hero':
    default:
      renderDigitalHero(ctx, width, height, productName, tagline, pColor, sColor, aColor, visualDna);
      break;
  }

  return canvas.toDataURL('image/png', 0.95);
}

function renderBillboard(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  title: string,
  tagline: string,
  pColor: string,
  sColor: string,
  aColor: string,
  dna: VisualDNA
) {
  // Architectural dusk sky
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
  skyGrad.addColorStop(0, '#0a0d14');
  skyGrad.addColorStop(0.5, '#161b26');
  skyGrad.addColorStop(1, '#242b3b');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h);

  // Distant architectural brutalist silhouettes (NO humans)
  ctx.fillStyle = '#080a0f';
  ctx.fillRect(0, h * 0.75, w, h * 0.25);
  for (let i = 0; i < 8; i++) {
    const bW = w * 0.12;
    const bH = h * (0.2 + (i % 3) * 0.1);
    ctx.fillStyle = i % 2 === 0 ? '#0d1117' : '#080a0f';
    ctx.fillRect(i * (w * 0.13), h * 0.75 - bH, bW, bH);
  }

  // Giant Minimalist Monolith Billboard Structure
  const bbW = w * 0.78;
  const bbH = h * 0.58;
  const bbX = (w - bbW) / 2;
  const bbY = h * 0.14;

  // Steel frame shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(bbX - 10, bbY - 10, bbW + 20, bbH + 20);

  // Billboard canvas surface
  const canvasGrad = ctx.createLinearGradient(bbX, bbY, bbX + bbW, bbY + bbH);
  canvasGrad.addColorStop(0, '#121418');
  canvasGrad.addColorStop(1, '#1b1f26');
  ctx.fillStyle = canvasGrad;
  ctx.fillRect(bbX, bbY, bbW, bbH);

  // Ambient overhead spotlight glow
  const spotGrad = ctx.createRadialGradient(w / 2, bbY, 20, w / 2, bbY + bbH * 0.5, bbW * 0.6);
  spotGrad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
  spotGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = spotGrad;
  ctx.fillRect(bbX, bbY, bbW, bbH);

  // Inner Billboard artwork (Minimalist Brand Display)
  ctx.save();
  ctx.beginPath();
  ctx.rect(bbX, bbY, bbW, bbH);
  ctx.clip();

  // Subtle grid lines (Swiss aesthetic)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1;
  for (let x = bbX; x < bbX + bbW; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, bbY);
    ctx.lineTo(x, bbY + bbH);
    ctx.stroke();
  }

  // Consistent Product Silhouette inside Billboard (Right side)
  drawConsistentProduct(ctx, bbX + bbW * 0.68, bbY + bbH * 0.55, bbH * 0.65, pColor, sColor, aColor, dna);

  // Brand Name & Minimalist Typography (Left side)
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 48px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(title.toUpperCase(), bbX + 60, bbY + 110);

  ctx.fillStyle = aColor;
  ctx.font = '500 20px "JetBrains Mono", monospace';
  ctx.fillText(`COLLECTION // ${dna.finish.toUpperCase()}`, bbX + 60, bbY + 145);

  ctx.fillStyle = '#A0AEC0';
  ctx.font = '400 24px "Plus Jakarta Sans", sans-serif';
  wrapText(ctx, tagline, bbX + 60, bbY + 210, bbW * 0.42, 34);

  // Materials badge
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.fillRect(bbX + 60, bbY + bbH - 70, 260, 36);
  ctx.fillStyle = '#E2E8F0';
  ctx.font = '600 13px "JetBrains Mono", monospace';
  ctx.fillText(`MATERIAL: ${dna.materials[0] || 'TITANIUM'}`, bbX + 75, bbY + bbH - 47);

  ctx.restore();

  // Billboard floodlights
  ctx.fillStyle = '#2D3748';
  for (let i = 0; i < 4; i++) {
    const lx = bbX + (bbW / 5) * (i + 1);
    ctx.fillRect(lx - 12, bbY - 24, 24, 24);
    ctx.fillStyle = '#FEFCBF';
    ctx.fillRect(lx - 8, bbY - 6, 16, 6);
    ctx.fillStyle = '#2D3748';
  }
}

function renderNewspaper(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  title: string,
  tagline: string,
  pColor: string,
  sColor: string,
  aColor: string,
  dna: VisualDNA
) {
  // Vintage newsprint stock texture
  ctx.fillStyle = '#EFECE6';
  ctx.fillRect(0, 0, w, h);

  // Halftone / paper noise overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
  for (let x = 0; x < w; x += 4) {
    for (let y = 0; y < h; y += 4) {
      if ((x + y) % 8 === 0) ctx.fillRect(x, y, 2, 2);
    }
  }

  const mX = w * 0.08;
  const mY = h * 0.06;
  const mW = w * 0.84;
  const mH = h * 0.88;

  // Newspaper Masthead banner
  ctx.strokeStyle = '#1A202C';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(mX, mY);
  ctx.lineTo(mX + mW, mY);
  ctx.stroke();

  ctx.fillStyle = '#111827';
  ctx.font = '700 24px "Playfair Display", serif';
  ctx.textAlign = 'center';
  ctx.fillText('THE ARCHITECTURAL GAZETTE — SPECIAL DESIGN EDITION', w / 2, mY + 32);

  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(mX, mY + 45);
  ctx.lineTo(mX + mW, mY + 45);
  ctx.stroke();
  ctx.textAlign = 'left';

  // Feature ad container
  const adY = mY + 65;
  const adH = mH - 75;

  ctx.strokeRect(mX, adY, mW, adH);

  // Newspaper Headline in editorial Serif
  ctx.font = '700 44px "Playfair Display", serif';
  ctx.fillStyle = '#0F172A';
  ctx.fillText(title, mX + 40, adY + 70);

  ctx.font = 'italic 20px "Playfair Display", serif';
  ctx.fillStyle = '#475569';
  ctx.fillText(`“${tagline}”`, mX + 40, adY + 110);

  // Halftone monochrome product render
  const prX = mX + mW * 0.55;
  const prY = adY + adH * 0.5;
  drawConsistentProduct(ctx, prX, prY, adH * 0.55, '#1A202C', '#E2E8F0', '#4A5568', dna);

  // Newspaper body text columns (Lorem Swiss design copy)
  ctx.font = '400 14px Georgia, serif';
  ctx.fillStyle = '#334155';
  const colW = mW * 0.44;
  const bodyText = `In an age dominated by noise, the ${title} asserts quiet authority through restrained geometry and uncompromising material integrity. Conceived without superfluous ornamentation, the piece balances pure form with monolithic permanence. Every contour reflects precision engineering, finished in ${dna.finish} with signature ${dna.materials.join(' and ')} craftsmanship. Available strictly through curated architectural stockists.`;
  wrapText(ctx, bodyText, mX + 40, adY + 160, colW, 24);

  // Newsprint fine print and barcode
  ctx.font = '500 11px "JetBrains Mono", monospace';
  ctx.fillStyle = '#64748B';
  ctx.fillText(`EDITION NO. 4882 // ZERO-HUMAN ARCHITECTURAL ARCHIVE // MODEL: NANO-BANANA`, mX + 40, adY + adH - 30);
}

function renderSocialPost(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  title: string,
  tagline: string,
  pColor: string,
  sColor: string,
  aColor: string,
  dna: VisualDNA
) {
  // Studio concrete/limestone podium setting (High-end Scandinavian)
  const bg = ctx.createRadialGradient(w / 2, h * 0.4, 50, w / 2, h / 2, w * 0.7);
  bg.addColorStop(0, '#2D323C');
  bg.addColorStop(0.6, '#181B21');
  bg.addColorStop(1, '#0F1115');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Floating geometric pedestal
  const pedW = w * 0.5;
  const pedH = 60;
  const pedX = (w - pedW) / 2;
  const pedY = h * 0.68;

  // Soft podium shadow
  const shGrad = ctx.createRadialGradient(w / 2, pedY + 30, 20, w / 2, pedY + 30, pedW * 0.6);
  shGrad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
  shGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = shGrad;
  ctx.beginPath();
  ctx.ellipse(w / 2, pedY + 40, pedW * 0.65, 30, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pedestal block
  ctx.fillStyle = '#22262E';
  ctx.fillRect(pedX, pedY, pedW, pedH);
  ctx.fillStyle = '#313642';
  ctx.fillRect(pedX, pedY, pedW, 8); // rim highlight

  // Main Product on Podium
  drawConsistentProduct(ctx, w / 2, pedY - h * 0.22, h * 0.48, pColor, sColor, aColor, dna);

  // Social Post UI minimal overlay (Brand watermark + handle)
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(title.toUpperCase(), 60, 80);

  ctx.fillStyle = aColor;
  ctx.font = '500 14px "JetBrains Mono", monospace';
  ctx.fillText('@BRAND.OFFICIAL // 01 OF 08', 60, 110);

  // Bottom caption overlay
  ctx.fillStyle = 'rgba(15, 17, 21, 0.75)';
  ctx.fillRect(50, h - 130, w - 100, 80);
  ctx.fillStyle = '#F8FAFC';
  ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(tagline, 75, h - 85);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '400 13px "JetBrains Mono", monospace';
  ctx.fillText(`MATERIAL: ${dna.materials.join(' • ')} // NO HUMANS // MINIMALIST FOCUS`, 75, h - 60);
}

function renderSubwayPoster(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  title: string,
  tagline: string,
  pColor: string,
  sColor: string,
  aColor: string,
  dna: VisualDNA
) {
  // Subway ceramic subway tile background
  ctx.fillStyle = '#13161C';
  ctx.fillRect(0, 0, w, h);

  // Backlit brushed aluminum lightbox frame
  const fX = w * 0.1;
  const fY = h * 0.08;
  const fW = w * 0.8;
  const fH = h * 0.84;

  ctx.fillStyle = '#282F3B';
  ctx.fillRect(fX - 16, fY - 16, fW + 32, fH + 32);

  // Inner illuminated poster
  const postGrad = ctx.createLinearGradient(fX, fY, fX, fY + fH);
  postGrad.addColorStop(0, '#1E232E');
  postGrad.addColorStop(1, '#0F1218');
  ctx.fillStyle = postGrad;
  ctx.fillRect(fX, fY, fW, fH);

  // Dramatic architectural product lighting
  drawConsistentProduct(ctx, fX + fW / 2, fY + fH * 0.44, fH * 0.48, pColor, sColor, aColor, dna);

  // Transit Poster Typography
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 52px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(title.toUpperCase(), fX + fW / 2, fY + 100);

  ctx.fillStyle = aColor;
  ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(tagline, fX + fW / 2, fY + 145);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = '500 13px "JetBrains Mono", monospace';
  ctx.fillText('CENTRAL METRO TERMINAL LIGHTBOX • CAMPAIGN RUN 2026', fX + fW / 2, fY + fH - 40);
  ctx.textAlign = 'left';
}

function renderMagazineSpread(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  title: string,
  tagline: string,
  pColor: string,
  sColor: string,
  aColor: string,
  dna: VisualDNA
) {
  // Double-page glossy magazine spread
  ctx.fillStyle = '#F4F3F0';
  ctx.fillRect(0, 0, w, h);

  // Gutter shadow down the middle
  const gGrad = ctx.createLinearGradient(w / 2 - 40, 0, w / 2 + 40, 0);
  gGrad.addColorStop(0, 'rgba(0,0,0,0)');
  gGrad.addColorStop(0.5, 'rgba(0,0,0,0.12)');
  gGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gGrad;
  ctx.fillRect(w / 2 - 40, 0, 80, h);

  // Left page: Product still life with soft shadows
  drawConsistentProduct(ctx, w * 0.28, h * 0.52, h * 0.52, pColor, sColor, aColor, dna);

  // Right page: Monograph typography & specifications
  const rX = w * 0.56;
  ctx.fillStyle = '#0F172A';
  ctx.font = '700 56px "Playfair Display", serif';
  ctx.fillText(title, rX, h * 0.28);

  ctx.fillStyle = aColor;
  ctx.font = '600 16px "JetBrains Mono", monospace';
  ctx.fillText(`SERIES // ${dna.finish.toUpperCase()}`, rX, h * 0.33);

  ctx.fillStyle = '#475569';
  ctx.font = '400 20px "Plus Jakarta Sans", sans-serif';
  wrapText(ctx, tagline, rX, h * 0.42, w * 0.36, 32);

  // Technical spec table
  ctx.fillStyle = '#E2E8F0';
  ctx.fillRect(rX, h * 0.6, w * 0.36, 1);

  ctx.fillStyle = '#334155';
  ctx.font = '600 14px "JetBrains Mono", monospace';
  ctx.fillText('FINISH', rX, h * 0.65);
  ctx.fillText(dna.finish, rX + 160, h * 0.65);

  ctx.fillText('MATERIAL', rX, h * 0.72);
  ctx.fillText(dna.materials[0] || 'Titanium', rX + 160, h * 0.72);

  ctx.fillText('GEOMETRY', rX, h * 0.79);
  ctx.fillText(dna.silhouette.slice(0, 24), rX + 160, h * 0.79);
}

function renderStorefront(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  title: string,
  tagline: string,
  pColor: string,
  sColor: string,
  aColor: string,
  dna: VisualDNA
) {
  // Dark luxury boutique window with soft ambient museum lighting
  ctx.fillStyle = '#0B0D11';
  ctx.fillRect(0, 0, w, h);

  // Glass reflection accents
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(w * 0.1, 0);
  ctx.lineTo(0, h * 0.6);
  ctx.stroke();

  // Glass Vitrine pedestal
  const vW = w * 0.44;
  const vH = h * 0.55;
  const vX = (w - vW) / 2;
  const vY = h * 0.35;

  ctx.fillStyle = '#171B22';
  ctx.fillRect(vX, vY, vW, vH);

  // Spotlight from ceiling
  const cSpot = ctx.createRadialGradient(w / 2, 0, 50, w / 2, vY + 100, w * 0.6);
  cSpot.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
  cSpot.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = cSpot;
  ctx.fillRect(0, 0, w, h);

  // The product displayed in vitrine
  drawConsistentProduct(ctx, w / 2, vY + vH * 0.35, vH * 0.55, pColor, sColor, aColor, dna);

  // Vitrine etched brass plaque
  ctx.fillStyle = '#D4AF37';
  ctx.font = '700 20px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(title.toUpperCase(), w / 2, vY + vH - 50);
  ctx.font = '500 13px "JetBrains Mono", monospace';
  ctx.fillText(tagline, w / 2, vY + vH - 25);
  ctx.textAlign = 'left';
}

function renderPackaging(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  title: string,
  tagline: string,
  pColor: string,
  sColor: string,
  aColor: string,
  dna: VisualDNA
) {
  // Clean studio unboxing scene
  ctx.fillStyle = '#1A1D24';
  ctx.fillRect(0, 0, w, h);

  // Matte rigid box beside the product
  const bX = w * 0.18;
  const bY = h * 0.45;
  const bW = w * 0.3;
  const bH = h * 0.35;

  ctx.fillStyle = pColor;
  ctx.fillRect(bX, bY, bW, bH);
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(bX + bW - 20, bY, 20, bH);

  // Embossed mark on box
  ctx.fillStyle = aColor;
  ctx.font = '700 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(title.toUpperCase(), bX + 30, bY + 60);

  // Unboxed product standing proudly
  drawConsistentProduct(ctx, w * 0.68, h * 0.52, h * 0.52, pColor, sColor, aColor, dna);

  // Studio text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 36px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(title, 80, 100);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '400 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Packaging & Unboxing Experience • ${tagline}`, 80, 140);
}

function renderDigitalHero(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  title: string,
  tagline: string,
  pColor: string,
  sColor: string,
  aColor: string,
  dna: VisualDNA
) {
  // Sleek dark modern web hero showcase
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#0B0D13');
  bg.addColorStop(1, '#1A1E29');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Product spotlight in center-right
  drawConsistentProduct(ctx, w * 0.65, h * 0.5, h * 0.6, pColor, sColor, aColor, dna);

  // Left copy block
  const lX = w * 0.1;
  ctx.fillStyle = aColor;
  ctx.font = '600 16px "JetBrains Mono", monospace';
  ctx.fillText('INTRODUCING', lX, h * 0.35);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 64px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(title, lX, h * 0.46);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '400 24px "Plus Jakarta Sans", sans-serif';
  wrapText(ctx, tagline, lX, h * 0.56, w * 0.38, 38);
}

/**
 * Renders the locked, identical physical product with the exact same silhouette,
 * materials, and brand mark to preserve consistency across every medium.
 */
function drawConsistentProduct(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  primary: string,
  secondary: string,
  accent: string,
  dna: VisualDNA
) {
  ctx.save();
  ctx.translate(cx, cy);

  // Cast shadow
  const sh = ctx.createRadialGradient(0, size * 0.38, size * 0.05, 0, size * 0.38, size * 0.45);
  sh.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
  sh.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = sh;
  ctx.beginPath();
  ctx.ellipse(0, size * 0.38, size * 0.45, size * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Consistent Monolithic Silhouette: Sculptural Cylinder with chamfered crown
  const pW = size * 0.42;
  const pH = size * 0.72;

  // Main Body
  const bodyGrad = ctx.createLinearGradient(-pW / 2, 0, pW / 2, 0);
  bodyGrad.addColorStop(0, primary);
  bodyGrad.addColorStop(0.3, blendColors(primary, '#FFFFFF', 0.18));
  bodyGrad.addColorStop(0.7, primary);
  bodyGrad.addColorStop(1, blendColors(primary, '#000000', 0.4));

  ctx.fillStyle = bodyGrad;
  roundRect(ctx, -pW / 2, -pH / 2, pW, pH, 16);
  ctx.fill();

  // Chamfered Metallic Crown (Accent)
  const crownH = size * 0.08;
  const crownGrad = ctx.createLinearGradient(-pW / 2, 0, pW / 2, 0);
  crownGrad.addColorStop(0, secondary);
  crownGrad.addColorStop(0.5, '#FFFFFF');
  crownGrad.addColorStop(1, blendColors(secondary, '#000000', 0.3));

  ctx.fillStyle = crownGrad;
  roundRect(ctx, -pW / 2, -pH / 2, pW, crownH, [16, 16, 4, 4]);
  ctx.fill();

  // Subtle Accent Ring
  ctx.fillStyle = accent;
  ctx.fillRect(-pW / 2 + 4, -pH / 2 + crownH + 4, pW - 8, 3);

  // Debossed Minimalist Circular Brand Mark
  ctx.beginPath();
  ctx.arc(0, -size * 0.08, size * 0.06, 0, Math.PI * 2);
  ctx.fillStyle = blendColors(primary, '#FFFFFF', 0.25);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, -size * 0.08, size * 0.035, 0, Math.PI * 2);
  ctx.fillStyle = primary;
  ctx.fill();

  // Subtle Acoustic / Ventilation micro-perforations (Precision grid)
  ctx.fillStyle = blendColors(primary, '#000000', 0.25);
  for (let r = 0; r < 5; r++) {
    for (let c = -4; c <= 4; c++) {
      ctx.beginPath();
      ctx.arc(c * 9, size * 0.12 + r * 9, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Specular edge highlight
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-pW / 2 + 3, -pH / 2 + crownH + 12);
  ctx.lineTo(-pW / 2 + 3, pH / 2 - 16);
  ctx.stroke();

  ctx.restore();
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number | number[]
) {
  let r = typeof radius === 'number' ? [radius, radius, radius, radius] : radius;
  ctx.beginPath();
  ctx.moveTo(x + r[0], y);
  ctx.lineTo(x + w - r[1], y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r[1]);
  ctx.lineTo(x + w, y + h - r[2]);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r[2], y + h);
  ctx.lineTo(x + r[3], y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r[3]);
  ctx.lineTo(x, y + r[0]);
  ctx.quadraticCurveTo(x, y, x + r[0], y);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';
  let curY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, curY);
      line = words[n] + ' ';
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, curY);
}

function blendColors(c1: string, c2: string, weight: number): string {
  // simple hex blend
  const f = parseInt(c1.slice(1), 16);
  const t = parseInt(c2.slice(1), 16);
  const R1 = f >> 16,
    G1 = (f >> 8) & 0x00ff,
    B1 = f & 0x0000ff;
  const R2 = t >> 16,
    G2 = (t >> 8) & 0x00ff,
    B2 = t & 0x0000ff;
  return (
    '#' +
    (
      0x1000000 +
      (Math.round((R2 - R1) * weight) + R1) * 0x10000 +
      (Math.round((G2 - G1) * weight) + G1) * 0x100 +
      (Math.round((B2 - B1) * weight) + B1)
    )
      .toString(16)
      .slice(1)
  );
}
