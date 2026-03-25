/**
 * Galstyan Academy — Social Media Post Generator
 *
 * Renders all 5 post HTML templates to 1080×1080 PNG files.
 *
 * Usage:
 *   node social-media/generate-posts.js
 *
 * Requirements:
 *   npm install puppeteer
 *
 * Output: social-media/output/post1-free-trial.png … post5-parents.png
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const posts = [
  { file: 'post1-free-trial.html',  out: 'post1-free-trial.png'  },
  { file: 'post2-results.html',     out: 'post2-results.png'     },
  { file: 'post3-teacher.html',     out: 'post3-teacher.png'     },
  { file: 'post4-sat.html',         out: 'post4-sat.png'         },
  { file: 'post5-parents.html',     out: 'post5-parents.png'     },
];

const OUTPUT_DIR = path.join(__dirname, 'output');

(async () => {
  // Create output folder
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const post of posts) {
    const htmlPath = path.join(__dirname, post.file);
    const outPath  = path.join(OUTPUT_DIR, post.out);

    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });

    // Navigate via file:// so relative image paths (logo, photos) resolve correctly
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

    // Wait for Google Fonts to load
    await new Promise(r => setTimeout(r, 1500));

    await page.screenshot({
      path: outPath,
      type: 'png',
      clip: { x: 0, y: 0, width: 1080, height: 1080 },
    });

    await page.close();
    console.log(`✅  ${post.out}`);
  }

  await browser.close();
  console.log(`\n🎉  All posts saved to social-media/output/`);
})();
