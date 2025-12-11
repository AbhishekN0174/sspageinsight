import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, 'public');
const imagesToOptimize = [
  'display1.jpg',
  'display3.jpg',
  'display4.jpg',
  'background.jpg',
  'studio1.jpg',
  'studio2.jpg',
  'studio3.jpg',
  'display5.jpg',
  'display6.jpg',
  'display7.jpg',
  'display8.jpg'
];

async function optimizeImages() {
  console.log('🖼️  Starting image optimization...');
  
  for (const imageName of imagesToOptimize) {
    const inputPath = path.join(publicDir, imageName);
    const outputPath = path.join(publicDir, imageName);
    
    if (!fs.existsSync(inputPath)) {
      console.log(`⚠️  File not found: ${imageName}`);
      continue;
    }

    try {
      const beforeSize = fs.statSync(inputPath).size / 1024;
      
      await sharp(inputPath)
        .resize(2400, 1600, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality: 75, progressive: true, mozjpeg: true })
        .toFile(outputPath + '.tmp');

      const afterSize = fs.statSync(outputPath + '.tmp').size / 1024;
      fs.renameSync(outputPath + '.tmp', outputPath);
      
      const savings = Math.round((1 - afterSize / beforeSize) * 100);
      console.log(`✅ ${imageName}: ${beforeSize.toFixed(1)} KB → ${afterSize.toFixed(1)} KB (${savings}% saved)`);
    } catch (error) {
      console.error(`❌ Error optimizing ${imageName}:`, error.message);
    }
  }
  
  console.log('✨ Image optimization complete!');
}

optimizeImages().catch(console.error);
