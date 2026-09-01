
# Offer Clarity Scorer™

A free, deterministic, browser-based evaluation tool that measures how easily potential customers understand a business proposition.

## What it does

The Offer Clarity Scorer analyzes your offer across 8 key dimensions:

1. **Audience** — Who is this for?
2. **Problem** — What specific problem does the buyer have?
3. **Outcome** — What changes after they buy?
4. **Mechanism** — How do you create that outcome?
5. **Differentiation** — Why this instead of alternatives?
6. **Proof** — What evidence supports the promise?
7. **Risk** — What makes the decision feel safe?
8. **Action** — What should the buyer do next?

Each answer is scored on:
- **Word count** (evidence volume)
- **Concrete signals** (numbers, timeframes, names, credentials)
- **Generic language penalties** (filler words that reduce confidence)

The tool runs entirely in your browser — no sign-up, no data collection.

## Using the tool

1. Visit `offer-clarity-scorer.html` in your browser (or navigate to the deployed site)
2. Answer 8 short questions about your offer in your own words
3. Get a composite clarity score (0–100) and dimension-by-dimension breakdown
4. Receive targeted guidance on your biggest clarity leak
5. Export results if needed

You can skip any question. Results stay in your browser.

## Files

- **index.html** — Main landing page for Kartik Clarity
- **offer-clarity-scorer.html** — The diagnostic tool interface
- **style.css** — Global branding and layout styles
- **assets/ocs.js** — Scoring engine (deterministic analysis algorithm)
- **assets/ocs-ui.js** — UI compatibility layer
- **assets/ocs.css** — Offer Clarity Scorer UI styles
- **assets/brand.css** — Brand-specific styles
- **assets/logos/** — SVG and image assets

## How to run

This is a static HTML/CSS/JavaScript project. No build step required.

### Local development

```bash
# Option 1: Open directly in your browser
open offer-clarity-scorer.html

# Option 2: Use a local server (Python 3)
python3 -m http.server 8000
# Visit http://localhost:8000/offer-clarity-scorer.html

# Option 3: Use Node.js with http-server
npx http-server
# Visit http://localhost:8080/offer-clarity-scorer.html
```

### Deployment

This repo is configured for GitHub Pages. Any push to `main` deploys automatically. The tool is live at:
- `https://kartikr222.github.io/offer-clarity-scorer/offer-clarity-scorer.html`

## Scoring logic

Each dimension answer is analyzed for:

1. **Word count** — Up to 42 points (baseline evidence volume)
2. **Concrete signals** — Up to 32 points
   - Percentages, currency amounts
   - Timeframes (days, weeks, months)
   - Years or dates
   - Titles (CEO, VP, Director, etc.)
3. **Generic language penalties** — Up to 34 points deducted for:
   - "world-class", "best-in-class"
   - "cutting-edge", "innovative", "seamless"
   - "holistic", "end-to-end", "game-changing"
   - "revolutionary", "next-gen", "leverage", etc.
4. **Sentence structure** — Up to 6 points (2+ sentences required)
5. **Punctuation complexity** — Up to 3 points (commas, colons, dashes, etc.)

**Final score:** 0–100, clamped and rounded to nearest integer.

**Sufficiency threshold:** Answers need ≥6 words to generate a usable score.

## Development

To modify the scoring criteria:
- Edit `assets/ocs.js` — search for the `filler` and `concrete` regex arrays
- Adjust weights in the `analyze()` function
- Refresh your browser (no build required)

To modify UI:
- `assets/ocs.css` — Offer Clarity Scorer appearance
- `assets/ocs.js` — Renders the HTML dynamically
- `style.css` — Global styles for layout and typography

## License

© Kartik Clarity. For use as specified.

## Questions?

Visit the landing page (index.html) or contact via the site's contact form.
