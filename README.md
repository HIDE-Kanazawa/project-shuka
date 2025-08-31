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

- Recommended (no install):

```bash
npx http-server -c-1
```

Visit the URL printed in the terminal (e.g. <http://127.0.0.1:8080/>).

- Alternative (Python built-in):

```bash
python3 -m http.server
```

Then visit <http://localhost:8000/>.

## Deployment

The site can be deployed with GitHub Pages. Enable Pages from the repository settings and serve content from the `main` branch (root). A `CNAME` file is included for the custom domain `project-shuka.com`.

### About CNAME
- Purpose: bind the site to the custom domain `project-shuka.com` on GitHub Pages.
- Format: the file must contain exactly one line with the domain name (no protocol, no path). Comments are not supported.
- DNS: ensure the domain points to GitHub Pages (A/ALIAS/CNAME records as appropriate) and that the custom domain is set in the repository’s Pages settings.

## Notes

This site is a static build checked into the repository. No build step is required. Node.js 18+ is recommended for tooling compatibility.
