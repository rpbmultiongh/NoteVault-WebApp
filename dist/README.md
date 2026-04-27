# NoteVault - Obsidian Clone WebApp

A full-featured personal knowledge management (PKM) system with markdown notes, bi-directional linking, tags, and graph visualization.

## Quick Deploy Options

### Option 1: Netlify (Easiest - Drag & Drop)
1. Go to https://app.netlify.com/drop
2. Drag the `dist/` folder onto the page
3. Your app is live!

### Option 2: Vercel
```bash
 npm install -g vercel
 vercel
```

### Option 3: GitHub Pages
```bash
 git init
 git add .
 git commit -m "Initial commit"
 # Push to GitHub, enable GitHub Pages in settings
```

### Option 4: Cloudflare Pages
1. Go to https://dash.cloudflare.com/pages
2. Connect your git repo
3. Deploy!

## Local Development

```bash
# Start local server
python3 -m http.server 8000

# Or with npx
npx serve .
```

Then open http://localhost:8000

## Features

- ✅ Markdown editor with live preview
- ✅ Bi-directional links `[[Note Name]]`
- ✅ Tags #tag
- ✅ Backlinks panel
- ✅ Graph view (D3.js)
- ✅ Local storage (IndexedDB)
- ✅ Export to Markdown/JSON

## Tech Stack

- Vanilla JavaScript
- IndexedDB for storage
- D3.js for graph visualization
- Marked.js for markdown parsing

## Files

```
dist/
├── index.html   # Main app
├── styles.css  # Styles
├── app.js      # Application code
└── SPEC.md    # Specification
```

## License

MIT