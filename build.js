const fs = require('fs');
const path = require('path');

function tryRequire(name, fallback) {
  try {
    return require(name);
  } catch (err) {
    console.warn(`${name} not installed, using fallback minifier`);
    return fallback;
  }
}

function simpleJsMinify(code) {
  return code
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\n+/g, '')
    .replace(/\s+/g, ' ');
}

function simpleCssMinify(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\n+/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,])\s*/g, '$1')
    .trim();
}

const terser = tryRequire('terser', { minify: code => ({ code: simpleJsMinify(code) }) });
const csso = tryRequire('csso', { minify: code => ({ css: simpleCssMinify(code) }) });

function concatFiles(files) {
  return files.map(f => fs.readFileSync(f, 'utf8')).join('\n\n');
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

const jsContent = concatFiles(jsFiles);
const jsResult = terser.minify(jsContent);
fs.writeFileSync(path.join(__dirname, 'scripts.js'), jsResult.code || jsResult);
console.log('Built scripts.js');

const cssContent = concatFiles(cssFiles);
const cssResult = csso.minify(cssContent);
fs.writeFileSync(path.join(__dirname, 'styles.css'), cssResult.css || cssResult);
console.log('Built styles.css');
