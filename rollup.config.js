import multiEntry from '@rollup/plugin-multi-entry';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: ['src/app.js',
          'src/navigation.js',
          'src/seasons.js',
          'src/autumn-leaves-effect.js',
          'src/snow-effect.js',
          'src/summer-willow-effect.js',
          'src/rain-effect.js',
          'src/water-ripple.js',
          'src/dev-tools.js',
          'src/main.js'],
  plugins: [multiEntry(), resolve(), commonjs()],
  output: {
    file: 'scripts.js',
    format: 'iife',
    name: 'ShukaBundle'
  }
};
