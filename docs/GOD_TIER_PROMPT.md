# ULTIMATE GOD-TIER WEBAPP PROMPT
## The Complete Prompt to Build NoteVault - An Obsidian Clone WebApp

---

**You are an expert senior full-stack web developer. Your task is to build a production-ready, fully-featured NoteVault webapp that is an Obsidian clone with ALL the features listed below.**

**CRITICAL REQUIREMENTS:**
1. Write ALL code in a SINGLE pass - do NOT iterate or ask for clarification
2. Build the complete app with ALL features - no placeholders
3. Use vanilla JavaScript - NO React, Vue, or frameworks
4. Use IndexedDB for storage - NOT localStorage
5. Always show working, production-quality code

---

## PROJECT OVERVIEW

Build **NoteVault** - a full-featured personal knowledge management (PKM) web application (PWA) with markdown notes, bi-directional linking, tags, graph visualization, nested folder organization, sophisticated search, and comprehensive import/export. It should be a local-first, privacy-focused Obsidian alternative that runs entirely in the browser.

**Tech Stack:**
- Vanilla JavaScript (ES6+)
- IndexedDB for persistent storage
- D3.js for graph visualization
- Marked.js for markdown parsing
- JSZip for ZIP exports
- Dark theme UI

---

## UI/UX SPECIFICATION

### Layout Structure

**Three-Panel Layout:**
1. **Left Sidebar (240px, collapsible)**
   - App title/logo
   - "New Note" button
   - Search input
   - "New Folder" button
   - "Graph" button
   - Folder tree (collapsible, showing nested folders)
   - Note list (notes in current folder)
   - "Exp/Imp" (Export/Import) button
   - Settings button

2. **Main Editor Panel (flex-grow)**
   - Note title input (large, prominent)
   - Toolbar: Bold, Italic, Heading, Link, Code, List, Quote buttons
   - View toggle (Editor/Preview/Split)
   - Save status indicator
   - Word count
   - Editor textarea (markdown input)
   - Preview pane (rendered markdown)

3. **Right Context Panel (280px, collapsible)**
   - Backlinks section
   - Outgoing links section
   - Tags section

**Responsive Breakpoints:**
- Desktop: ≥1024px (full three-panel)
- Tablet: 768-1023px (sidebar overlay)
- Mobile: <768px (single panel)

### Visual Design

**Color Palette (Dark Theme - MANDATORY):**
```css
:root {
    --bg-primary: #1a1a2e;        /* Deep navy background */
    --bg-secondary: #16213e;        /* Slightly lighter navy */
    --bg-tertiary: #0f3460;        /* Card/hover background */
    --accent-primary: #e94560;       /* Vibrant pink-red accent */
    --accent-secondary: #533483;        /* Purple accent */
    --text-primary: #eaeaea;         /* Main text */
    --text-secondary: #a0a0a0;     /* Muted text */
    --border-color: #2a2a4a;        /* Borders */
    --link-color: #5bc0de;          /* Cyan for links */
    --tag-bg: #2d4a3e;           /* Tag background */
    --tag-text: #7fdbca;           /* Tag text */
}
```

**Typography:**
- Headings: 'JetBrains Mono', monospace
- Body: 'Inter', -apple-system, sans-serif
- Editor: 'JetBrains Mono', monospace
- Font Sizes: H1: 28px, H2: 22px, H3: 18px, Body: 15px, Small: 13px

**Spacing System:**
- Base unit: 8px
- Spacing scale: 4px, 8px, 16px, 24px, 32px
- Border radius: 6px

**Visual Effects:**
- Panel shadows: 0 4px 20px rgba(0,0,0,0.3)
- Hover transitions: 150ms ease
- Focus ring: 2px solid #e94560

---

## DATA SCHEMA

**Note Object:**
```javascript
{
    id: string (UUID v4),
    title: string,
    content: string (markdown),
    folderId: string | null,
    createdAt: timestamp,
    modifiedAt: timestamp
}
```

**Folder Object:**
```javascript
{
    id: string (UUID v4),
    name: string,
    parentId: string | null
}
```

