const { chromium } = require('playwright');
const fs = require('fs').promises;

async function verifyWait(page, selector, maxAttempts = 5, interval = 2000) {
  console.log(`Verifying wait for selector: ${selector}`);
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const elements = await page.$$(selector);
    if (elements.length > 0) {
      console.log(`Found ${elements.length} elements for ${selector} on attempt ${attempt}`);
      return true;
    }
    console.log(`Attempt ${attempt}: No elements found for ${selector}, waiting ${interval}ms`);
    await page.waitForTimeout(interval);
  }
  console.log(`Failed to find elements for ${selector} after ${maxAttempts} attempts`);
  return false;
}

async function scrapeEvents(url) {
  // Launch browser
  const browser = await chromium.launch({ headless: false }); // Set to false for debugging
  const page = await browser.newPage();

  try {
    console.log(`Navigating to ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 }); // Increased timeout
    console.log('Page navigation completed');

    // Wait for initial content
    console.log('Waiting for networkidle');
    await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(err => {
      console.warn(`Network idle timeout: ${err}`);
    });

    // Verify event items are loaded
    const selector = 'li.vi-events-tiles-item';
    const elementsFound = await verifyWait(page, selector);
    if (!elementsFound) {
      throw new Error('No event items found after retries');
    }

    // Scroll to load all events
    console.log('Scrolling to load more events');
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      console.log(`Scroll ${i + 1} completed`);
      await page.waitForTimeout(2000);
    }

    // Verify elements again after scrolling
    await verifyWait(page, selector);

    // Extract event data
    console.log('Extracting event data');
    const events = await page.evaluate(() => {
      const items = document.querySelectorAll('li.vi-events-tiles-item');
      console.log(`Found ${items.length} event items in browser`);
      return Array.from(items).map((item, index) => {
        const title = item.querySelector('h2.vi-events-tiles-title span[itemprop="summary"]')?.innerText.trim() || 'N/A';
        const month = item.querySelector('.vi-events-tiles-month')?.innerText.trim() || 'N/A';
        const day = item.querySelector('.vi-events-tiles-day')?.innerText.trim() || 'N/A';
        const date = `${month} ${day}`.trim();
        const time = item.querySelector('.vi-events-tiles-time')?.innerText.trim() || 'N/A';
        const categories = Array.from(item.querySelectorAll('.vi-events-tiles-categories .vi-events-tiles-category'))
          .map(cat => cat.innerText.trim());
        const description = item.querySelector('.vi-events-tiles-desc')?.innerText.trim() || 'N/A';
        return {
          event_id: `event_${index + 1}`,
          title,
          date,
          time,
          categories,
          description
        };
      });
    });

    console.log(`Extracted ${events.length} events`);
    return events;
  } finally {
    console.log('Closing browser');
    await browser.close();
  }
}

async function saveToFile(data, filename = 'scraped_events.json') {
  await fs.writeFile(filename, JSON.stringify(data, null, 2), 'utf-8');
}

(async () => {
  const targetUrl = 'https://www.montgomeryal.gov/play/city-events/-toggle-all';
  try {
    const events = await scrapeEvents(targetUrl);
    await saveToFile(events);
    console.log(`Successfully scraped ${events.length} events and saved to scraped_events.json`);
  } catch (error) {
    console.error(`An error occurred: ${error}`);
  }
})();