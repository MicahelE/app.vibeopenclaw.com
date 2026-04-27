#!/usr/bin/env node
/**
 * Browser inspection helper for VibeOpenClaw
 * Usage: npx tsx scripts/inspect.ts [url]
 */
import { chromium } from '@playwright/test';

const url = process.argv[2] || 'https://app.vibeopenclaw.com';

async function inspect() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log(`Opening ${url} ...`);
  await page.goto(url);

  console.log('Browser is open. Press Ctrl+C to close.');

  // Keep alive
  await new Promise(() => {});
}

inspect().catch(console.error);