---

## CORE FEATURES (NON-EXHAUSTIVE LIST)

### 1. Note Management
- [x] Create new notes (button + automatically when none exist)
- [x] Edit notes with live markdown preview
- [x] Auto-save (debounced 1 second after edits)
- [x] Delete notes (with confirmation)
- [x] Rename notes (inline editing)
- [x] Word count display
- [x] Save status indicator

### 2. Folder Organization (CRITICAL - MUST IMPLEMENT)
- [x] Create folders (as children of current folder)
- [x] Nested folders (unlimited depth)
- [x] Click folder to navigate into it
- [x] Folder tree showing all folders
- [x] Folder count badges
- [x] Breadcrumb navigation
- [x] "All Notes" to show root notes
- [x] Context menu on folders:
  - [x] Rename folder
  - [x] Move folder to another folder
  - [x] Delete folder (with notes inside)
- [x] Create notes INSIDE current folder

### 3. Note Context Menu (MUST HAVE)
- [x] Show ⋮ button on note hover
- [x] Move note to different folder
- [x] Export single note as .md
- [x] Delete note

### 4. Markdown Editor
- [x] Full CommonMark support
- [x] Toolbar buttons (Bold, Italic, Heading, Link, Code, List, Quote)
- [x] Keyboard shortcuts (Ctrl+B, Ctrl+I, Ctrl+S)
- [x] Split view toggle (edit/preview/split)
- [x] Syntax highlighting in preview

### 5. Bi-Directional Links
- [x] [[Note Name]] syntax in editor
- [x] Clickable links in preview
- [x] Broken link highlighting (red)
- [x] Backlinks panel (notes linking TO current)
- [x] Outgoing links panel (links FROM current)

### 6. Tags
- [x] #tagname syntax
- [x] Tag click to filter
- [x] Tags panel showing all tags in note
- [x] Tag styling (green background)

### 7. Graph View
- [x] D3.js force-directed graph
- [x] Nodes = notes
- [x] Edges = links between notes
- [x] Node size = connection count
- [x] Click node to open note
- [x] Modal fullscreen view
- [x] Zoom and pan

### 8. Search (MUST BE SOPHISTICATED)
- [x] Real-time search in title AND content
- [x] AND logic - multiple words must ALL match
  - Example: "meeting action item" finds notes with ALL three words
