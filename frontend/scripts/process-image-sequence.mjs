#!/usr/bin/env node

/**
 * Image Sequence & Video Frame Optimizer using Sharp & FFmpeg
 *
 * Optimizes 100-300 frame image sequences for Next.js Canvas animation:
 *  - Converts frames to highly-compressed .webp/.avif using Sharp
 *  - Standardizes resolution (1920x1080 / 1440x900)
 *  - Generates manifest.json with preload metadata for 60fps scrub
 *
 * Usage:
 *  node scripts/process-image-sequence.mjs --input <dir> --output <dir> [--format webp|avif] [--quality 80]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
function getArg(flag, defaultValue) {
  const idx = args.indexOf(flag);
  if (idx !== -1 && args[idx + 1]) {
    return args[idx + 1];
  }
  return defaultValue;
}

const inputDir = path.resolve(getArg('--input', path.join(projectRoot, 'assets', 'animation-capture', 'frames')));
const outputDir = path.resolve(getArg('--output', path.join(projectRoot, 'public', 'sequences', 'laptop-3d')));
const format = getArg('--format', 'webp'); // webp or avif
const quality = parseInt(getArg('--quality', '80'), 10);
const maxWidth = parseInt(getArg('--max-width', '1920'), 10);

fs.mkdirSync(outputDir, { recursive: true });

async function main() {
  console.log('======================================================================');
  console.log('  SHARP IMAGE SEQUENCE PROCESSOR (Next.js 60FPS Scrub Optimization)  ');
  console.log('======================================================================');
  console.log(`Input Directory:  ${inputDir}`);
  console.log(`Output Directory: ${outputDir}`);
  console.log(`Target Format:    ${format.toUpperCase()} (Quality: ${quality})`);
  console.log(`Max Width:        ${maxWidth}px`);
  console.log('----------------------------------------------------------------------\n');

  if (!fs.existsSync(inputDir)) {
    console.warn(`Input directory not found: ${inputDir}. Creating sample directory structure.`);
    fs.mkdirSync(inputDir, { recursive: true });
  }

  const files = fs.readdirSync(inputDir)
    .filter(f => f.match(/\\.(png|jpg|jpeg|webp|avif)$/i))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

  if (files.length === 0) {
    console.log('No raw image frames found in input directory to process.');
    console.log('Generating sequence manifest template for Next.js Canvas Player...');
    
    const sampleManifest = {
      name: 'ASUS ROG 3D Laptop Sequence',
      totalFrames: 0,
      format,
      frames: [],
      recommendedFps: 60,
      scrubInertia: 0.5
    };
    fs.writeFileSync(path.join(outputDir, 'sequence-manifest.json'), JSON.stringify(sampleManifest, null, 2));
    return;
  }

  console.log(`Found ${files.length} frame(s) to optimize...`);

  const processedFrames = [];
  let index = 0;

  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const frameNumber = String(index).padStart(4, '0');
    const outFilename = `frame_${frameNumber}.${format}`;
    const outputPath = path.join(outputDir, outFilename);

    let pipeline = sharp(inputPath).resize({
      width: maxWidth,
      withoutEnlargement: true,
      fit: 'inside'
    });

    if (format === 'avif') {
      pipeline = pipeline.avif({ quality, effort: 4 });
    } else {
      pipeline = pipeline.webp({ quality, effort: 4 });
    }

    const info = await pipeline.toFile(outputPath);
    const relativeUrl = `/sequences/laptop-3d/${outFilename}`;

    processedFrames.push({
      index,
      filename: outFilename,
      url: relativeUrl,
      width: info.width,
      height: info.height,
      sizeKb: Math.round(info.size / 1024)
    });

    if (index % 10 === 0 || index === files.length - 1) {
      process.stdout.write(`  Processed frame ${index + 1}/${files.length} (${info.width}x${info.height}, ${Math.round(info.size / 1024)}KB)\\r`);
    }

    index++;
  }

  console.log('\\n\\nWriting sequence manifest...');
  const manifest = {
    name: 'ASUS ROG 3D Sequence',
    totalFrames: processedFrames.length,
    format,
    fps: 60,
    width: processedFrames[0]?.width || 1920,
    height: processedFrames[0]?.height || 1080,
    frames: processedFrames
  };

  const manifestPath = path.join(outputDir, 'sequence-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log('======================================================================');
  console.log(`✅ SEQUENCE OPTIMIZATION FINISHED!`);
  console.log(`Total Frames: ${processedFrames.length}`);
  console.log(`Manifest:     ${manifestPath}`);
  console.log('======================================================================\\n');
}

main().catch(console.error);
