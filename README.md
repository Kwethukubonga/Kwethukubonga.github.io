# Kwethukubonga Kunene

Personal portfolio. One page, no framework, no build step.

## Live site

https://kwethukubonga.github.io/personal-site/

## Structure

- `docs/` is the site, and the only copy of it. GitHub Pages serves this folder.
  - `index.html`, `styles.css`, `app.js`
  - `img/` — the photographs used on the page
  - `Kwethukubonga-Kunene-CV.pdf`
- `KwethuPortfolio/` is a small ASP.NET Core project that serves `docs/` on localhost, so the
  site opens with F5 in Visual Studio. It holds no page content of its own.

## Editing

Edit the files in `docs/` directly. Pushing to `Improvements` republishes the site at the same
URL. `docs/index.html` also opens straight from the file system with no server running.

## Built with

HTML, CSS and JavaScript. C# and ASP.NET Core for the local dev server.
