# Obsidian Clone WebApp - Specification

## 1. Project Overview

**Project Name:** NoteVault  
**Type:** Web Application (Progressive Web App)  
**Core Functionality:** A full-featured personal knowledge management (PKM) system with markdown notes, bi-directional linking, tags, and a visual graph view for exploring connections.  
**Target Users:** Individuals seeking a local-first, privacy-focused note-taking and knowledge management tool.

---

## 2. UI/UX Specification

### Layout Structure

**Three-Panel Layout:**
- **Sidebar (240px, collapsible):** File tree / folder navigation
- **Editor Panel (flex-grow):** Markdown editing with live preview toggle
- **Context Panel (280px, collapsible):** Backlinks, outgoing links, tags

**Responsive Breakpoints:**
- Desktop: ≥1024px (full three-panel)
- Tablet: 768-1023px (sidebar overlay, two-panel)
- Mobile: <768px (single panel with navigation drawer)

### Visual Design

**Color Palette (Dark Theme - Default):**
- Background Primary: `#1a1a2e`
- Background Secondary: `#16213e`
- Background Tertiary: `#0f3460`
- Accent Primary: `#e94560`
- Accent Secondary: `#533483`
- Text Primary: `#eaeaea`
- Text Secondary: `#a0a0a0`
- Border: `#2a2a4a`
- Link Color: `#5bc0de`
- Tag Background: `#2d4a3e`
- Tag Text: `#7fdbca`

**Typography:**
- Headings: "JetBrains Mono", monospace
- Body: "Inter", -apple-system, sans-serif
- Editor: "JetBrains Mono", monospace
- Font Sizes: H1: 28px, H2: 22px, H3: 18px, Body: 15px, Small: 13px

**Spacing System:**
- Base unit: 8px
- Padding small: 8px
- Padding medium: 16px
- Padding large: 24px
- Border radius: 6px

**Visual Effects:**
- Panel shadows: `0 4px 20px rgba(0,0,0,0.3)`
- Hover transitions: 150ms ease
- Focus ring: 2px solid `#e94560`

### Components

**Sidebar:**
- Folder tree with expand/collapse
- Note list with search filter
- "New Note" and "New Folder" buttons
- Drag-drop reordering

**Editor:**
- Toolbar: Bold, Italic, Heading, Link, Code, List, Quote
- Split view toggle (edit / preview / both)
- Auto-save indicator
- Word count display

**Context Panel:**
- Backlinks section (notes linking to current)
- Outgoing links section (links from current note)
- Tags section (clickable tag filter)
- Graph view mini-visualization

**Graph View (Modal/Full-screen):**
- Force-directed graph of all notes
- Nodes: circles sized by connection count
- Edges: lines representing links
- Click node to open note
- Zoom and pan controls

**Modal Dialogs:**
- Delete confirmation
- Settings panel
- Export options
- Graph view

---

## 3. Functionality Specification

### Core Features

**Note Management:**
- Create, rename, delete notes
- Organize in folders (nested folders supported)
- Search notes by title and content
- Sort by date modified, date created, title

**Markdown Editor:**
- Full CommonMark support
- Syntax highlighting in editor
- Live preview (toggle between edit/preview/split)
- Auto-save to localStorage (debounced 1s)
- Keyboard shortcuts (Ctrl+B bold, Ctrl+I italic, etc.)

**Bi-directional Links:**
- `[[Note Name]]` syntax for linking
- Auto-complete dropdown when typing `[[`
- Backlinks: show all notes linking to current note
- Broken link detection (red highlight)

**Tags:**
- `#tag` syntax in markdown
- Tag autocomplete
- Tag sidebar showing all tags with counts
- Click tag to filter notes

**Graph View:**
- Force-directed visualization using D3.js
- Nodes represent notes
- Edges represent links between notes
- Node size reflects link count
- Interactive: click to open, hover for preview

**Export:**
- Export single note as Markdown (.md)
- Export single note as JSON
- Export all notes as ZIP (markdown files)
- Export all notes as JSON backup

### Data Handling

**Storage:**
- IndexedDB for note storage (better than localStorage for large data)
- Database name: `notevault_db`
- Stores: `notes` (id, title, content, folderId, created, modified), `folders` (id, name, parentId)

**Data Schema:**
```javascript
Note: {
  id: string (UUID),
  title: string,
  content: string (markdown),
  folderId: string | null,
  createdAt: timestamp,
  modifiedAt: timestamp
}

Folder: {
  id: string (UUID),
  name: string,
  parentId: string | null
}
```

### Edge Cases

- Empty note title: auto-generate "Untitled Note"
- Duplicate note titles: allowed, use ID for linking
- Circular links: handled in graph view
- Large vaults: pagination in file tree, virtual scrolling
- Import conflicts: prompt user for overwrite/merge
- Storage quota exceeded: warn user, suggest export

---

## 4. Acceptance Criteria

### Visual Checkpoints
- [ ] Three-panel layout renders correctly on desktop
- [ ] Dark theme colors match specification
- [ ] Sidebar shows folder tree with expand/collapse
- [ ] Editor has toolbar with working formatting buttons
- [ ] Context panel shows backlinks and tags
- [ ] Graph view modal opens with interactive visualization
- [ ] Responsive: sidebar collapses to drawer on tablet/mobile

### Functional Checkpoints
- [ ] Can create, edit, delete notes
- [ ] Can create and navigate folders
- [ ] Markdown renders correctly in preview
- [ ] `[[link]]` syntax creates clickable links
- [ ] Backlinks panel shows incoming links
- [ ] `#tag` syntax creates tags
- [ ] Search filters notes in real-time
- [ ] Export generates valid Markdown/JSON files
- [ ] Data persists after page refresh (IndexedDB)
- [ ] Graph view displays note connections

### Performance
- [ ] Initial load < 2 seconds
- [ ] Note switching < 100ms
- [ ] Graph renders < 1 second for 100 notes
- [ ] No memory leaks during extended use