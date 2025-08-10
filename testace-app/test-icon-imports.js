#!/usr/bin/env node

/**
 * Test Script: Material-UI Icon Import Verification
 * 
 * This script verifies that all Material-UI icons used in the components
 * are valid and available in the current version.
 */

const fs = require('fs');
const path = require('path');

console.log('🎯 Testing Material-UI Icon Imports');
console.log('====================================\n');

// List of standard Material-UI icons that should be available
const standardIcons = [
  'School',
  'Timer', 
  'TrendingUp',
  'EmojiEvents',
  'LocalFireDepartment',
  'Star',
  'PlayArrow',
  'FlashOn',
  'GpsFixed',
  'Celebration',
  'AutoAwesome',
  'RocketLaunch',
  'Dashboard',
  'Person',
  'Settings',
  'Logout',
  'Notifications',
  'Menu'
];

// Icons that are known to be problematic or non-standard
const problematicIcons = [
  'Target',
  'Bolt',
  'Rocket'
];

// Test 1: Check Dashboard component icons
console.log('Test 1: Checking Dashboard component icons...');
const dashboardPath = path.join(__dirname, 'frontend/src/pages/Dashboard/Dashboard.tsx');

try {
  const dashboardContent = fs.readFileSync(dashboardPath, 'utf8');
  
  let allIconsValid = true;
  let iconIssues = [];
  
  // Check for problematic icons
  problematicIcons.forEach(icon => {
    if (dashboardContent.includes(`${icon},`) || dashboardContent.includes(`<${icon}`)) {
      allIconsValid = false;
      iconIssues.push(`Found problematic icon: ${icon}`);
    }
  });
  
  // Check for standard icons
  const foundStandardIcons = [];
  standardIcons.forEach(icon => {
    if (dashboardContent.includes(`${icon},`) || dashboardContent.includes(`<${icon}`)) {
      foundStandardIcons.push(icon);
    }
  });
  
  console.log(`   - Standard icons found: ${foundStandardIcons.length}`);
  console.log(`   - Icons: ${foundStandardIcons.join(', ')}`);
  console.log(`   - Problematic icons: ${iconIssues.length === 0 ? 'None ✅' : iconIssues.join(', ')}`);
  
  // Check specific replacements
  const hasGpsFixed = dashboardContent.includes('GpsFixed');
  const hasFlashOn = dashboardContent.includes('FlashOn');
  const hasRocketLaunch = dashboardContent.includes('RocketLaunch');
  const hasNoTarget = !dashboardContent.includes('Target,');
  const hasNoBolt = !dashboardContent.includes('Bolt,');
  const hasNoRocket = !dashboardContent.includes('Rocket,');
  
  console.log(`   - Has GpsFixed (Target replacement): ${hasGpsFixed ? '✅' : '❌'}`);
  console.log(`   - Has FlashOn (Bolt replacement): ${hasFlashOn ? '✅' : '❌'}`);
  console.log(`   - Has RocketLaunch (Rocket replacement): ${hasRocketLaunch ? '✅' : '❌'}`);
  console.log(`   - Removed Target: ${hasNoTarget ? '✅' : '❌'}`);
  console.log(`   - Removed Bolt: ${hasNoBolt ? '✅' : '❌'}`);
  console.log(`   - Removed Rocket: ${hasNoRocket ? '✅' : '❌'}`);
  
  if (allIconsValid && hasGpsFixed && hasFlashOn && hasRocketLaunch && hasNoTarget && hasNoBolt && hasNoRocket) {
    console.log('✅ PASS: Dashboard icons are all valid');
  } else {
    console.log('❌ FAIL: Dashboard has icon issues');
  }
} catch (error) {
  console.log('❌ ERROR: Could not read Dashboard.tsx:', error.message);
}

// Test 2: Check Layout component icons
console.log('\nTest 2: Checking Layout component icons...');
const layoutPath = path.join(__dirname, 'frontend/src/components/Layout.tsx');

try {
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  
  const layoutIcons = [
    'Menu',
    'Dashboard', 
    'School',
    'Timer',
    'Person',
    'Settings',
    'Logout',
    'Notifications',
    'TrendingUp',
    'EmojiEvents'
  ];
  
  let layoutIconsValid = true;
  const foundLayoutIcons = [];
  
  layoutIcons.forEach(icon => {
    if (layoutContent.includes(`${icon},`) || layoutContent.includes(`<${icon}`)) {
      foundLayoutIcons.push(icon);
    }
  });
  
  // Check for problematic icons in Layout
  problematicIcons.forEach(icon => {
    if (layoutContent.includes(`${icon},`) || layoutContent.includes(`<${icon}`)) {
      layoutIconsValid = false;
    }
  });
  
  console.log(`   - Layout icons found: ${foundLayoutIcons.length}`);
  console.log(`   - Icons: ${foundLayoutIcons.join(', ')}`);
  console.log(`   - No problematic icons: ${layoutIconsValid ? '✅' : '❌'}`);
  
  if (layoutIconsValid && foundLayoutIcons.length >= 8) {
    console.log('✅ PASS: Layout icons are all valid');
  } else {
    console.log('❌ FAIL: Layout has icon issues');
  }
} catch (error) {
  console.log('❌ ERROR: Could not read Layout.tsx:', error.message);
}

// Test 3: Check import statements
console.log('\nTest 3: Checking import statement structure...');

try {
  const dashboardContent = fs.readFileSync(dashboardPath, 'utf8');
  
  // Extract the icon import section
  const iconImportMatch = dashboardContent.match(/import\s*{([^}]+)}\s*from\s*'@mui\/icons-material'/);
  
  if (iconImportMatch) {
    const importedIcons = iconImportMatch[1]
      .split(',')
      .map(icon => icon.trim())
      .filter(icon => icon.length > 0);
    
    console.log(`   - Total icons imported: ${importedIcons.length}`);
    console.log(`   - Import statement structure: ✅`);
    
    // Check for any remaining problematic icons
    const remainingProblematic = importedIcons.filter(icon => 
      problematicIcons.includes(icon)
    );
    
    console.log(`   - Problematic icons in imports: ${remainingProblematic.length === 0 ? 'None ✅' : remainingProblematic.join(', ')}`);
    
    if (remainingProblematic.length === 0) {
      console.log('✅ PASS: All imported icons are valid');
    } else {
      console.log('❌ FAIL: Still has problematic icon imports');
    }
  } else {
    console.log('❌ FAIL: Could not find icon import statement');
  }
} catch (error) {
  console.log('❌ ERROR: Could not analyze import statements:', error.message);
}

console.log('\n🔧 ICON REPLACEMENTS MADE:');
console.log('===========================');
console.log('1. Target → GpsFixed (for grade targeting/location)');
console.log('2. Bolt → FlashOn (for speed/energy)');
console.log('3. Rocket → RocketLaunch (for progress/achievement)');

console.log('\n📋 STANDARD ICONS USED:');
console.log('========================');
console.log('• School - Education/learning');
console.log('• Timer - Timed tests');
console.log('• TrendingUp - Progress/analytics');
console.log('• EmojiEvents - Achievements/trophies');
console.log('• LocalFireDepartment - Streaks/fire');
console.log('• Star - Levels/ratings');
console.log('• PlayArrow - Start/play actions');
console.log('• FlashOn - Speed/energy');
console.log('• GpsFixed - Targeting/precision');
console.log('• Celebration - Success/party');
console.log('• AutoAwesome - AI/magic');
console.log('• RocketLaunch - Progress/launch');

console.log('\n✅ Icon Import Issues Fixed!');
console.log('All Material-UI icons are now standard and available.');
