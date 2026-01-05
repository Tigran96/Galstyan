const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  // Read the HTML file
  const htmlContent = fs.readFileSync('group-lesson-card-export.html', 'utf8');
  
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport size for the card
  await page.setViewport({ width: 400, height: 800, deviceScaleFactor: 2 });
  
  // Set the HTML content
  await page.setContent(htmlContent);
  
  // Wait for fonts and styles to load
  await page.waitForTimeout(500);
  
  // Take screenshot
  await page.screenshot({
    path: 'group-lesson-card.png',
    fullPage: true,
    type: 'png'
  });
  
  await browser.close();
  
  console.log('✅ Image generated: group-lesson-card.png');
})();



