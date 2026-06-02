const fs = require('fs');

function resolveChromiumExecutable(chromium) {
  const candidates = [
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    typeof chromium.executablePath === 'function' ? chromium.executablePath() : null,
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ];
  return candidates.find((candidate) => candidate && fs.existsSync(candidate)) || null;
}

function chromiumLaunchOptions(chromium, options = {}) {
  const executablePath = resolveChromiumExecutable(chromium);
  return executablePath
    ? { ...options, executablePath }
    : { ...options };
}

module.exports = {
  resolveChromiumExecutable,
  chromiumLaunchOptions,
};
