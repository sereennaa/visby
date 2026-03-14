const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Zustand v5's ESM files (.mjs) use `import.meta.env` which Metro's Hermes
// web transform doesn't support. Override resolution for zustand specifically
// to use the CJS versions instead, while leaving all other packages intact.
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    platform === 'web' &&
    (moduleName === 'zustand' ||
      moduleName === 'zustand/middleware' ||
      moduleName === 'zustand/shallow' ||
      moduleName.startsWith('zustand/'))
  ) {
    const zustandRoot = path.dirname(require.resolve('zustand/package.json'));
    const subpath = moduleName === 'zustand' ? 'index' : moduleName.replace('zustand/', '');
    return {
      type: 'sourceFile',
      filePath: path.join(zustandRoot, `${subpath}.js`),
    };
  }
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
