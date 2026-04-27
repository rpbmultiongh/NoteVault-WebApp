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
    let currentFolderId = null;  // Current folder being viewed
    let folderPath = [];  // Breadcrumb path
    let saveTimeout = null;
    let searchResults = [];  // Store search results for export

    // DOM Elements
    const elements = {
        sidebar: document.getElementById('sidebar'),
        folderTree: document.getElementById('folderTree'),
        noteList: document.getElementById('noteList'),
        searchInput: document.getElementById('searchInput'),
        newNoteBtn: document.getElementById('newNoteBtn'),
        newFolderBtn: document.getElementById('newFolderBtn'),
        graphViewBtn: document.getElementById('graphViewBtn'),
        exportBtn: document.getElementById('exportBtn'),
        settingsBtn: document.getElementById('settingsBtn'),
        
        editorPanel: document.getElementById('editorPanel'),
        noteTitle: document.getElementById('noteTitle'),
        noteEditor: document.getElementById('noteEditor'),
        previewPane: document.getElementById('previewPane'),
        editorPane: document.getElementById('editorPane'),
        notePreview: document.getElementById('notePreview'),
        viewToggle: document.getElementById('viewToggle'),
        saveStatus: document.getElementById('saveStatus'),
        wordCount: document.getElementById('wordCount'),
        
        contextPanel: document.getElementById('contextPanel'),
        backlinksList: document.getElementById('backlinksList'),
        outgoingLinksList: document.getElementById('outgoingLinksList'),
        tagsList: document.getElementById('tagsList'),
        
        graphModal: document.getElementById('graphModal'),
        graphContainer: document.getElementById('graphContainer'),
        closeGraphBtn: document.getElementById('closeGraphBtn'),
        
        exportModal: document.getElementById('exportModal'),
        closeExportBtn: document.getElementById('closeExportBtn'),
        exportCurrentMd: document.getElementById('exportCurrentMd'),
        exportCurrentJson: document.getElementById('exportCurrentJson'),
        exportAllMd: document.getElementById('exportAllMd'),
        exportAllJson: document.getElementById('exportAllJson'),
        
        settingsModal: document.getElementById('settingsModal'),
        closeSettingsBtn: document.getElementById('closeSettingsBtn'),
        viewModeSelect: document.getElementById('viewModeSelect'),
        fontSizeSlider: document.getElementById('fontSizeSlider'),
        fontSizeValue: document.getElementById('fontSizeValue'),
        
        deleteModal: document.getElementById('deleteModal'),
        closeDeleteBtn: document.getElementById('closeDeleteBtn'),
        cancelDeleteBtn: document.getElementById('cancelDeleteBtn'),
        confirmDeleteBtn: document.getElementById('confirmDeleteBtn')
    };

    // Initialize
    async function init() {
        await openDatabase();
        await loadData();
        renderNoteList();
        setupEventListeners();
        
        if (notes.length > 0) {
            selectNote(notes[0].id);
        } else {
            createNewNote();
        }
    }

    // Database Functions
    function openDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            
            request.onerror = () => reject(request.error);
            
            request.onsuccess = () => {
                db = request.result;
                resolve(db);
            };
            
            request.onupgradeneeded = (event) => {
                const database = event.target.result;
                
                if (!database.objectStoreNames.contains('notes')) {
                    const notesStore = database.createObjectStore('notes', { keyPath: 'id' });
                    notesStore.createIndex('title', 'title', { unique: false });
                    notesStore.createIndex('folderId', 'folderId', { unique: false });
                    notesStore.createIndex('modifiedAt', 'modifiedAt', { unique: false });
                }
                
                if (!database.objectStoreNames.contains('folders')) {
                    const foldersStore = database.createObjectStore('folders', { keyPath: 'id' });
                    foldersStore.createIndex('name', 'name', { unique: false });
                    foldersStore.createIndex('parentId', 'parentId', { unique: false });
                }
            };
        });
    }

    async function loadData() {
        notes = await getAllNotes();
        folders = await getAllFolders();
    }

    function getAllNotes() {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['notes'], 'readonly');
            const store = transaction.objectStore('notes');
            const request = store.getAll();
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    function getAllFolders() {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['folders'], 'readonly');
            const store = transaction.objectStore('folders');
            const request = store.getAll();
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    function saveNote(note) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['notes'], 'readwrite');
            const store = transaction.objectStore('notes');
            const request = store.put(note);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    function deleteNoteFromDB(id) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['notes'], 'readwrite');
            const store = transaction.objectStore('notes');
            const request = store.delete(id);
            
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    function saveFolder(folder) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['folders'], 'readwrite');
            const store = transaction.objectStore('folders');
            const request = store.put(folder);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    function deleteFolderFromDB(id) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['folders'], 'readwrite');
            const store = transaction.objectStore('folders');
            const request = store.delete(id);
            
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // Utility Functions
    function generateId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function formatDate(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
        
        return date.toLocaleDateString();
    }

    // Note Management
    async function createNewNote() {
        const note = {
            id: generateId(),
            title: 'Untitled Note',
            content: '',
            folderId: currentFolderId,  // Create in current folder
            createdAt: Date.now(),
            modifiedAt: Date.now()
        };
        
        await saveNote(note);
        notes.push(note);
        renderNoteList();
        selectNote(note.id);
    }

    async function selectNote(id) {
        currentNote = notes.find(n => n.id === id);
        
        if (!currentNote) return;
        
        elements.noteTitle.value = currentNote.title;
        elements.noteEditor.value = currentNote.content;
        
        updatePreview();
        updateWordCount();
        renderNoteList();
        updateContextPanel();
        
        elements.saveStatus.textContent = 'Saved';
    }

    async function saveCurrentNote() {
        if (!currentNote) return;
        
        elements.saveStatus.textContent = 'Saving...';
        elements.saveStatus.classList.add('saving');
        
        currentNote.title = elements.noteTitle.value || 'Untitled Note';
        currentNote.content = elements.noteEditor.value;
        currentNote.modifiedAt = Date.now();
        
        await saveNote(currentNote);
        
        elements.saveStatus.textContent = 'Saved';
        elements.saveStatus.classList.remove('saving');
        
        renderNoteList();
        updateContextPanel();
    }

    function scheduleSave() {
        if (saveTimeout) clearTimeout(saveTimeout);
        saveTimeout = setTimeout(saveCurrentNote, 1000);
    }

    async function deleteCurrentNote() {
        if (!currentNote) return;
        
        const id = currentNote.id;
        await deleteNoteFromDB(id);
        notes = notes.filter(n => n.id !== id);
        
        closeModal(elements.deleteModal);
        
        if (notes.length > 0) {
            selectNote(notes[0].id);
        } else {
            createNewNote();
        }
        
        renderNoteList();
    }

    // Folder Management
    async function createNewFolder() {
        const folder = {
            id: generateId(),
            name: 'New Folder',
            parentId: currentFolderId  // Create in current folder
        };
        
        await saveFolder(folder);
        folders.push(folder);
        renderFolderTree();
    }

    async function renameFolder(folderId, newName) {
        const folder = folders.find(f => f.id === folderId);
        if (!folder || !newName.trim()) return;
        
        folder.name = newName.trim();
        await saveFolder(folder);
        renderFolderTree();
        renderBreadcrumb();
    }

    async function deleteFolder(folderId) {
        // Delete all notes in this folder first
        const folderNotes = notes.filter(n => n.folderId === folderId);
        for (const note of folderNotes) {
            await deleteNoteFromDB(note.id);
        }
        notes = notes.filter(n => n.folderId !== folderId);
        
        // Delete child folders recursively
        const childFolders = folders.filter(f => f.parentId === folderId);
        for (const child of childFolders) {
            await deleteFolder(child.id);
        }
        
        // Delete the folder itself
        await deleteFolderFromDB(folderId);
        folders = folders.filter(f => f.id !== folderId);
        
        // Navigate to parent if we're in the deleted folder
        if (currentFolderId === folderId) {
            navigateToRoot();
        }
        
        renderFolderTree();
        renderNoteList();
    }

    async function moveNoteToFolder(noteId, targetFolderId) {
        const note = notes.find(n => n.id === noteId);
        if (!note) return;
        
        note.folderId = targetFolderId;
        note.modifiedAt = Date.now();
        await saveNote(note);
        renderNoteList();
    }

    async function moveFolderToFolder(folderId, targetParentId) {
        // Prevent moving folder to itself or its descendants
        if (folderId === targetParentId) return;
        if (isDescendantOf(folderId, targetParentId)) return;
        
        const folder = folders.find(f => f.id === folderId);
        if (!folder) return;
        
        folder.parentId = targetParentId;
        await saveFolder(folder);
        renderFolderTree();
    }

    function isDescendantOf(folderId, potentialAncestorId) {
        let current = folders.find(f => f.id === folderId);
        while (current) {
            if (current.parentId === potentialAncestorId) return true;
            current = folders.find(f => f.id === current.parentId);
        }
        return false;
    }

    // Rendering
    function renderNoteList(filter = '') {
        // Filter by current folder if one is selected
        let filteredNotes = currentFolderId 
            ? notes.filter(n => n.folderId === currentFolderId)
            : notes.filter(n => !n.folderId);  // Root notes when no folder selected
        
        // Apply search filter if provided
        if (filter) {
            filteredNotes = filteredNotes.filter(n => 
                n.title.toLowerCase().includes(filter.toLowerCase()) ||
                n.content.toLowerCase().includes(filter.toLowerCase())
            );
        }
        
        const sortedNotes = [...filteredNotes].sort((a, b) => a.title.localeCompare(b.title));
        
        elements.noteList.innerHTML = sortedNotes.map(note => `
            <div class="note-item ${currentNote && currentNote.id === note.id ? 'active' : ''}" 
                 data-id="${note.id}">
                <div class="note-item-title">${escapeHtml(note.title)}</div>
                <div class="note-item-meta">${formatDate(note.modifiedAt)}</div>
                <button class="note-menu-btn" data-id="${note.id}">⋮</button>
                <div class="note-context-menu" data-note="${note.id}">
                    <div class="context-menu-item" data-action="move" data-note="${note.id}">📂 Move to...</div>
                    <div class="context-menu-item" data-action="export" data-note="${note.id}">📥 Export</div>
                    <div class="context-menu-divider"></div>
                    <div class="context-menu-item danger" data-action="delete" data-note="${note.id}">🗑️ Delete</div>
                </div>
            </div>
        `).join('');
    }

    function renderFolderTree() {
        const rootFolders = folders.filter(f => !f.parentId);
        
        elements.folderTree.innerHTML = renderFolderItems(rootFolders);
    }

    function renderFolderItems(folderList, level = 0) {
        return folderList.map(folder => {
            const children = folders.filter(f => f.parentId === folder.id);
            const hasChildren = children.length > 0;
            const notesInFolder = notes.filter(n => n.folderId === folder.id).length;
            
            return `
                <div class="folder-item" data-id="${folder.id}" style="padding-left: ${level * 12}px">
                    <span class="folder-toggle">${hasChildren ? '▶' : ''}</span>
                    <span class="folder-icon">📁</span>
                    <span class="folder-name">${escapeHtml(folder.name)}</span>
                    <span class="folder-count">${notesInFolder}</span>
                    <button class="folder-menu-btn" data-id="${folder.id}">⋮</button>
                    <div class="folder-context-menu" data-folder="${folder.id}">
                        <div class="context-menu-item" data-action="rename" data-folder="${folder.id}">✏️ Rename</div>
                        <div class="context-menu-item" data-action="move" data-folder="${folder.id}">📂 Move to...</div>
                        <div class="context-menu-divider"></div>
                        <div class="context-menu-item danger" data-action="delete" data-folder="${folder.id}">🗑️ Delete</div>
                    </div>
                </div>
                ${hasChildren ? `<div class="folder-children">${renderFolderItems(children, level + 1)}</div>` : ''}
            `;
        }).join('');
    }

    // Folder Navigation
    function navigateToFolder(folderId) {
        currentFolderId = folderId;
        
        // Update breadcrumb path
        if (folderId) {
            const folder = folders.find(f => f.id === folderId);
            if (folder) {
                // Build path to this folder
                folderPath = [];
                let current = folder;
                while (current) {
                    folderPath.unshift(current);
                    current = folders.find(f => f.id === current.parentId);
                }
            }
        } else {
            folderPath = [];
        }
        
        renderBreadcrumb();
        renderNoteList();
    }

    function navigateToRoot() {
        navigateToFolder(null);
    }

    function navigateToBreadcrumb(index) {
        if (index < 0) {
            navigateToRoot();
        } else if (index < folderPath.length) {
            navigateToFolder(folderPath[index].id);
        }
    }

    function renderBreadcrumb() {
        // Create breadcrumb element if it doesn't exist
        let breadcrumb = document.getElementById('breadcrumb');
        if (!breadcrumb) {
            breadcrumb = document.createElement('div');
            breadcrumb.id = 'breadcrumb';
            breadcrumb.className = 'breadcrumb';
            elements.folderTree.parentNode.insertBefore(breadcrumb, elements.folderTree);
        }
        
        let html = `<span class="breadcrumb-item" data-index="-1">All Notes</span>`;
        
        folderPath.forEach((folder, index) => {
            html += ` <span class="breadcrumb-sep">/</span> <span class="breadcrumb-item" data-index="${index}">${escapeHtml(folder.name)}</span>`;
        });
        
        breadcrumb.innerHTML = html;
    }

    function updatePreview() {
        const content = elements.noteEditor.value;
        let html = marked.parse(content);
        
        // Process internal links [[Note Name]]
        html = html.replace(/\[\[([^\]]+)\]\]/g, (match, noteName) => {
            const linkedNote = notes.find(n => n.title.toLowerCase() === noteName.toLowerCase());
            if (linkedNote) {
                return `<span class="internal-link" data-note-id="${linkedNote.id}">${escapeHtml(noteName)}</span>`;
            }
            return `<span class="broken-link">${escapeHtml(noteName)}</span>`;
        });
        
        // Process tags #tag
        html = html.replace(/#([a-zA-Z0-9_-]+)/g, '<span class="tag" data-tag="$1">#$1</span>');
        
        elements.notePreview.innerHTML = html;
        
        // Add click handlers for internal links
        elements.notePreview.querySelectorAll('.internal-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const noteId = e.target.dataset.noteId;
                if (noteId) selectNote(noteId);
            });
        });
        
        // Add click handlers for tags
        elements.notePreview.querySelectorAll('.tag').forEach(tag => {
            tag.addEventListener('click', (e) => {
                const tagName = e.target.dataset.tag;
                elements.searchInput.value = `#${tagName}`;
                filterByTag(tagName);
            });
        });
    }

    function updateWordCount() {
        const content = elements.noteEditor.value;
        const words = content.trim() ? content.trim().split(/\s+/).length : 0;
        elements.wordCount.textContent = `${words} words`;
    }

    function updateContextPanel() {
        if (!currentNote) return;
        
        // Backlinks
        const backlinks = notes.filter(n => 
            n.id !== currentNote.id && 
            n.content.includes(`[[${currentNote.title}]]`)
        );
        
        elements.backlinksList.innerHTML = backlinks.length > 0 
            ? backlinks.map(note => `
                <div class="backlink-item" data-id="${note.id}">${escapeHtml(note.title)}</div>
            `).join('')
            : '<p class="empty-message">No backlinks yet</p>';
        
        // Outgoing links
        const outgoingLinks = [];
        const linkRegex = /\[\[([^\]]+)\]\]/g;
        let match;
        
        while ((match = linkRegex.exec(currentNote.content)) !== null) {
            const noteName = match[1];
            const linkedNote = notes.find(n => n.title.toLowerCase() === noteName.toLowerCase());
            if (linkedNote && linkedNote.id !== currentNote.id) {
                outgoingLinks.push(linkedNote);
            }
        }
        
        elements.outgoingLinksList.innerHTML = outgoingLinks.length > 0
            ? [...new Map(outgoingLinks.map(n => [n.id, n])).values()].map(note => `
                <div class="outgoing-link-item" data-id="${note.id}">${escapeHtml(note.title)}</div>
            `).join('')
            : '<p class="empty-message">No outgoing links</p>';
        
        // Tags
        const tagRegex = /#([a-zA-Z0-9_-]+)/g;
        const tags = new Set();
        
        while ((match = tagRegex.exec(currentNote.content)) !== null) {
            tags.add(match[1]);
        }
        
        elements.tagsList.innerHTML = tags.size > 0
            ? [...tags].map(tag => `
                <span class="tag-item" data-tag="${tag}">#${escapeHtml(tag)}</span>
            `).join('')
            : '<p class="empty-message">No tags</p>';
    }

    function filterByTag(tagName) {
        elements.noteList.innerHTML = '';
        
        const filteredNotes = notes.filter(n => 
            n.content.includes(`#${tagName}`)
        );
        
        searchResults = filteredNotes;
        showSearchIndicator(`Tag: #${tagName} (${filteredNotes.length} results)`);
        
        elements.noteList.innerHTML = filteredNotes.map(note => `
            <div class="note-item ${currentNote && currentNote.id === note.id ? 'active' : ''}" 
                 data-id="${note.id}">
                <div class="note-item-title">${escapeHtml(note.title)}</div>
                <div class="note-item-meta">${formatDate(note.modifiedAt)}</div>
            </div>
        `).join('');
    }

    function performSearch(query) {
        // AND search - split by spaces, all words must match
        const searchWords = query.toLowerCase().split(/\s+/).filter(w => w.trim());
        
        if (searchWords.length === 0) {
            searchResults = [];
            hideSearchIndicator();
            renderNoteList();
            return;
        }
        
        // Search in title AND content
        searchResults = notes.filter(note => {
            const searchText = (note.title + ' ' + note.content).toLowerCase();
            return searchWords.every(word => searchText.includes(word));
        });
        
        showSearchIndicator(`Search: "${query}" (${searchResults.length} results) - Press Shift+Enter to export`);
        
        elements.noteList.innerHTML = searchResults.map(note => `
            <div class="note-item ${currentNote && currentNote.id === note.id ? 'active' : ''}" 
                 data-id="${note.id}">
                <div class="note-item-title">${escapeHtml(note.title)}</div>
                <div class="note-item-meta">${formatDate(note.modifiedAt)}</div>
            </div>
        `).join('');
    }

    function showSearchIndicator(message) {
        let indicator = document.getElementById('searchIndicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'searchIndicator';
            indicator.className = 'search-indicator';
            elements.noteList.parentNode.insertBefore(indicator, elements.noteList);
        }
        indicator.textContent = message;
        indicator.style.display = 'block';
    }

    function hideSearchIndicator() {
        const indicator = document.getElementById('searchIndicator');
        if (indicator) indicator.style.display = 'none';
    }

    async function exportSearchResults() {
        if (searchResults.length === 0) {
            showToast('No results to export');
            return;
        }
        
        const zip = new JSZip();
        
        searchResults.forEach(note => {
            const fileName = sanitizeFileName(note.title) + '.md';
            zip.file(fileName, `# ${note.title}\n\n${note.content}`);
        });
        
        const content = await zip.generateAsync({ type: 'blob' });
        downloadBlob(content, 'search-results.zip');
        showToast(`Exported ${searchResults.length} notes`);
    }

    // Graph View
    function renderGraph() {
        elements.graphContainer.innerHTML = '';
        
        const width = elements.graphContainer.clientWidth;
        const height = elements.graphContainer.clientHeight;
        
        // Build graph data
        const nodes = notes.map(note => ({
            id: note.id,
            title: note.title,
            connections: 0
        }));
        
        const links = [];
        
        notes.forEach(note => {
            const linkRegex = /\[\[([^\]]+)\]\]/g;
            let match;
            
            while ((match = linkRegex.exec(note.content)) !== null) {
                const noteName = match[1];
                const targetNote = notes.find(n => n.title.toLowerCase() === noteName.toLowerCase());
                
                if (targetNote) {
                    links.push({ source: note.id, target: targetNote.id });
                    const sourceNode = nodes.find(n => n.id === note.id);
                    const targetNode = nodes.find(n => n.id === targetNote.id);
                    if (sourceNode) sourceNode.connections++;
                    if (targetNode) targetNode.connections++;
                }
            }
        });
        
        if (nodes.length === 0) {
            elements.graphContainer.innerHTML = '<p class="empty-message">No notes to display</p>';
            return;
        }
        
        const svg = d3.select(elements.graphContainer)
            .append('svg')
            .attr('width', width)
            .attr('height', height);
        
        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id(d => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(-200))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(30));
        
        const link = svg.append('g')
            .selectAll('line')
            .data(links)
            .enter()
            .append('line')
            .attr('class', 'graph-link')
            .attr('stroke-width', 1.5);
        
        const node = svg.append('g')
            .selectAll('g')
            .data(nodes)
            .enter()
            .append('g')
            .attr('class', 'graph-node')
            .call(d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended));
        
        node.append('circle')
            .attr('r', d => Math.min(10 + d.connections * 3, 25));
        
        node.append('text')
            .text(d => d.title.substring(0, 15))
            .attr('x', 0)
            .attr('y', 20)
            .attr('text-anchor', 'middle');
        
        node.on('click', (event, d) => {
            selectNote(d.id);
            closeModal(elements.graphModal);
        });
        
        simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);
            
            node.attr('transform', d => `translate(${d.x},${d.y})`);
        });
        
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }
        
        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }
        
        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }
    }

    // Export Functions
    function exportCurrentAsMarkdown() {
        if (!currentNote) return;
        
        const blob = new Blob([currentNote.content], { type: 'text/markdown' });
        downloadBlob(blob, `${currentNote.title}.md`);
        closeModal(elements.exportModal);
    }

    function exportCurrentAsJSON() {
        if (!currentNote) return;
        
        const json = JSON.stringify(currentNote, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        downloadBlob(blob, `${currentNote.title}.json`);
        closeModal(elements.exportModal);
    }

    async function exportAllAsMarkdown() {
        if (notes.length === 0) return;
        
        const zip = new JSZip();
        
        // Organize notes by folder
        const rootNotes = notes.filter(n => !n.folderId);
        const folderNotesMap = {};
        
        notes.forEach(note => {
            if (note.folderId) {
                if (!folderNotesMap[note.folderId]) {
                    folderNotesMap[note.folderId] = [];
                }
                folderNotesMap[note.folderId].push(note);
            }
        });
        
        // Add root notes
        rootNotes.forEach(note => {
            const fileName = sanitizeFileName(note.title) + '.md';
            zip.file(fileName, `# ${note.title}\n\n${note.content}`);
        });
        
        // Add foldered notes
        folders.forEach(folder => {
            if (folderNotesMap[folder.id]) {
                const folderName = sanitizeFileName(folder.name);
                const folderZip = zip.folder(folderName);
                
                folderNotesMap[folder.id].forEach(note => {
                    const fileName = sanitizeFileName(note.title) + '.md';
                    folderZip.file(fileName, `# ${note.title}\n\n${note.content}`);
                });
            }
        });
        
        // Generate and download ZIP
        const content = await zip.generateAsync({ type: 'blob' });
        downloadBlob(content, 'notevault-export.zip');
        closeModal(elements.exportModal);
    }

    function exportAllAsJSON() {
        const json = JSON.stringify({ notes, folders }, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        downloadBlob(blob, 'notevault-backup.json');
        closeModal(elements.exportModal);
    }

    function downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function sanitizeFileName(name) {
        return name.replace(/[<>:"/\\|?*]/g, '-').replace(/\s+/g, '_').substring(0, 100);
    }

    // Import Functions
    function showImportModal() {
        // Add import UI if not exists
        let importSection = document.getElementById('importSection');
        if (!importSection) {
            importSection = document.createElement('div');
            importSection.id = 'importSection';
            importSection.innerHTML = `
                <div class="import-section">
                    <h3>Import</h3>
                    <input type="file" id="importFile" accept=".md,.json,.zip" multiple>
                    <button id="importBtn" class="btn btn-primary">Import</button>
                </div>
            `;
            elements.exportModal.querySelector('.modal-body').appendChild(importSection);
        }
    }

    async function importFromJSON(jsonContent) {
        try {
            const data = JSON.parse(jsonContent);
            
            // Import notes
            if (data.notes && Array.isArray(data.notes)) {
                for (const note of data.notes) {
                    note.id = generateId(); // New IDs to avoid conflicts
                    note.createdAt = Date.now();
                    note.modifiedAt = Date.now();
                    await saveNote(note);
                    notes.push(note);
                }
            }
            
            // Import folders
            if (data.folders && Array.isArray(data.folders)) {
                for (const folder of data.folders) {
                    folder.id = generateId(); // New IDs
                    await saveFolder(folder);
                    folders.push(folder);
                }
            }
            
            renderNoteList();
            renderFolderTree();
            showToast('Import successful!');
        } catch (e) {
            console.error('Import error:', e);
            showToast('Import failed: ' + e.message);
        }
    }

    async function importFromMarkdown(content) {
        // Parse multiple notes from markdown (separated by ---)
        const parts = content.split(/^---$/m);
        
        for (const part of parts) {
            const trimmed = part.trim();
            if (!trimmed) continue;
            
            // Extract title from first line (# Title)
            const lines = trimmed.split('\n');
            let title = 'Imported Note';
            let noteContent = trimmed;
            
            if (lines[0].startsWith('# ')) {
                title = lines[0].substring(2).trim();
                noteContent = lines.slice(1).join('\n').trim();
            }
            
            const note = {
                id: generateId(),
                title: title,
                content: noteContent,
                folderId: null,
                createdAt: Date.now(),
                modifiedAt: Date.now()
            };
            
            await saveNote(note);
            notes.push(note);
        }
        
        renderNoteList();
        showToast('Import successful!');
    }

    async function importFromZIP(file) {
        try {
            const zip = await JSZip.loadAsync(file);
            
            const promises = [];
            
            zip.forEach((relativePath, file) => {
                if (file.dir) return; // Skip directories
                
                const promise = file.async('string').then(async content => {
                    const pathParts = relativePath.split('/');
                    const fileName = pathParts[pathParts.length - 1];
                    
                    // Skip non-markdown files
                    if (!fileName.endsWith('.md')) return;
                    
                    // Determine folder structure
                    let folderId = null;
                    if (pathParts.length > 1) {
                        // Create folders as needed
                        let parentId = null;
                        for (let i = 0; i < pathParts.length - 1; i++) {
                            const folderName = pathParts[i];
                            let folder = folders.find(f => f.name === folderName && f.parentId === parentId);
                            
                            if (!folder) {
                                folder = {
                                    id: generateId(),
                                    name: folderName,
                                    parentId: parentId
                                };
                                await saveFolder(folder);
                                folders.push(folder);
                            }
                            parentId = folder.id;
                            if (i === pathParts.length - 2) {
                                folderId = folder.id;
                            }
                        }
                    }
                    
                    // Parse markdown
                    const lines = content.split('\n');
                    let title = fileName.replace('.md', '');
                    let noteContent = content;
                    
                    if (lines[0] && lines[0].startsWith('# ')) {
                        title = lines[0].substring(2).trim();
                        noteContent = lines.slice(1).join('\n').trim();
                    }
                    
                    // Save note
                    const note = {
                        id: generateId(),
                        title: title,
                        content: noteContent,
                        folderId: folderId,
                        createdAt: Date.now(),
                        modifiedAt: Date.now()
                    };
                    
                    await saveNote(note);
                    notes.push(note);
                });
                
                promises.push(promise);
            });
            
            await Promise.all(promises);
            
            renderNoteList();
            renderFolderTree();
            showToast('Import successful!');
        } catch (e) {
            console.error('ZIP import error:', e);
            showToast('Import failed: ' + e.message);
        }
    }

    // Folder context menu functions
    function handleFolderRename(folderId) {
        const folder = folders.find(f => f.id === folderId);
        if (!folder) return;
        
        const newName = prompt('Enter new folder name:', folder.name);
        if (newName && newName.trim() && newName !== folder.name) {
            renameFolder(folderId, newName.trim());
            showToast('Folder renamed');
        }
    }

    function handleFolderDelete(folderId) {
        const folder = folders.find(f => f.id === folderId);
        if (!folder) return;
        
        const noteCount = notes.filter(n => n.folderId === folderId).length;
        const childCount = folders.filter(f => f.parentId === folderId).length;
        
        let message = `Delete "${folder.name}"?`;
        if (noteCount > 0 || childCount > 0) {
            message += `\n\nThis will also delete ${noteCount} note(s) and ${childCount} subfolder(s).`;
        }
        
        if (confirm(message)) {
            deleteFolder(folderId);
            showToast('Folder deleted');
        }
    }

    function showMoveFolderDialog(folderId) {
        const folder = folders.find(f => f.id === folderId);
        if (!folder) return;
        
        // Build folder options
        let options = '<option value="">Root (No Parent)</option>';
        
        folders.filter(f => f.id !== folderId && !isDescendantOf(f.id, folderId)).forEach(f => {
            options += `<option value="${f.id}">${f.name}</option>`;
        });
        
        const targetId = prompt(`Move "${folder.name}" to:\n${options.replace(/<option value="/g, '<option value="')}`);
        
        if (targetId !== null) {
            moveFolderToFolder(folderId, targetId || null);
            showToast('Folder moved');
        }
    }

    function showMoveNoteDialog(noteId) {
        const note = notes.find(n => n.id === noteId);
        if (!note) return;
        
        // Build folder options (including root)
        let options = '<option value="">Root</option>';
        
        folders.forEach(f => {
            options += `<option value="${f.id}">${f.name}</option>`;
        });
        
        const targetId = prompt(`Move "${note.title}" to:\n${options.replace(/<option value="/g, '<option value="')}`);
        
        if (targetId !== null) {
            moveNoteToFolder(noteId, targetId || null);
            renderNoteList();
            showToast('Note moved to ' + (targetId ? folders.find(f => f.id === targetId)?.name || 'folder' : 'root'));
        }
    }

    function exportSingleNote(noteId) {
        const note = notes.find(n => n.id === noteId);
        if (!note) return;
        
        const blob = new Blob([note.content], { type: 'text/markdown' });
        downloadBlob(blob, `${note.title}.md`);
        showToast('Note exported');
    }

    // Note context menu (for moving)
    function renderNoteListWithContext() {
        // Render notes with right-click context menu
        let noteList = searchResults.length > 0 ? searchResults : 
            (currentFolderId ? notes.filter(n => n.folderId === currentFolderId) : notes.filter(n => !n.folderId));
        
        const sortedNotes = [...noteList].sort((a, b) => a.title.localeCompare(b.title));
        
        elements.noteList.innerHTML = sortedNotes.map(note => `
            <div class="note-item ${currentNote && currentNote.id === note.id ? 'active' : ''}" 
                 data-id="${note.id}">
                <div class="note-item-title">${escapeHtml(note.title)}</div>
                <div class="note-item-meta">${formatDate(note.modifiedAt)}</div>
                <button class="note-menu-btn" data-id="${note.id}">⋮</button>
                <div class="note-context-menu" data-note="${note.id}">
                    <div class="context-menu-item" data-action="move" data-note="${note.id}">📂 Move to...</div>
                    <div class="context-menu-item" data-action="export" data-note="${note.id}">📥 Export</div>
                    <div class="context-menu-divider"></div>
                    <div class="context-menu-item danger" data-action="delete" data-note="${note.id}">🗑️ Delete</div>
                </div>
            </div>
        `).join('');
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // Modal Functions
    function openModal(modal) {
        modal.classList.remove('hidden');
    }

    function closeModal(modal) {
        modal.classList.add('hidden');
    }

    // Editor Toolbar Actions
    function handleToolbarAction(action) {
        const editor = elements.noteEditor;
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const text = editor.value;
        const selected = text.substring(start, end);
        
        let replacement = '';
        let cursorOffset = 0;
        
        switch(action) {
            case 'bold':
                replacement = `**${selected || 'bold text'}**`;
                cursorOffset = selected ? 0 : -2;
                break;
            case 'italic':
                replacement = `*${selected || 'italic text'}*`;
                cursorOffset = selected ? 0 : -1;
                break;
            case 'heading':
                replacement = `## ${selected || 'Heading'}`;
                break;
            case 'link':
                replacement = `[[${selected || 'note name'}]]`;
                break;
            case 'code':
                replacement = selected.includes('\n') 
                    ? `\`\`\`\n${selected}\n\`\`\`` 
                    : `\`${selected || 'code'}\``;
                break;
            case 'list':
                replacement = `- ${selected || 'list item'}`;
                break;
            case 'quote':
                replacement = `> ${selected || 'quote'}`;
                break;
        }
        
        editor.value = text.substring(0, start) + replacement + text.substring(end);
        editor.focus();
        
        const newPos = start + replacement.length + cursorOffset;
        editor.setSelectionRange(newPos, newPos);
        
        scheduleSave();
        updatePreview();
        updateWordCount();
    }

    function toggleView() {
        const viewMode = elements.viewModeSelect.value;
        
        if (viewMode === 'edit') {
            elements.editorPane.classList.remove('hidden');
            elements.previewPane.classList.add('hidden');
        } else if (viewMode === 'preview') {
            elements.editorPane.classList.add('hidden');
            elements.previewPane.classList.remove('hidden');
        } else {
            elements.editorPane.classList.remove('hidden');
            elements.previewPane.classList.remove('hidden');
        }
    }

    // Event Listeners
    function setupEventListeners() {
        // Note actions
        elements.newNoteBtn.addEventListener('click', createNewNote);
        elements.newFolderBtn.addEventListener('click', createNewFolder);
        elements.graphViewBtn.addEventListener('click', () => {
            renderGraph();
            openModal(elements.graphModal);
        });
        elements.exportBtn.addEventListener('click', () => openModal(elements.exportModal));
        elements.settingsBtn.addEventListener('click', () => openModal(elements.settingsModal));
        
        // Editor
        elements.noteTitle.addEventListener('input', scheduleSave);
        elements.noteEditor.addEventListener('input', () => {
            scheduleSave();
            updatePreview();
            updateWordCount();
        });
        
        // Toolbar
        document.querySelectorAll('.toolbar-btn[data-action]').forEach(btn => {
            btn.addEventListener('click', () => handleToolbarAction(btn.dataset.action));
        });
        
        elements.viewToggle.addEventListener('click', toggleView);
        
        // Folder tree click - navigate to folder
        elements.folderTree.addEventListener('click', (e) => {
            const folderItem = e.target.closest('.folder-item');
            const menuItem = e.target.closest('.context-menu-item');
            
            if (menuItem) {
                e.stopPropagation();
                const action = menuItem.dataset.action;
                const folderId = menuItem.dataset.folder;
                
                if (action === 'rename') {
                    handleFolderRename(folderId);
                } else if (action === 'move') {
                    showMoveFolderDialog(folderId);
                } else if (action === 'delete') {
                    handleFolderDelete(folderId);
                }
                
                // Close menu
                document.querySelectorAll('.folder-context-menu').forEach(m => m.classList.remove('active'));
                return;
            }
            
            if (folderItem && !e.target.closest('.folder-context-menu')) {
                const folderId = folderItem.dataset.id;
                navigateToFolder(folderId);
            }
            
            // Toggle context menu
            const menuBtn = e.target.closest('.folder-menu-btn');
            if (menuBtn) {
                e.stopPropagation();
                const folderId = menuBtn.dataset.id;
                
                // Close all menus first
                document.querySelectorAll('.folder-context-menu').forEach(m => m.classList.remove('active'));
                
                // Open this folder's menu
                const menu = document.querySelector(`.folder-context-menu[data-folder="${folderId}"]`);
                if (menu) menu.classList.add('active');
            }
        });

        // Close menus when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.folder-item')) {
                document.querySelectorAll('.folder-context-menu').forEach(m => m.classList.remove('active'));
            }
        });

        // Breadcrumb click
        document.addEventListener('click', (e) => {
            const breadcrumbItem = e.target.closest('.breadcrumb-item');
            if (breadcrumbItem) {
                navigateToBreadcrumb(parseInt(breadcrumbItem.dataset.index));
            }
        });

        // Note list click
        elements.noteList.addEventListener('click', (e) => {
            const menuItem = e.target.closest('.context-menu-item');
            
            if (menuItem) {
                e.stopPropagation();
                const action = menuItem.dataset.action;
                const noteId = menuItem.dataset.note;
                
                if (action === 'move') {
                    showMoveNoteDialog(noteId);
                } else if (action === 'export') {
                    exportSingleNote(noteId);
                } else if (action === 'delete') {
                    const note = notes.find(n => n.id === noteId);
                    if (note && confirm(`Delete "${note.title}"?`)) {
                        deleteNoteFromDB(noteId);
                        notes = notes.filter(n => n.id !== noteId);
                        if (currentNote && currentNote.id === noteId) {
                            currentNote = null;
                        }
                        renderNoteList();
                        showToast('Note deleted');
                    }
                }
                
                // Close menu
                document.querySelectorAll('.note-context-menu').forEach(m => m.classList.remove('active'));
                return;
            }
            
            const noteItem = e.target.closest('.note-item');
            
            // Toggle note menu
            const menuBtn = e.target.closest('.note-menu-btn');
            if (menuBtn) {
                e.stopPropagation();
                const noteId = menuBtn.dataset.id;
                
                document.querySelectorAll('.note-context-menu').forEach(m => m.classList.remove('active'));
                const menu = document.querySelector(`.note-context-menu[data-note="${noteId}"]`);
                if (menu) menu.classList.add('active');
                return;
            }
            
            if (noteItem) {
                selectNote(noteItem.dataset.id);
            }
        });

        // Close note menus when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.note-item') && !e.target.closest('.note-menu-btn')) {
                document.querySelectorAll('.note-context-menu').forEach(m => m.classList.remove('active'));
            }
        });
        
        // Backlinks click
        elements.backlinksList.addEventListener('click', (e) => {
            const item = e.target.closest('.backlink-item');
            if (item) selectNote(item.dataset.id);
        });
        
        // Outgoing links click
        elements.outgoingLinksList.addEventListener('click', (e) => {
            const item = e.target.closest('.outgoing-link-item');
            if (item) selectNote(item.dataset.id);
        });
        
        // Tags click
        elements.tagsList.addEventListener('click', (e) => {
            const item = e.target.closest('.tag-item');
            if (item) {
                elements.searchInput.value = `#${item.dataset.tag}`;
                filterByTag(item.dataset.tag);
            }
        });
        
        // Search
        elements.searchInput.addEventListener('input', (e) => {
            const value = e.target.value;
            if (value.startsWith('#')) {
                filterByTag(value.substring(1));
            } else if (value.trim()) {
                performSearch(value);
            } else {
                searchResults = [];
                renderNoteList();
            }
        });

        // Search with Enter for export
        elements.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.shiftKey) {
                e.preventDefault();
                exportSearchResults();
            }
        });
        
        // Keyboard shortcuts
        elements.noteEditor.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'b':
                        e.preventDefault();
                        handleToolbarAction('bold');
                        break;
                    case 'i':
                        e.preventDefault();
                        handleToolbarAction('italic');
                        break;
                    case 's':
                        e.preventDefault();
                        saveCurrentNote();
                        break;
                }
            }
        });
        
        // Graph modal
        elements.closeGraphBtn.addEventListener('click', () => closeModal(elements.graphModal));
        
        // Export modal
        elements.closeExportBtn.addEventListener('click', () => closeModal(elements.exportModal));
        elements.exportCurrentMd.addEventListener('click', exportCurrentAsMarkdown);
        elements.exportCurrentJson.addEventListener('click', exportCurrentAsJSON);
        elements.exportAllMd.addEventListener('click', exportAllAsMarkdown);
        elements.exportAllJson.addEventListener('click', exportAllAsJSON);
        
        // Import event listeners (new UI with separate inputs)
        const importSingleMd = document.getElementById('importSingleMd');
        const importZip = document.getElementById('importZip');
        const importJson = document.getElementById('importJson');
        const importBtn = document.getElementById('importBtn');
        
        if (importBtn) {
            importBtn.addEventListener('click', async () => {
                let imported = false;
                
                // Check each input
                if (importSingleMd && importSingleMd.files.length > 0) {
                    for (const file of importSingleMd.files) {
                        const content = await file.text();
                        await importFromMarkdown(content);
                        imported = true;
                    }
                    importSingleMd.value = '';
                }
                
                if (importZip && importZip.files.length > 0) {
                    for (const file of importZip.files) {
                        await importFromZIP(file);
                        imported = true;
                    }
                    importZip.value = '';
                }
                
                if (importJson && importJson.files.length > 0) {
                    for (const file of importJson.files) {
                        const content = await file.text();
                        await importFromJSON(content);
                        imported = true;
                    }
                    importJson.value = '';
                }
                
                if (!imported) {
                    showToast('Please select a file to import');
                }
            });
        }
        
        // Settings modal
        elements.closeSettingsBtn.addEventListener('click', () => closeModal(elements.settingsModal));
        elements.viewModeSelect.addEventListener('change', toggleView);
        elements.fontSizeSlider.addEventListener('input', (e) => {
            const size = e.target.value;
            elements.fontSizeValue.textContent = `${size}px`;
            elements.noteEditor.style.fontSize = `${size}px`;
            elements.notePreview.style.fontSize = `${size}px`;
        });
        
        // Delete modal
        elements.closeDeleteBtn.addEventListener('click', () => closeModal(elements.deleteModal));
        elements.cancelDeleteBtn.addEventListener('click', () => closeModal(elements.deleteModal));
        elements.confirmDeleteBtn.addEventListener('click', deleteCurrentNote);
        
        // Close modals on background click
        [elements.graphModal, elements.exportModal, elements.settingsModal, elements.deleteModal].forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal(modal);
            });
        });
        
        // Delete note with keyboard
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Delete') {
                if (currentNote) openModal(elements.deleteModal);
            }
        });
    }

    // Utility
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Start the app
    init().catch(console.error);
})();