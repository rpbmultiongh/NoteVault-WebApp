# Google Drive Clone - SPEC.md

## 1. Project Overview

**Project Name:** DriveClone  
**Type:** Web Application (React SPA)  
**Core Functionality:** A browser-based file management system that allows users to upload, organize, preview, and delete files and folders - mimicking Google Drive's core features.  
**Target Users:** Users who need a simple, browser-based file organizer without backend storage.

---

## 2. UI/UX Specification

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER (60px)                                              │
│  Logo | Search Bar | User Avatar                            │
├──────────────┬──────────────────────────────────────────────┤
│  SIDEBAR     │  MAIN CONTENT                                │
│  (240px)    │                                              │
│              │  Toolbar: New | Upload | Sort | View Toggle   │
│  - My Drive  │  ─────────────────────────────────────────    │
│  - Folders  │  Breadcrumb: Home > Folder Name               │
│  - Recent   │  ─────────────────────────────────────────    │
│  - Trash    │  File/Folder Grid or List View               │
│              │                                              │
│              │                                              │
│              │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

### Responsive Breakpoints

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Desktop | ≥1024px | Sidebar + Full content |
| Tablet | 768-1023px | Collapsible sidebar |
| Mobile | <768px | Bottom nav, full-width content |

### Visual Design

#### Color Palette

| Role | Color | Hex |
|------|-------|-----|
| Primary | Blue | `#1a73e8` |
| Primary Dark | Dark Blue | `#1557b0` |
| Secondary | Gray | `#5f6368` |
| Background | White | `#ffffff` |
| Surface | Light Gray | `#f8f9fa` |
| Border | Silver | `#dadce0` |
| Text Primary | Dark Gray | `#202124` |
| Text Secondary | Medium Gray | `#5f6368` |
| Success | Green | `#34a853` |
| Warning | Yellow | `#fbbc04` |
| Error | Red | `#ea4335` |
| Hover | Light Blue | `#e8f0fe` |

#### Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Logo | Product Sans, sans-serif | 22px | 400 |
| Headings | Google Sans, sans-serif | 18-24px | 500 |
| Body | Roboto, sans-serif | 14px | 400 |
| Caption | Roboto, sans-serif | 12px | 400 |
| Button | Roboto, sans-serif | 14px | 500 |

#### Spacing System

- Base unit: 8px
- Padding small: 8px
- Padding medium: 16px
- Padding large: 24px
- Gap between items: 12px
- Border radius: 8px

#### Visual Effects

- Card shadow: `0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)`
- Hover shadow: `0 1px 3px 0 rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15)`
- Transition: `150ms ease-in-out`
- Selection background: `#c2e7ff`

### Components

#### Header
- Logo (left-aligned)
- Search bar (center, 400px max-width)
- User avatar (right-aligned, 32px circle)

#### Sidebar
- Navigation items with icons
- Active state: Blue background (`#e8f0fe`), blue text
- Hover state: Light gray background
- Storage usage indicator at bottom

#### Toolbar
- "New Folder" button (primary)
- "Upload" button (secondary)
- Sort dropdown
- View toggle (grid/list icons)

#### File/Folder Card (Grid View)
- 160px × 140px
- File type icon (48px)
- File name (truncated with ellipsis)
- File size / modified date
- Hover: Shows action buttons (Download, Delete, Share)

#### File/Folder Row (List View)
- Icon (24px)
- Name (flex-grow)
- Size (100px)
- Modified date (150px)
- Actions menu

#### Context Menu
- Open
- Download
- Rename
- Move to...
- Delete
- Properties

#### Modals
- New Folder dialog
- Upload progress
- Delete confirmation
- File preview (images, PDFs, text)

---

## 3. Functionality Specification

### Core Features

#### 3.1 File Upload
- Drag & drop zone in main content area
- Click to upload button
- Multiple file selection
- Upload progress indicator
- File type detection (icons)
- Maximum file size: 10MB per file (browser storage limit)

#### 3.2 Folder Management
- Create new folders
- Nested folder structure (unlimited depth)
- Navigate breadcrumbs
- Folder icons

#### 3.3 File Organization
- Move files/folders into folders
- Drag & drop to move
- Multi-select files (checkbox)
- Bulk delete

