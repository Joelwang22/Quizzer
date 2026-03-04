import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const contentDir = path.resolve('content/GEX1015/midterm prep');
const outDir = path.resolve('temp/GEX1015');

const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.pdf'));

for (const file of files) {
  const pdfPath = path.join(contentDir, file);
  const outPath = path.join(outDir, file.replace('.pdf', '.txt'));

  if (fs.existsSync(outPath)) {
    console.log(`SKIP (exists): ${file}`);
    continue;
  }

  console.log(`Extracting: ${file}`);
  const buffer = fs.readFileSync(pdfPath);
  const data = await pdfParse(buffer);
  fs.writeFileSync(outPath, data.text, 'utf-8');
  console.log(`  -> ${outPath} (${data.numpages} pages, ${data.text.length} chars)`);
}

console.log('\nDone! All PDFs extracted.');
