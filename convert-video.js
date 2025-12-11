import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

ffmpeg.setFfmpegPath(ffmpegStatic);

const inputPath = path.join(__dirname, 'public', 'background_video.MOV');
const outputPath = path.join(__dirname, 'public', 'background_video.mp4');

if (fs.existsSync(outputPath)) {
  console.log('MP4 already exists, skipping conversion');
  process.exit(0);
}

console.log(`Converting ${inputPath} to MP4...`);

ffmpeg(inputPath)
  .videoCodec('libx264')
  .audioCodec('aac')
  .outputOptions(['-movflags +faststart'])
  .outputOptions(['-preset', 'fast'])
  .outputOptions(['-crf', '23'])
  .on('start', (cmd) => {
    console.log('FFmpeg command:', cmd);
  })
  .on('progress', (progress) => {
    console.log(`Processing: ${Math.round(progress.percent || 0)}%`);
  })
  .on('end', () => {
    console.log('✅ Video conversion completed successfully!');
    console.log(`Output: ${outputPath}`);
    process.exit(0);
  })
  .on('error', (err) => {
    console.error('❌ Conversion error:', err.message);
    process.exit(1);
  })
  .save(outputPath);
