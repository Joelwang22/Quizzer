const fs = require('fs');
const path = require('path');

const contentDir = path.resolve(__dirname, '..', 'content', 'GEX1015', 'midterm prep');
const outDir = path.resolve(__dirname, 'GEX1015');

async function extractPdf(filePath) {
  // Dynamic import for ESM-only pdfjs-dist
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const doc = await pdfjsLib.getDocument(filePath).promise;
  let fullText = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    fullText += `\n--- Page ${i} ---\n${pageText}\n`;
  }
  return { text: fullText, numPages: doc.numPages };
}

async function main() {
  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.pdf'));

  for (const file of files) {
    const pdfPath = path.join(contentDir, file);
    const outPath = path.join(outDir, file.replace('.pdf', '.txt'));

    if (fs.existsSync(outPath)) {
      console.log(`SKIP (exists): ${file}`);
      continue;
    }

    console.log(`Extracting: ${file}`);
    try {
      const { text, numPages } = await extractPdf(pdfPath);
      fs.writeFileSync(outPath, text, 'utf-8');
      console.log(`  -> ${path.basename(outPath)} (${numPages} pages, ${text.length} chars)`);
    } catch (err) {
      console.error(`  ERROR: ${file}: ${err.message}`);
    }
  }

  console.log('\nDone! All PDFs extracted.');
}

main().catch(console.error);
