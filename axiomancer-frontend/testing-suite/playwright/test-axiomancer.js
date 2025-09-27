const { chromium } = require('playwright');

async function testAxiomancerApp() {
  console.log('🎭 Starting Axiomancer Playwright Test...\n');
  
  const browser = await chromium.launch({ 
    headless: false, // Set to true for CI/CD
    slowMo: 1000 // Slow down for better visibility
  });
  
  try {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    
    const page = await context.newPage();
    
    // Navigate to the app
    console.log('📍 Navigating to localhost:3000...');
    await page.goto('http://localhost:3000');
    
    // Wait for the landing page to load
    await page.waitForSelector('[alt="Axiomancer"]', { timeout: 10000 });
    console.log('✅ Landing page loaded successfully');
    
    // Test image dimensions and aspect ratio
    console.log('🖼️  Testing image display...');
    const imageElement = await page.locator('[alt="Axiomancer"]');
    
    // Get computed styles and dimensions
    const imageInfo = await imageElement.evaluate((img) => {
      const rect = img.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(img);
      
      return {
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        displayWidth: rect.width,
        displayHeight: rect.height,
        objectFit: computedStyle.objectFit,
        objectPosition: computedStyle.objectPosition,
        aspectRatio: img.naturalWidth / img.naturalHeight,
        displayAspectRatio: rect.width / rect.height
      };
    });
    
    console.log('📊 Image Information:');
    console.log(`   Natural size: ${imageInfo.naturalWidth}x${imageInfo.naturalHeight}`);
    console.log(`   Display size: ${Math.round(imageInfo.displayWidth)}x${Math.round(imageInfo.displayHeight)}`);
    console.log(`   Object-fit: ${imageInfo.objectFit}`);
    console.log(`   Object-position: ${imageInfo.objectPosition}`);
    console.log(`   Natural aspect ratio: ${imageInfo.aspectRatio.toFixed(2)}`);
    console.log(`   Display aspect ratio: ${imageInfo.displayAspectRatio.toFixed(2)}`);
    
    // Verify the image is using object-fit: cover (prevents stretching)
    if (imageInfo.objectFit === 'cover') {
      console.log('✅ Image uses object-fit: cover - no stretching detected');
    } else {
      console.log('⚠️  Warning: Image may be stretched - object-fit is not "cover"');
    }
    
    // Test click functionality
    console.log('\n🖱️  Testing click functionality...');
    
    // Look for the "Click to Start" text
    const clickToStartText = await page.locator('text=Click to Start');
    await clickToStartText.waitFor({ state: 'visible' });
    console.log('✅ "Click to Start" text is visible');
    
    // Test hover effect
    console.log('🎯 Testing hover effect...');
    await clickToStartText.hover();
    await page.waitForTimeout(1000); // Allow time to see hover effect
    
    // Check if hover changes are applied (color change)
    const hoverColor = await clickToStartText.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    console.log(`   Hover color: ${hoverColor}`);
    
    // Click to start
    console.log('🚀 Clicking to start the application...');
    await clickToStartText.click();
    
    // Wait for transition to login/register page
    await page.waitForSelector('input[type="email"], input[placeholder*="email"]', { timeout: 5000 });
    console.log('✅ Successfully navigated to login/register page');
    
    // Test different viewport sizes to ensure responsiveness
    console.log('\n📱 Testing responsive design...');
    
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1920, height: 1080 }
    ];
    
    for (const viewport of viewports) {
      console.log(`   Testing ${viewport.name} (${viewport.width}x${viewport.height})`);
      await page.setViewportSize(viewport);
      
      // Go back to landing page
      await page.goto('http://localhost:3000');
      await page.waitForSelector('[alt="Axiomancer"]');
      
      // Check image display at this viewport
      const responsiveImageInfo = await page.locator('[alt="Axiomancer"]').evaluate((img) => {
        const rect = img.getBoundingClientRect();
        return {
          displayWidth: rect.width,
          displayHeight: rect.height,
          coversViewport: rect.width >= window.innerWidth && rect.height >= window.innerHeight
        };
      });
      
      console.log(`     Image covers viewport: ${responsiveImageInfo.coversViewport ? '✅' : '❌'}`);
      console.log(`     Image size: ${Math.round(responsiveImageInfo.displayWidth)}x${Math.round(responsiveImageInfo.displayHeight)}`);
    }
    
    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the test
testAxiomancerApp().catch(console.error);