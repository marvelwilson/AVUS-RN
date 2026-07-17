const { getDefaultConfig } = require('expo/metro-config');

/**
 * Metro configuration for Expo + ethers + @noble/hashes.
 *
 * The root cause of the warning:
 *   "Attempted to import ... @noble/hashes/crypto.js which is not listed in the "exports" ..."
 *
 * Ethers 6.16 pins @noble/hashes@1.3.2 exactly.
 * That package only exposes the subpath as "./crypto" (no ".js") in its "exports" map.
 * Some resolution paths (Metro's package exports handling + legacy "browser"/"module" fields
 * inside noble or ethers' distributed files) request the specifier with the literal ".js" extension.
 *
 * We intercept the bad request and redirect it to the officially supported bare subpath.
 * This is the recommended approach when you cannot change the call site inside node_modules.
 */
const config = getDefaultConfig(__dirname);

// Preserve any existing custom resolveRequest from Expo's defaults
const originalResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (typeof moduleName === 'string') {
    // @noble/* packages (especially hashes 1.3.x pinned by ethers) only declare
    // subpaths without file extensions in their "exports" map (e.g. "./crypto").
    // When Metro (or legacy fields inside the packages) requests ".../crypto.js",
    // we get the warning + file-based fallback.
    // Normalize any @noble/hashes subpath that ends with .js back to the bare specifier.
    if (moduleName.includes('@noble/hashes/') && moduleName.endsWith('.js')) {
      const target = moduleName.replace(/\.js$/, '');
      return originalResolveRequest
        ? originalResolveRequest(context, target, platform)
        : context.resolveRequest(context, target, platform);
    }
  }

  // Delegate to the previous resolver (Expo's built-in logic)
  return originalResolveRequest
    ? originalResolveRequest(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
