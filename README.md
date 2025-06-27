# Shuka Official Site

This repository contains the static files for the Shuka – 秀歌 project.  
The JavaScript that powers the interactive effects is bundled into `scripts.js`.

## Modular Source

All individual modules live in the `src/` directory. They include the
various seasonal effects and application logic. The `scripts.js` file is not
edited manually. It is generated from these modules using [Rollup](https://rollupjs.org/).

## Building `scripts.js`

1. Install the development dependencies (Node.js and npm are required):
   ```bash
   npm install
   ```
2. Run the build script to generate `scripts.js`:
   ```bash
   npm run build
   ```

The Rollup configuration is defined in `rollup.config.js` and outputs the
bundle to the project root so existing HTML references continue to work.

## Repository Structure

- `src/` – individual JavaScript modules
- `scripts.js` – bundled output used by the site
- Other static assets (`index.html`, `styles.css`, `img/`, etc.) remain
  unchanged.

