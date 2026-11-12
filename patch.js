const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let openclawDir;
try {
  const globalRoot = execSync('npm root -g').toString().trim();
  openclawDir = path.join(globalRoot, 'openclaw');
} catch (e) {
  openclawDir = path.resolve('node_modules/openclaw');
}

const distDir = path.join(openclawDir, 'dist');
if (fs.existsSync(distDir)) {
  const files = fs.readdirSync(distDir);
  let patchedCount = 0;
  for (const file of files) {
    if (file.startsWith('ai-transport') && file.endsWith('.mjs')) {
      const filePath = path.join(distDir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      const target = 'const baseSignal = baseInit?.signal ?? void 0;';
      const injection = `if (model?.authHeader === false || model?.provider === 'shivai' || (typeof model?.baseUrl === 'string' && model.baseUrl.includes('shiv-aiserver'))) {
        if (baseInit?.headers instanceof Headers) {
          baseInit.headers.delete('authorization');
        } else if (baseInit?.headers && typeof baseInit.headers === 'object') {
          delete baseInit.headers.authorization;
          delete baseInit.headers.Authorization;
        }
      }
      ` + target;
      if (content.includes(target) && !content.includes("model?.provider === 'shivai'")) {
        content = content.replace(target, injection);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`[Patch] Successfully patched ${file}`);
        patchedCount++;
      }
    }
  }
  if (patchedCount === 0) {
    console.log('[Patch] Target already patched or transport files not found.');
  }
} else {
  console.error('[Patch] OpenClaw dist directory not found at:', distDir);
}
