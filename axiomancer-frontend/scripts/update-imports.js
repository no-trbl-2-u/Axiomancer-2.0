#!/usr/bin/env node

/**
 * Script to update relative imports to path aliases
 * Converts: import { X } from '../../../utils/foo'
 * To: import { X } from '@utils/foo'
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path aliases mapping
const aliases = {
  components: '@components',
  config: '@config',
  pages: '@pages',
  services: '@services',
  stores: '@stores',
  styles: '@styles',
  types: '@types',
  utils: '@utils',
  stories: '@stories',
};

function updateImportsInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileDir = path.dirname(filePath);
  const srcDir = path.join(__dirname, '../src');

  let updated = content;
  let hasChanges = false;

  // Match import/export statements with relative paths
  const importRegex = /(?:import|export)([^'"]*from\s+)['"](\.\.[^'"]+)['"]/g;

  updated = content.replace(importRegex, (match, prefix, relativePath) => {
    // Skip type-only imports from types directory - handle them specially
    const isTypeImport = match.includes('import type');
    const isFromTypes = relativePath.includes('/types/');

    if (isTypeImport && isFromTypes) {
      // For type imports, remove the '/types' part to import directly from the module
      const absolutePath = path.resolve(fileDir, relativePath);
      let relativeToSrc = path.relative(srcDir, absolutePath);
      relativeToSrc = relativeToSrc.replace(/\\/g, '/');

      // Convert types/game to just game (removing the types directory)
      if (relativeToSrc.startsWith('types/')) {
        const withoutTypes = relativeToSrc.replace('types/', '');
        hasChanges = true;
        return `import type${prefix}'@types/${withoutTypes}'`;
      }
    }
    // Resolve the absolute path
    const absolutePath = path.resolve(fileDir, relativePath);

    // Get the path relative to src directory
    let relativeToSrc = path.relative(srcDir, absolutePath);

    // Normalize to forward slashes
    relativeToSrc = relativeToSrc.replace(/\\/g, '/');

    // Check if path matches any of our aliases
    for (const [folder, alias] of Object.entries(aliases)) {
      if (relativeToSrc.startsWith(folder + '/')) {
        const aliasPath = relativeToSrc.replace(folder, alias);
        hasChanges = true;
        return `import${prefix}'${aliasPath}'`;
      }
      // Handle exact folder match (e.g., import from 'components' itself)
      if (relativeToSrc === folder || relativeToSrc.startsWith(folder)) {
        const aliasPath = relativeToSrc.replace(folder, alias);
        hasChanges = true;
        return `import${prefix}'${aliasPath}'`;
      }
    }

    // Return original if no alias matches
    return match;
  });

  if (hasChanges) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`✓ Updated: ${path.relative(srcDir, filePath)}`);
    return true;
  }

  return false;
}

function findFiles(dir, pattern = /\.(ts|tsx|js|jsx)$/) {
  let results = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      results = results.concat(findFiles(filePath, pattern));
    } else if (pattern.test(file)) {
      results.push(filePath);
    }
  }

  return results;
}

function main() {
  const srcDir = path.join(__dirname, '../src');

  console.log('🔍 Finding TypeScript/JavaScript files...\n');
  const files = findFiles(srcDir);

  console.log(`📝 Found ${files.length} files\n`);
  console.log('🔄 Updating imports...\n');

  let updatedCount = 0;

  for (const file of files) {
    if (updateImportsInFile(file)) {
      updatedCount++;
    }
  }

  console.log(`\n✨ Done! Updated ${updatedCount} file(s)`);

  if (updatedCount > 0) {
    console.log('\n💡 Tip: Run your linter/formatter if you have one configured');
  }
}

main();
