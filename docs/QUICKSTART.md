# AI Agent WebApp Development - Quick Start Guide

> **START HERE** - This is the fastest path to building any webapp with AI agents

## The One Command to Build Any WebApp

When a user asks to build a webapp, use this exact workflow:

```
DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP
```

---

## Step-by-Step Instructions

### Step 1: DEFINE - Create the Specification

**What to do:**
1. Ask the user clarifying questions about:
   - What features do you want?
   - What tech stack (React/Vue/Vanilla)?
   - How to store data?
2. Create a `SPEC.md` file with:
   - Project name and overview
   - UI/UX design (layout, colors, fonts)
   - Features list
   - Data schema
   - Acceptance criteria

**Output:** `SPEC.md`

---

### Step 2: PLAN - Break Into Tasks

**What to do:**
1. Review the SPEC.md
2. Create an ordered task list
3. Group by phases (Foundation → Core → Advanced → Polish)
4. Assign priorities (HIGH/MEDIUM/LOW)

**Output:** Todo list

---

### Step 3: BUILD - Implement Features

**What to do:**
For each task:
1. Read the spec section
2. Write the code
3. Test manually
4. Mark complete

**Implementation Order:**
```
Phase 1: Foundation
├── Set up HTML/CSS/JS files
├── Create basic layout
└── Add styles

Phase 2: Core Features
├── Data storage layer
├── Navigation
└── CRUD operations

Phase 3: Advanced Features
├── Search/filter
├── Export/import
└── Visualizations

Phase 4: Polish
├── Responsive design
└── Keyboard shortcuts
```

**Output:** Working code

---

### Step 4: VERIFY - Test & Debug

**What to do:**
1. Test in browser
2. Check console for errors
3. Test all features manually
4. Fix any bugs found

**Testing Checklist:**
- [ ] Can create items
- [ ] Can edit items  
- [ ] Can delete items
- [ ] Navigation works
- [ ] No console errors
- [ ] Responsive on mobile

**Output:** Working app

---

### Step 5: REVIEW - Quality Check

**What to do:**
Review code for:
1. **Correctness** - Does it work?
2. **Readability** - Is it clear?
3. **Architecture** - Is it well-structured?
4. **Security** - Is it safe?
5. **Performance** - Is it fast?

**Output:** Approved code

---

### Step 6: SHIP - Deploy

**What to do:**
1. Final verification
2. Choose deployment platform
3. Deploy
4. Test production

**Deployment Options:**
| Platform | Command |
|----------|---------|
| GitHub Pages | Push to git |
| Netlify | `netlify deploy` |
| Vercel | `vercel deploy` |

**Output:** Live website

---

## Quick Reference

### Common WebApp Templates

**Note-Taking App (Obsidian Clone)**
```
Features:
- Markdown editor with preview
- File/folder organization
- Bi-directional links [[]]
- Tags #tag
- Graph view
- Local storage (IndexedDB)
```

**Todo App**
```
Features:
- Add/edit/delete tasks
- Mark complete
- Filter by status
- Due dates
- localStorage persistence
```

**Blog/CMS**
```
Features:
- Create/edit posts
- Markdown support
- Categories/tags
- RSS feed
- Static export
```

---

## Troubleshooting

### Problem: Don't know where to start
**Solution:** Always start with Step 1 (DEFINE). Never code without a spec.

### Problem: User requirements are unclear
**Solution:** Ask questions. Never guess. Better to ask than build wrong thing.

### Problem: Something isn't working
**Solution:** 
1. Check browser console (F12)
2. Use debugging tools
3. Simplify to isolate issue

### Problem: Can't test
**Solution:** 
```bash
# Start local server
python3 -m http.server 8000
# Then open http://localhost:8000
```

---

## Files to Create

For any webapp, you'll typically create:

| File | Purpose |
|------|---------|
| `index.html` | Main HTML structure |
| `styles.css` | Styling and responsive design |
| `app.js` | Application logic |
| `SPEC.md` | Requirements specification |
| `README.md` | Usage instructions |

---

## Next Steps

1. **Read the full workflow:** See `docs/WORKFLOW.md`
2. **Explore skills:** See `docs/SKILL_MANIFEST.md`
3. **Start building:** Follow the steps above

---

## Example Session

```
User: "I want an Obsidian clone webapp"

Agent: "I'll build this step by step. Let me start by asking a few questions..."

[Questions about features, tech stack, storage]

Agent: "Now I'll create the specification..."

[Creates SPEC.md]

Agent: "Let me break this into tasks and start building..."

[Implements features one by one]

Agent: "Let me verify everything works..."

[Tests in browser, fixes issues]

Agent: "Let me do a quick code review..."

[Reviews for quality]

Agent: "Ready to deploy! Here's your Obsidian clone..."

[Deploys to Netlify/Vercel]

✅ Done!
```