- [x] Search results indicator
- [x] Export search results as ZIP (Shift+Enter)
- [x] Tag filtering (#tagname)

### 9. Import (CRITICAL - MUST BE CLEAR UI)
Create THREE separate import options:
1. **Single Markdown File (.md)** - Import one .md file
2. **Folder of Markdown (.zip)** - Import zip with folder structure
3. **Full Vault Backup (.json)** - Import complete vault backup

### 10. Export (CRITICAL)
- [x] Current note as .md
- [x] Current note as .json
- [x] All notes as ZIP with folder structure
- [x] All notes as .json (full backup)
- [x] Search results as ZIP

### 11. Storage
- [x] IndexedDB (NOT localStorage - MUST use IndexedDB)
- [x] Database name: 'notevault_db'
- [x] Version: 1
- [x] Notes store with indexes
- [x] Folders store with indexes
- [x] Automatic persistence

---

## FOLDER STRUCTURE IN CODE

You MUST create these files:

### index.html (208+ lines)
- Complete HTML5 structure
- All panels (sidebar, editor, context panel)
- All modals (graph, export/import, settings, delete)
- CDN links: Google Fonts, JSZip, Marked, D3.js
- CSS and JS links

### styles.css (1089+ lines)
- Complete dark theme
- All component styles
- Responsive design
- Animations
- Modal styles
- Context menu styles
- Breadcrumb styles

### app.js (1493+ lines)
- ALL functions in ONE file (IIFE pattern)
- IndexedDB setup
- CRUD operations
- Folder navigation
- Search (AND logic)
- Export (with ZIP)
- Import (three options)
- Context menus
- Graph rendering
- Event listeners

---

## KEY IMPLEMENTATION DETAILS

### IndexedDB Setup
```javascript
const DB_NAME = 'notevault_db';
const DB_VERSION = 1;
// Create notes store: id (key), title, folderId, createdAt, modifiedAt indexes
// Create folders store: id (key), name, parentId indexes
```

### AND Search Implementation
```javascript
function performSearch(query) {
    const searchWords = query.toLowerCase().split(/\s+/).filter(w => w.trim());
    searchResults = notes.filter(note => {
        const searchText = (note.title + ' ' + note.content).toLowerCase();
        return searchWords.every(word => searchText.includes(word));
    });
}
```

### ZIP Export with Folders
```javascript
async function exportAllAsMarkdown() {
    const zip = new JSZip();
    const rootNotes = notes.filter(n => !n.folderId);
    // Add root notes
    // Add foldered notes to folder structure
    // Generate and download
}
```

### CSV Export Search Results
```javascript
// Shift+Enter triggers exportSearchResults()
// Exports searchResults array as ZIP
```

### HTML Structure with Modals
```html
<!-- Main app -->
<!-- Graph modal -->
<!-- Export/Import modal with THREE import options -->
<!-- Settings modal -->
<!-- Delete confirmation modal -->
```

---

## ACCEPTANCE CRITERIA

### Visual Checkpoints
- [ ] Three-panel dark theme layout renders correctly
- [ ] Folders show in tree with counts
- [ ] Clicking folder shows its notes
- [ ] Breadcrumb navigation works
- [ ] Note list shows notes in current folder
- [ ] Markdown renders correctly in preview
- [ ] Tags are styled correctly (#tag with green background)
- [ ] [[links]] are styled and clickable
- [ ] Graph shows connections
- [ ] Context menus appear on note/folder hover

### Functional Checkpoints
- [ ] Can create notes in specific folders
- [ ] Can create folders in folders
- [ ] Can navigate nested folders
- [ ] Can rename folders via context menu
- [ ] Can move folders via context menu
- [ ] Can delete folders (cascades to notes)
- [ ] Can move notes via context menu
- [ ] Can export single note
- [ ] AND search finds notes with ALL words
- [ ] Shift+Enter exports search results
- [ ] All three import options work
- [ ] ZIP export preserves folder structure
- [ ] Graph shows correct connections
- [ ] Auto-save works
- [ ] IndexedDB persists data

---

## EXECUTION INSTRUCTIONS

1. **Create SPEC.md first with full specification**
2. **Create index.html with all structure**
3. **Create styles.css with dark theme**
4. **Create app.js with ALL functions**
5. **Test in browser**
6. **Verify all features work**

**DO NOT:**
- Ask for clarification
- Use placeholders
- Skip any feature
- Use incomplete code
- Iterate - generate complete code in first pass

---

## EXAMPLE USAGE SCENARIOS

### User Creates Note in Folder
1. User clicks folder in sidebar
2. Folder becomes "current folder"
3. Breadcrumb updates
4. Note list shows notes ONLY in that folder
5. User clicks "New Note"
6. Note is created with folderId = currentFolderId

### User Searches with AND Logic
1. User types "meeting action" in search
2. Only notes with BOTH "meeting" AND "action" appear
3. Search indicator shows count
4. User presses Shift+Enter
5. ZIP downloads with matching notes

### User Exports Search Results
1. User searches for terms
2. Search results display
3. User presses Shift+Enter
4. ZIP file downloads with matching notes

### User Imports Folder Structure
1. User clicks Exp/Imp
2. Import modal opens
3. User selects "Folder of Markdown (.zip)"
4. User selects ZIP file
5. Files import preserving folder structure
6. Notes appear in correct folders

---

## COMPLETE CODE STRUCTURE

### index.html (EXCERPT - SHOWS ALL PANELS)
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Meta, title, fonts, CSS -->
</head>
<body>
    <div id="app">
        <aside id="sidebar">
            <!-- App title, New Note, New Folder, Graph buttons -->
            <!-- Search input -->
            <!-- Folder tree -->
            <!-- Note list -->
            <!-- Exp/Imp, Settings buttons -->
        </aside>
        <main id="mainContent">
            <!-- Editor panel: title input, toolbar, editor, preview -->
        </main>
        <aside id="contextPanel">
            <!-- Backlinks, outgoing links, tags -->
        </aside>
    </div>
    <!-- Graph modal -->
    <!-- Export/Import modal with THREE input options -->
    <!-- Settings modal -->
    <!-- Delete confirmation -->
    <!-- JS: JSZip, Marked, D3, app.js -->
</body>
</html>
```

### app.js (EXCERPT - SHOWS KEY FUNCTIONS)
```javascript
(function() {
    'use strict';
    
    // Database
    const DB_NAME = 'notevault_db';
    const DB_VERSION = 1;
    let db = null;
    
    // State
    let currentNote = null;
    let notes = [];
    let folders = [];
    let currentFolderId = null;
    let folderPath = [];
    let searchResults = [];
    
    // IndexedDB functions
    function openDatabase() { /* ... */ }
    function getAllNotes() { /* ... */ }
    function saveNote(note) { /* ... */ }
    function deleteNoteFromDB(id) { /* ... */ }
    function getAllFolders() { /* ... */ }
    function saveFolder(folder) { /* ... */ }
    function deleteFolderFromDB(id) { /* ... */ }
    
    // Note functions
    async function createNewNote() { /* Creates in currentFolderId */ }
    async function selectNote(id) { /* ... */ }
    async function saveCurrentNote() { /* ... */ }
    
    // Folder functions
    async function createNewFolder() { /* Creates in currentFolderId */ }
    async function renameFolder(folderId, newName) { /* ... */ }
    async function deleteFolder(folderId) { /* Cascades to notes */ }
    async function moveNoteToFolder(noteId, targetFolderId) { /* ... */ }
    async function moveFolderToFolder(folderId, targetParentId) { /* ... */ }
    
    // Rendering
    function renderNoteList() { /* Shows notes in currentFolderId */ }
    function renderFolderTree() { /* Recursive folder tree */ }
    function renderBreadcrumb() { /* Navigation path */ }
    function navigateToFolder(folderId) { /* Sets currentFolderId, renders */ }
    function navigateToRoot() { /* Shows root notes */ }
    
    // Search
    function performSearch(query) { /* AND logic - all words must match */ }
    async function exportSearchResults() { /* ZIP of searchResults */ }
    
    // Export
    async function exportAllAsMarkdown() { /* ZIP with folder structure */ }
    function exportAllAsJSON() { /* Full vault backup */ }
    
    // Import
    async function importFromJSON(content) { /* Full vault restore */ }
    async function importFromMarkdown(content) { /* Single note */ }
    async function importFromZIP(file) { /* Folder structure */ }
    
    // Context menus
    function handleFolderRename(folderId) { /* prompt() */ }
    function handleFolderDelete(folderId) { /* confirm() */ }
    function showMoveFolderDialog(folderId) { /* prompt() */ }
    function showMoveNoteDialog(noteId) { /* prompt() */ }
    function exportSingleNote(noteId) { /* Single .md */ }
    
    // Graph
    function renderGraph() { /* D3.js force-directed */ }
    
    // Init
    async function init() { /* Open DB, load data, render */ }
    
    // Bootstrap
    init();
})();
```

---

## FINAL CHECKLIST

Before finishing, verify:
- [ ] All three panels visible in dark theme
- [ ] Folder click navigates and shows notes inside
- [ ] Notes created in current folder
- [ ] ⋮ appears on note hover
- [ ] Context menu has Move/Export/Delete
- [ ] Folder ⋮ has Rename/Move/Delete
- [ ] AND search shows correct results
- [ ] Shift+Enter exports search results
- [ ] ZIP export has folder structure
- [ ] All three import options present and work
- [ ] Graph shows connections
- [ ] Data persists in IndexedDB

---

**Now build this complete app in ONE generation. No placeholders. No "TODO". Complete working code.**