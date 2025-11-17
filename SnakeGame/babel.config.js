module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Remova esta linha se ainda causar problemas
      // 'react-native-reanimated/plugin',
    ],
  };
};