const { getDefaultConfig } = require("@react-native/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

// SVG transformer
defaultConfig.transformer.babelTransformerPath = require.resolve("react-native-svg-transformer");
defaultConfig.resolver.assetExts = defaultConfig.resolver.assetExts.filter((ext) => ext !== "svg");
if (!defaultConfig.resolver.sourceExts.includes("svg")) {
  defaultConfig.resolver.sourceExts.push("svg");
}

// ✅ ADD THIS: force axios to not use node build
defaultConfig.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "axios") {
    return context.resolveRequest(context, "axios/dist/browser/axios.cjs", platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = defaultConfig;