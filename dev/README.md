# dev/

Not part of the shipped app. Nothing in `src/` imports anything in here —
safe to delete if you don't need it.

- **scraping-scripts/** — the one-off Node/Puppeteer scripts used to inspect
  and extract markup/CSS/JS from the reference site while building this
  clone (inspect_*, extract_*, fetch_*, download_*, test-*, etc).
- **scraped-reference/** — the raw HTML/CSS/JS bundles pulled from the
  reference site during that process, kept only for reference.

If you want to keep using these scripts for future scraping work, consider
moving them into a separate tooling repo rather than shipping them next to
the app.
