# Quality Marbles – Hello World

Simple static page to verify your Cloudflare domain is wired up.

## Run locally

```bash
cd /Users/shivmistry/Desktop/PROJECTS/quality-marbles
python3 -m http.server 3000
```

Visit http://localhost:3000 to see the page.

## Deploy to Cloudflare Pages

1) Push this repo to Git.  
2) In Cloudflare Pages, create a new project from the repo.  
3) Build command: _none_ (static).  
4) Output directory: `.`  
5) After deploy, map your purchased domain to the Pages project in Cloudflare and wait for DNS to propagate.

When you see “Hello from Quality Marbles” at your domain, everything is connected.

