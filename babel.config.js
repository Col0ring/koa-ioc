module.exports = {
  presets: [['@babel/preset-env', { modules: false }]],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    [
      '@babel/plugin-transform-runtime',
      {
        useESModules: false,
      },
    ],
  ],
}
