# Quality Granite and Marble

Static marketing site for Quality Granite and Marble — natural stone fabrication and installation.

## Run locally

```bash
python3 -m http.server 3000
```

Open http://localhost:3000 (serves `index.html`, `css/`, and `js/`).

## Deploy to Cloudflare Pages

1. Push this repo to Git.
2. In Cloudflare Pages, create a project from the repo.
3. Build command: _none_ (static HTML).
4. Output directory: `.`
5. Map your domain to the Pages project and wait for DNS to propagate.

