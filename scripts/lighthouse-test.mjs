/**
 * Lighthouse Performance Testing Script
 * 
 * Runs Lighthouse audits on key pages to verify performance targets.
 * 
 * Requirements:
 * - 16.9: Achieve Lighthouse performance score ≥85 on desktop
 * - 16.10: Achieve Lighthouse performance score ≥80 on mobile
 */

import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'fs';
import path from 'path';

const PAGES_TO_TEST = [
  { url: 'http://localhost:3000', name: 'Homepage' },
  { url: 'http://localhost:3000/services', name: 'Services' },
  { url: 'http://localhost:3000/order', name: 'Order' },
  { url: 'http://localhost:3000/consultation', name: 'Consultation' },
];

const DESKTOP_CONFIG = {
  extends: 'lighthouse:default',
  settings: {
    formFactor: 'desktop',
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
    },
  },
};

const MOBILE_CONFIG = {
  extends: 'lighthouse:default',
  settings: {
    formFactor: 'mobile',
    screenEmulation: {
      mobile: true,
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      disabled: false,
    },
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      cpuSlowdownMultiplier: 4,
    },
  },
};

async function runLighthouse(url, config, device) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = {
    logLevel: 'error',
    output: 'json',
    port: chrome.port,
  };

  try {
    const runnerResult = await lighthouse(url, options, config);
    await chrome.kill();
    return runnerResult;
  } catch (error) {
    await chrome.kill();
    throw error;
  }
}

function formatScore(score) {
  const percentage = Math.round(score * 100);
  const emoji = percentage >= 90 ? '🟢' : percentage >= 50 ? '🟡' : '🔴';
  return `${emoji} ${percentage}`;
}

async function main() {
  console.log('🚀 Starting Lighthouse Performance Tests\n');
  console.log('Testing pages:', PAGES_TO_TEST.map(p => p.name).join(', '));
  console.log('─'.repeat(80));

  const results = [];

  for (const page of PAGES_TO_TEST) {
    console.log(`\n📄 Testing: ${page.name} (${page.url})`);
    
    // Desktop test
    console.log('  🖥️  Running desktop audit...');
    const desktopResult = await runLighthouse(page.url, DESKTOP_CONFIG, 'desktop');
    const desktopScore = desktopResult.lhr.categories.performance.score;
    
    // Mobile test
    console.log('  📱 Running mobile audit...');
    const mobileResult = await runLighthouse(page.url, MOBILE_CONFIG, 'mobile');
    const mobileScore = mobileResult.lhr.categories.performance.score;
    
    results.push({
      page: page.name,
      url: page.url,
      desktop: {
        score: desktopScore,
        metrics: {
          fcp: desktopResult.lhr.audits['first-contentful-paint'].numericValue,
          lcp: desktopResult.lhr.audits['largest-contentful-paint'].numericValue,
          tbt: desktopResult.lhr.audits['total-blocking-time'].numericValue,
          cls: desktopResult.lhr.audits['cumulative-layout-shift'].numericValue,
          si: desktopResult.lhr.audits['speed-index'].numericValue,
        },
      },
      mobile: {
        score: mobileScore,
        metrics: {
          fcp: mobileResult.lhr.audits['first-contentful-paint'].numericValue,
          lcp: mobileResult.lhr.audits['largest-contentful-paint'].numericValue,
          tbt: mobileResult.lhr.audits['total-blocking-time'].numericValue,
          cls: mobileResult.lhr.audits['cumulative-layout-shift'].numericValue,
          si: mobileResult.lhr.audits['speed-index'].numericValue,
        },
      },
    });
    
    console.log(`  Desktop: ${formatScore(desktopScore)}`);
    console.log(`  Mobile:  ${formatScore(mobileScore)}`);
  }

  // Summary
  console.log('\n' + '═'.repeat(80));
  console.log('📊 PERFORMANCE SUMMARY');
  console.log('═'.repeat(80));
  
  console.log('\n┌─────────────────────┬──────────┬──────────┐');
  console.log('│ Page                │ Desktop  │ Mobile   │');
  console.log('├─────────────────────┼──────────┼──────────┤');
  
  for (const result of results) {
    const pageName = result.page.padEnd(19);
    const desktop = formatScore(result.desktop.score).padEnd(8);
    const mobile = formatScore(result.mobile.score).padEnd(8);
    console.log(`│ ${pageName} │ ${desktop} │ ${mobile} │`);
  }
  
  console.log('└─────────────────────┴──────────┴──────────┘');

  // Check if targets are met
  const desktopTarget = 0.85;
  const mobileTarget = 0.80;
  
  const desktopPassed = results.every(r => r.desktop.score >= desktopTarget);
  const mobilePassed = results.every(r => r.mobile.score >= mobileTarget);
  
  console.log('\n🎯 TARGET REQUIREMENTS:');
  console.log(`  Desktop ≥85: ${desktopPassed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`  Mobile ≥80:  ${mobilePassed ? '✅ PASSED' : '❌ FAILED'}`);
  
  // Save detailed results
  const reportDir = path.join(process.cwd(), 'lighthouse-reports');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(reportDir, `performance-${timestamp}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  
  console.log(`\n📁 Detailed report saved to: ${reportPath}`);
  
  // Exit with appropriate code
  if (desktopPassed && mobilePassed) {
    console.log('\n✅ All performance targets met!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some performance targets not met. Review the report for details.');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('❌ Error running Lighthouse tests:', error);
  process.exit(1);
});
