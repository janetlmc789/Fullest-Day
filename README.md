# Daily Planner (PWA)

Your Daily Planner, exported from the Claude artifact so you can host it yourself. The app is unchanged: same pages (Today, Ideas, Progress), same styling, same behaviour. It is plain static files with no build step and no server code.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The app itself (your artboard, with PWA tags added to `<head>` and the font link pointed at local files) |
| `support.js` | The runtime the app needs to run (the same file the artifact used; it bundles React) |
| `fonts/` | Instrument Sans and Newsreader, self-hosted so the app works offline (SIL Open Font License) |
| `manifest.webmanifest` | Makes the app installable (name, colors, icons) |
| `sw.js` and `register-sw.js` | Service worker: offline support, and a request to keep your saved data |
| `icons/` | App icons (a red tile with a check mark). Replace them with your own if you like, keeping the same file names and sizes |
| `backup.html` | Optional page to download a backup of your data, or import data (see below) |
| `_headers` | Cache settings for Netlify and Cloudflare Pages (other hosts can ignore it) |

Nothing is loaded from the internet at run time.

## Try it on your computer

From this folder:

```
python3 -m http.server 8080
```

Then open http://localhost:8080. Service workers only run on `localhost` or on HTTPS, so opening `index.html` by double-clicking will show the app but not the offline and install features.

## Host it

Upload the whole folder to any static host. It must be served over HTTPS.

- **Netlify or Cloudflare Pages:** drag the folder in (or connect a repo). `_headers` is picked up automatically.
- **GitHub Pages:** put the folder contents in a repo and turn on Pages. All paths are relative, so it also works under a sub-path such as `you.github.io/planner/`.
- **Your own server (nginx, Apache, S3 and similar):** serve the files as they are. Make sure `manifest.webmanifest` is sent as `application/manifest+json`, and that `sw.js` and `index.html` are not cached for long (`Cache-Control: no-cache`).

## Install it

Open the hosted address in Chrome, Edge or Safari, then use the browser's Install / Add to Home Screen option. On iPhone: Share, then Add to Home Screen.

## Your data

- The planner saves to the browser's `localStorage` on the device you use, under the key `daily-planner-v1`. It stays after reloads, and works offline.
- Data does not sync between devices or browsers, and a different web address starts empty. Data you entered in the Claude artifact stays in the artifact and will not appear here by itself.
- Open `backup.html` (for example `https://your-site/backup.html`) to download a backup file, or to import one. To bring the artifact's data across, open the artifact in a desktop browser, open the developer console (F12), choose the artifact's frame in the context drop-down at the top of the console, run `copy(localStorage.getItem('daily-planner-v1'))`, then paste the result into the Import box on `backup.html` on your new site.
- Clearing site data or uninstalling the app in some browsers deletes the saved data. Download a backup now and then.

## Updating later

If you change any file, edit `CACHE_VERSION` at the top of `sw.js` (for example to `daily-planner-v2`). Installed copies then fetch the new files the next time they open with a connection.

## Notes

- `index.html` differs from the artifact's file in `<head>` only: viewport, theme color, manifest, icons and service worker tags were added, and the Google Fonts link was replaced by `./fonts/fonts.css`. The app markup, styles and script are identical.
- The Newsreader and Instrument Sans font files come from the Fontsource project and are under the SIL Open Font License 1.1 (`fonts/LICENSE-OFL.txt`). `support.js` contains its own license notices (React is MIT licensed).
