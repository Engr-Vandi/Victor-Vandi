# victorvandi.com

Personal site for **Victor Vandi** — web design & development, and video editing.
Static, no build step, deployed on GitHub Pages from the repository root.

## Files

Every file sits in the repository root — no folders — so each one can be
uploaded individually through the GitHub web interface.

```
index.html                markup for every page (single-page app)
style.css                 design system + all styling
articles.js               article content
app.js                    routing, rendering, interactions
404.html                  GitHub Pages fallback that restores clean URLs
CNAME                     victorvandi.com
.nojekyll                 stops Jekyll from touching the files
robots.txt
sitemap.xml
victor-vandi-profile.jpg
```

`articles.js` must load before `app.js`; `index.html` already orders them that way.

## Routes

Clean URLs, no hashes. `/`, `/work`, `/services`, `/about`, `/articles`, `/contact`,
plus deep links to a single article at `/articles/<slug>`.

GitHub Pages has no server-side rewrite, so a direct hit on `/work` returns
`404.html`. That file forwards the path to `/?page=work`, and `app.js` restores the
clean URL. Old links (`/website`, `/reviews`, `/portfolio`, `/packages`) redirect to
their new homes, so nothing already shared is broken.

## Things you edit

Everything you are likely to change sits in the `CONFIG` block at the top of
`app.js`:

| Name       | What it does |
|------------|--------------|
| `PROFILES` | Fiverr and Upwork profile URLs. **Both are empty.** Paste the real URLs and the profile cards, footer links, and contact rows appear automatically. Left empty, the site falls back to an email CTA instead of showing a dead button. |
| `EMAIL`    | Contact address used in every mailto link. |
| `SOCIALS`  | LinkedIn / Instagram links. |
| `TOOLS`    | Software chips on the Services page. Delete anything you don't actually use. |
| `MARQUEE`  | The scrolling capability strip on the home page. |
| `PROJECTS` | Portfolio entries. |
| `STEPS`    | The four process steps. |

Article text lives in `articles.js` as an array of
`{ tag, title, meta, body }`. URL slugs are generated from the title at runtime,
so adding an article is just adding an object.

## Contact form

Posts to [Web3Forms](https://web3forms.com) with the access key in `index.html`.
If the request fails, the form shows the email address as a fallback rather than
failing silently.

## Local preview

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Direct URLs like `/work` won't resolve with a
plain static server (no 404 fallback) — use `/?page=work` locally.
