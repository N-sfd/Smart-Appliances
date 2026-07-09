/**
 * Optimizes service images for the Smart Appliances CRA site.
 * Sources: assets/images-original/**  →  public/images/services/**
 *
 * Generates WebP + AVIF at responsive widths with metadata stripped.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SOURCE_ROOT = path.join(ROOT, 'assets', 'images-original');
const OUTPUT_ROOT = path.join(ROOT, 'public', 'images', 'services');

const SERVICE_FOLDERS = ['tv-mounting', 'phone-repair', 'smart-home', 'handyman'];
const SOURCE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const RESPONSIVE_WIDTHS = [400, 700, 1200, 1600];
const MANIFEST_PATH = path.join(ROOT, 'assets', 'image-optimization-manifest.json');

const VARIANT_RULES = [
  { test: /hero/i, maxWidth: 1600, maxHeight: 1000, webpQuality: 76, avifQuality: 58 },
  { test: /support|general|installer/i, maxWidth: 1200, maxHeight: 800, webpQuality: 76, avifQuality: 58 },
  { test: /.*/, maxWidth: 700, maxHeight: 500, webpQuality: 76, avifQuality: 58 },
];

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function pickVariant(fileName) {
  return VARIANT_RULES.find((rule) => rule.test.test(fileName)) ?? VARIANT_RULES[VARIANT_RULES.length - 1];
}

function baseName(file) {
  return path.basename(file, path.extname(file));
}

async function fileHash(filePath) {
  const buf = await fs.readFile(filePath);
  return createHash('sha256').update(buf).digest('hex');
}

async function loadManifest() {
  try {
    const raw = await fs.readFile(MANIFEST_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function saveManifest(manifest) {
  await fs.mkdir(path.dirname(MANIFEST_PATH), { recursive: true });
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

async function collectSources(dir, relative = '') {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const rel = path.join(relative, entry.name);
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectSources(abs, rel)));
      continue;
    }
    if (SOURCE_EXTS.has(path.extname(entry.name).toLowerCase())) {
      files.push(rel.replace(/\\/g, '/'));
    }
  }
  return files;
}

function groupSourcesByBase(relativePaths) {
  const groups = new Map();
  for (const rel of relativePaths) {
    const dir = path.dirname(rel);
    const stem = baseName(rel);
    const key = `${dir}/${stem}`;
    const existing = groups.get(key) ?? [];
    existing.push(rel);
    groups.set(key, existing);
  }
  return groups;
}

function chooseBestSource(paths) {
  const score = (p) => {
    const ext = path.extname(p).toLowerCase();
    if (ext === '.png') return 4;
    if (ext === '.jpg' || ext === '.jpeg') return 3;
    if (ext === '.webp') return 2;
    return 1;
  };
  return [...paths].sort((a, b) => score(b) - score(a))[0];
}

async function resizeFit(buffer, maxWidth, maxHeight) {
  const image = sharp(buffer, { failOn: 'none' }).rotate();
  const meta = await image.metadata();
  const width = meta.width ?? maxWidth;
  const height = meta.height ?? maxHeight;
  const targetWidth = Math.min(width, maxWidth);
  const targetHeight = Math.min(height, maxHeight);
  return image.resize({
    width: targetWidth,
    height: targetHeight,
    fit: 'inside',
    withoutEnlargement: true,
  });
}

