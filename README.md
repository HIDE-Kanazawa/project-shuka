# Shuka – 秀歌 Official Site

This repository hosts the source for the web site of **Shuka – 秀歌**, an AI music artist. The site delivers a seasonal Japanese aesthetic with interactive animations and audio tracks.

## Project structure

```
project-shuka/
├── index.html            # main entry point
├── css/                  # modular CSS source
│   ├── base/
│   ├── components/
│   └── layouts/
├── js/                   # JavaScript modules
├── styles.css            # bundled CSS
├── scripts.js            # bundled JavaScript
├── img/                  # images
├── audio/                # music tracks
└── video/                # promotional videos
```

*HTML* and *CSS* modules live under `index.html` and the `css/` directory. Individual JavaScript modules are kept in `js/` and compiled into `scripts.js` for use on the page. Additional effects powered by Three.js are contained in `three-lanterns.js`.

## Local preview

Any static server can be used to preview the site locally. Example using Python:

```bash
python3 -m http.server
```

Then visit <http://localhost:8000/> in your browser.

## Deployment

The site can be deployed with GitHub Pages. Enable Pages from the repository settings and serve content from the `main` branch (root). A `CNAME` file is included for the custom domain `project-shuka.com`.

## Build notes

`styles.css` and `scripts.js` are bundled files. If you modify the modules in `css/` or `js/`, rebuild these outputs before deploying. No automated build script is provided; combine the modules manually or with your preferred tooling.
