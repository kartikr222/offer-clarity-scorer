# Kartik Clarity — Revenue Leak Architecture™

Static site with the working Offer Clarity Scorer. No build step, no dependencies — plain HTML/CSS/JS.

## Files
- `index.html` — the page (header, scorer, "where the leaks are" section, contact, footer)
- `styles.css` — all styling
- `script.js` — the scorer logic (7-question quiz → score → tier + leak points)
- `assets/logo-circle.webp` — header logo (from your circle logo)
- `assets/logo-rectangle.webp` — footer logo (from your rectangle logo)

## To make it live at kartikr222.github.io/offer-clarity-scorer/
1. In your `offer-clarity-scorer` repo, delete any old files and copy in everything from this folder, keeping the same structure (`index.html` at the repo root, `assets/` folder alongside it).
2. Commit and push to the branch GitHub Pages is set to serve (usually `main`).
3. In the repo's Settings → Pages, confirm the source is set to that branch, root folder.
4. Give it a minute or two — it'll be live at the same URL.

## Things you'll likely want to personalize
- The contact button currently opens an email to `hello@kartikclarity.com`. Swap in your real inbox or a booking link (e.g. Calendly) in `index.html`, in the `.contact` section.
- The 7 scorer questions and the score-band copy live at the top of `script.js` if you want to adjust the wording.