async function processImage(relSourcePath, manifest) {
  const sourceAbs = path.join(SOURCE_ROOT, relSourcePath);
  const stem = baseName(relSourcePath);
  const outDir = path.join(OUTPUT_ROOT, path.dirname(relSourcePath));
  const variant = pickVariant(stem);
  const sourceStat = await fs.stat(sourceAbs);
  const hash = await fileHash(sourceAbs);
  const manifestKey = relSourcePath.replace(/\\/g, '/');

  if (manifest[manifestKey]?.hash === hash) {
    console.log(`skip  ${manifestKey} (unchanged)`);
    return { skipped: true };
  }

  await fs.mkdir(outDir, { recursive: true });
  const input = await fs.readFile(sourceAbs);
  const fitted = await resizeFit(input, variant.maxWidth, variant.maxHeight);
  const fittedMeta = await fitted.metadata();
  const fittedBuffer = await fitted.toBuffer();
  const fittedImage = sharp(fittedBuffer);

  const outputs = [];
  const maxOutWidth = fittedMeta.width ?? variant.maxWidth;

  const mainWebpPath = path.join(outDir, `${stem}.webp`);
  const mainAvifPath = path.join(outDir, `${stem}.avif`);

  const webpMain = await fittedImage
    .clone()
    .webp({ quality: variant.webpQuality, effort: 4 })
    .toBuffer();
  await fs.writeFile(mainWebpPath, webpMain);
  outputs.push({ file: mainWebpPath, bytes: webpMain.length });

  try {
    const avifMain = await fittedImage
      .clone()
      .avif({ quality: variant.avifQuality, effort: 4 })
      .toBuffer();
    await fs.writeFile(mainAvifPath, avifMain);
    outputs.push({ file: mainAvifPath, bytes: avifMain.length });
  } catch (err) {
    console.warn(`warn  AVIF skipped for ${manifestKey}: ${err.message}`);
  }

  for (const width of RESPONSIVE_WIDTHS) {
    if (width > maxOutWidth) continue;
    const responsivePath = path.join(outDir, `${stem}-${width}w.webp`);
    const resized = await sharp(fittedBuffer)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: variant.webpQuality, effort: 4 })
      .toBuffer();
    await fs.writeFile(responsivePath, resized);
    outputs.push({ file: responsivePath, bytes: resized.length });
  }

  manifest[manifestKey] = {
    hash,
    processedAt: new Date().toISOString(),
    sourceBytes: sourceStat.size,
    outputs: outputs.map((o) => ({
      file: path.relative(ROOT, o.file).replace(/\\/g, '/'),
      bytes: o.bytes,
    })),
  };

  console.log(
    `ok    ${manifestKey}  ${formatBytes(sourceStat.size)} -> ${outputs
      .map((o) => `${path.basename(o.file)} ${formatBytes(o.bytes)}`)
      .join(', ')}`,
  );

  return { skipped: false };
}

async function seedSourcesFromPublic() {
  for (const folder of SERVICE_FOLDERS) {
    const publicDir = path.join(OUTPUT_ROOT, folder);
    const sourceDir = path.join(SOURCE_ROOT, folder);
    let entries;
    try {
      entries = await collectSources(publicDir);
    } catch {
      continue;
    }
    for (const rel of entries) {
      const srcOut = path.join(sourceDir, rel);
      const srcExists = await fs
        .access(srcOut)
        .then(() => true)
        .catch(() => false);
      if (srcExists) continue;
      await fs.mkdir(path.dirname(srcOut), { recursive: true });
      await fs.copyFile(path.join(publicDir, rel), srcOut);
    }
  }
}

async function main() {
  await seedSourcesFromPublic();

  let sourceFiles = [];
  for (const folder of SERVICE_FOLDERS) {
    const dir = path.join(SOURCE_ROOT, folder);
    try {
      sourceFiles.push(...(await collectSources(dir, folder)));
    } catch {
      console.warn(`warn  missing source folder: ${folder}`);
    }
  }

  if (sourceFiles.length === 0) {
    console.error('No source images found in assets/images-original/.');
    process.exit(1);
  }

  const groups = groupSourcesByBase(sourceFiles);
  const manifest = await loadManifest();
  let processed = 0;
  let skipped = 0;
  let failed = 0;

  for (const [, paths] of groups) {
    const rel = chooseBestSource(paths);
    try {
      const result = await processImage(rel, manifest);
      if (result.skipped) skipped += 1;
      else processed += 1;
    } catch (err) {
      failed += 1;
      console.error(`fail  ${rel}: ${err.message}`);
    }
  }

  await saveManifest(manifest);
  console.log(`\nDone. processed=${processed} skipped=${skipped} failed=${failed}`);
  if (failed > 0) process.exitCode = 1;
}

main();
