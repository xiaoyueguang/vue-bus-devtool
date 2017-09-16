const path = require('path')

module.exports = {
  entry: './dev/index.js',
  output: {
    path: path.resolve(__dirname, './'),
    filename: 'dev.js'
  },
  
}