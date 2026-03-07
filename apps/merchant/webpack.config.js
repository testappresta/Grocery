const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  if (config.devServer) {
    config.devServer.port = parseInt(process.env.WEB_PORT || '19006', 10);
  }
  return config;
};