#### 3.4 Search
- Real-time search by filename
- Search current folder only
- Clear search results

#### 3.5 File Preview
- Images: JPG, PNG, GIF (inline preview)
- Text files: Plain text preview
- PDFs: Embedded viewer (if supported)
- Other: Show file info

#### 3.6 File Actions
- Download (downloads to local machine)
- Rename
- Delete (moves to trash)
- Move to folder

#### 3.7 Trash
- View deleted files
- Restore from trash
- Empty trash (permanent delete)

#### 3.8 View Options
- Grid view (default)
- List view
- Sort by name/date/size

### User Interactions

| Action | Trigger | Result |
|--------|---------|--------|
| Upload files | Drag drop / click button | Files added to current folder |
| Create folder | Click "New Folder" | New folder modal |
| Open folder | Double-click folder | Navigate into folder |
| Navigate back | Click breadcrumb | Go to parent folder |
| Select file | Single-click | Highlight + show actions |
| Multi-select | Ctrl+click | Add to selection |
| Preview file | Double-click file | Open preview modal |
| Delete | Click delete / press Delete key | Move to trash |
| Download | Click download | Download to device |
| Search | Type in search bar | Filter visible files |

### Data Handling

#### Storage: IndexedDB
- Database: `driveclone-db`
- Object stores:
  - `files` - File metadata and blobs
  - `folders` - Folder structure
  - `trash` - Deleted items

#### Data Schema

```javascript
// File object
{
  id: string,           // UUID
  name: string,         // File name
  type: string,         // MIME type
  size: number,        // Size in bytes
  blob: Blob,           // File content
  folderId: string,     // Parent folder ID (null = root)
  createdAt: timestamp,
  modifiedAt: timestamp,
  isDeleted: boolean   // In trash
}

// Folder object
{
  id: string,           // UUID
  name: string,         // Folder name
  parentId: string,     // Parent folder ID (null = root)
  createdAt: timestamp,
  isDeleted: boolean   // In trash
}
```

### Edge Cases

| Scenario | Handling |
|----------|----------|
| Duplicate filename | Append "(1)", "(2)", etc. |
| Empty name | Show validation error |
| File too large | Show size limit warning |
| Storage full | Show storage full message |
| Invalid file type | Allow anyway (generic icon) |
| Empty folder | Show "No files" message |
| Long filename | Truncate with ellipsis |

---

## 4. Acceptance Criteria

### Functional Criteria

- [ ] Can create new folders
- [ ] Can upload files via drag & drop
- [ ] Can upload files via button click
- [ ] Can navigate into folders
- [ ] Can navigate via breadcrumbs
- [ ] Can preview images inline
- [ ] Can preview text files
- [ ] Can download files
- [ ] Can rename files and folders
- [ ] Can delete files (to trash)
- [ ] Can move files between folders
- [ ] Can restore from trash
- [ ] Can empty trash
- [ ] Can search files by name
- [ ] Can toggle grid/list view
- [ ] Can sort files
- [ ] Data persists after refresh

### Visual Criteria

- [ ] Matches Google Drive color scheme
- [ ] Clean, modern appearance
- [ ] Smooth hover transitions
- [ ] Responsive to mobile/tablet
- [ ] Icons render correctly
- [ ] Loading states visible

### Performance Criteria

- [ ] Page loads in <2 seconds
- [ ] File operations complete quickly
- [ ] No UI freezing on large files
- [ ] Smooth scrolling

---

## 5. Technical Stack

- **Framework:** React 18 (Vite)
- **Styling:** CSS Modules + CSS Variables
- **Storage:** IndexedDB (via idb library)
- **Icons:** Lucide React
- **Build:** Vite

---

## 6. File Structure

```
driveclone/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   ├── components/
│   │   ├── Header/
│   │   ├── Sidebar/
│   │   ├── Toolbar/
│   │   ├── FileList/
│   │   ├── FileItem/
│   │   ├── Breadcrumb/
│   │   ├── Modal/
│   │   └── Preview/
│   ├── hooks/
│   │   ├── useFiles.js
│   │   └── useFolders.js
│   ├── utils/
│   │   ├── db.js
│   │   └── helpers.js
│   └── assets/
└── public/
```