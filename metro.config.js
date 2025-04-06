const { getDefaultConfig } = require('expo/metro-config');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

//Get the default Expo config
const defaultConfig = getDefaultConfig(__dirname);

//Add 'cjs' to asset extensions if not already present
defaultConfig.resolver.assetExts.push('cjs');

//Wrap with Reanimated config and export
module.exports = wrapWithReanimatedMetroConfig(defaultConfig);