const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

const port = process.env.PORT || '10000';
const token = process.env.GATEWAY_TOKEN || 'shivai-gateway-secret-2026';

console.log(`[Start] Initializing OpenClaw Cloud Gateway on port ${port} with 280MB memory guard...`);

// 1. Prepare configuration
const baseConfigPath = path.join(__dirname, 'openclaw.json');
let config = {};
if (fs.existsSync(baseConfigPath)) {
  try {
    config = JSON.parse(fs.readFileSync(baseConfigPath, 'utf8'));
  } catch (err) {
    console.error('[Start] Error parsing base openclaw.json:', err);
  }
}

config.gateway = config.gateway || {};
config.gateway.mode = 'local';
config.gateway.port = parseInt(port, 10);
config.gateway.bind = 'lan';
config.gateway.auth = {
  mode: 'token',
  token: token
};
config.gateway.controlUi = config.gateway.controlUi || {
  enabled: true
};

// Write to ~/.openclaw/openclaw.json
const homeOpenClawDir = path.join(os.homedir(), '.openclaw');
if (!fs.existsSync(homeOpenClawDir)) {
  fs.mkdirSync(homeOpenClawDir, { recursive: true });
}
const targetConfigPath = path.join(homeOpenClawDir, 'openclaw.json');
fs.writeFileSync(targetConfigPath, JSON.stringify(config, null, 2), 'utf8');
console.log(`[Start] Config written to ${targetConfigPath}`);

// Also update base copy
fs.writeFileSync(baseConfigPath, JSON.stringify(config, null, 2), 'utf8');

// 2. Launch Gateway
console.log(`[Start] Spawning OpenClaw Gateway daemon on port ${port}...`);
const cmd = process.platform === 'win32' ? 'openclaw.cmd' : 'openclaw';
const gatewayProc = spawn(cmd, ['gateway', '--port', String(port), '--bind', 'lan', '--allow-unconfigured'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: String(port)
  }
});

gatewayProc.on('error', (err) => {
  console.error('[Start] Failed to start gateway process:', err);
  process.exit(1);
});

gatewayProc.on('exit', (code, signal) => {
  console.log(`[Start] OpenClaw Gateway exited with code ${code} / signal ${signal}`);
  process.exit(code || 0);
});

process.on('SIGTERM', () => {
  console.log('[Start] SIGTERM received. Shutting down gateway...');
  gatewayProc.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('[Start] SIGINT received. Shutting down gateway...');
  gatewayProc.kill('SIGINT');
});
