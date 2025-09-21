const { getDefaultConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// tell Metro to use the SVG transformer and treat .svg as source, not asset
defaultConfig.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
defaultConfig.resolver.assetExts = defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg');
if (!defaultConfig.resolver.sourceExts.includes('svg')) {
  defaultConfig.resolver.sourceExts.push('svg');
}

module.exports = defaultConfig;