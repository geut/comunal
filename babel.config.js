module.exports = {
  presets: [
    [
      require('@babel/preset-env'),
      { targets: { electron: require('electron/package').version } }
    ],
    [require('@babel/preset-react'), { development: true }]
  ]
}
