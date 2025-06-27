const fs = require('fs');
const path = require('path');

function concatFiles(files, outFile) {
  const contents = files.map(f => fs.readFileSync(f, 'utf8')).join('\n\n');
  fs.writeFileSync(outFile, contents);
  console.log(`Built ${outFile}`);
}

// Order of JavaScript modules
const jsFiles = [
  'js/app.js',
  'js/navigation.js',
  'js/seasons.js',
  'js/snow-effect.js',
  'js/autumn-leaves-effect.js',
  'js/summer-willow-effect.js',
  'js/rain-effect.js',
  'js/water-ripple.js',
  'js/main.js'
].map(f => path.join(__dirname, f));

// Order of CSS modules
const cssFiles = [
  'css/base/reset.css',
  'css/base/variables.css',
  'css/base/base.css',
  'css/base/animations.css',
  'css/base/utilities.css',
  ...fs.readdirSync(path.join(__dirname, 'css/components')).sort().map(f => `css/components/${f}`),
  ...fs.readdirSync(path.join(__dirname, 'css/layouts')).sort().map(f => `css/layouts/${f}`)
].map(f => path.join(__dirname, f));

concatFiles(jsFiles, path.join(__dirname, 'scripts.js'));
concatFiles(cssFiles, path.join(__dirname, 'styles.css'));
