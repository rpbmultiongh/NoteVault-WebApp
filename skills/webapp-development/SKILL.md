---
name: webapp-development
description: Complete workflow for building webapps. Use when user asks to build a webapp, create an Obsidian clone, or develop any browser-based application. This is the MASTER skill that orchestrates the full development lifecycle.
---

# WebApp Development

## Overview

A comprehensive skill that guides AI agents through building complete web applications from scratch. This skill follows a 6-step lifecycle: Define → Plan → Build → Verify → Review → Ship.

## When to Use

- User asks to "build a webapp"
- User asks to "create an Obsidian clone" or "make a note-taking app"
- User asks to "develop a browser-based application"
- Any request that involves creating a frontend web application
- This skill is the MASTER skill - it coordinates other skills

## The 6-Step Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│  1. DEFINE   → Create SPEC.md                               │
│  2. PLAN     → Create task list                             │
│  3. BUILD    → Implement features                           │
│  4. VERIFY   → Test & debug                                 │
│  5. REVIEW   → Quality check                                │
│  6. SHIP     → Deploy                                       │
└─────────────────────────────────────────────────────────────┘
```

## Step-by-Step Instructions

### Step 1: DEFINE (Requirements)

**Goal:** Create a detailed specification document

**Actions:**
1. Ask clarifying questions to understand requirements:
   - What core features are needed?
   - What tech stack (React/Vue/Vanilla)?
   - How to store data (localStorage/IndexedDB/backend)?
   - What's the target audience?
2. Create `SPEC.md` with:
   - Project overview (name, type, core functionality)
   - UI/UX specification (layout, colors, typography)
   - Functionality specification (features, interactions)
   - Data schema (if applicable)
   - Acceptance criteria (testable checkpoints)

**Output:** `SPEC.md` file in project root

**Validation:**
- [ ] Project name defined
- [ ] Core features listed
- [ ] UI layout with dimensions
- [ ] Color palette with hex codes
- [ ] Typography defined
- [ ] Data storage defined
- [ ] Acceptance criteria defined

---

### Step 2: PLAN (Task Breakdown)

**Goal:** Break specification into ordered tasks

**Actions:**
1. Review SPEC.md thoroughly
2. Identify all features to implement
3. Determine dependencies (what must come first)
4. Create ordered task list with priorities

**Task Template:**
```markdown
## Implementation Tasks

### Phase 1: Foundation (HIGH)
1. [HIGH] Set up project structure (HTML, CSS, JS)
2. [HIGH] Create data storage layer
3. [HIGH] Build main layout components

### Phase 2: Core Features (HIGH)
4. [HIGH] Implement feature X
5. [HIGH] Implement feature Y

### Phase 3: Advanced Features (MEDIUM)
6. [MEDIUM] Implement feature Z
7. [MEDIUM] Add export/import

### Phase 4: Polish (LOW)
8. [LOW] Add responsive design
9. [LOW] Add keyboard shortcuts
```

**Output:** Task list (can use todo list tool)

---

### Step 3: BUILD (Implementation)

**Goal:** Implement each task systematically

**Workflow for each task:**
1. Read relevant SPEC.md section
2. Implement the code
3. Test manually if possible
4. Mark task complete

**Implementation Order:**
```
Phase 1: Foundation
├── HTML skeleton with semantic markup
├── CSS with responsive design
└── JavaScript entry point

Phase 2: Core Features
├── Data storage (localStorage/IndexedDB)
├── Navigation/components
├── CRUD operations

Phase 3: Advanced Features
├── Bi-directional links
├── Tags/categories
├── Search/filter
├── Graph visualization

Phase 4: Polish
├── Animations
├── Keyboard shortcuts
└── Accessibility
```

**Best Practices:**
- Complete ONE task before starting next
- Follow existing code patterns
- Test as you go
- Don't skip steps

---

### Step 4: VERIFY (Testing & Debugging)

**Goal:** Ensure everything works correctly

**Testing Checklist:**

**Functional:**
- [ ] Can create items
- [ ] Can edit items
- [ ] Can delete items
- [ ] Can navigate between views
- [ ] All buttons work

**Browser:**
- [ ] Works in Chrome
- [ ] Console has no errors
- [ ] Network requests succeed

**Responsive:**
- [ ] Desktop (≥1024px)
- [ ] Tablet (768-1023px)
- [ ] Mobile (<768px)

**Debugging Process:**
```
1. REPRODUCE - Make bug happen consistently
2. LOCALIZE - Find WHERE it occurs
3. REDUCE - Minimal reproduction
4. FIX - Root cause, not symptoms
5. GUARD - Test to prevent recurrence
6. VERIFY - Confirm fix works
```

---

### Step 5: REVIEW (Code Quality)

**Goal:** Ensure code meets standards

**Five-Axis Review:**

1. **Correctness**
   - Code does what it claims
   - Edge cases handled
   - Error paths handled

2. **Readability**
   - Clear variable names
   - Logical organization
   - No deep nesting

3. **Architecture**
   - Follows project patterns
   - Clean module boundaries
   - No duplication

4. **Security**
   - No secrets in code
   - Input validation
   - XSS prevention

5. **Performance**
   - No N+1 patterns
   - Efficient rendering
   - Optimized assets

---

### Step 6: SHIP (Deploy)

**Goal:** Deploy to production

**Pre-Launch Checklist:**
- [ ] All features tested
- [ ] No console errors
- [ ] No secrets in code
- [ ] Responsive on all devices
- [ ] Fast load time

**Deployment Options:**

| Platform | Command |
|----------|---------|
| GitHub Pages | `git push` |
| Netlify | `netlify deploy` |
| Vercel | `vercel deploy` |
| Cloudflare | `wrangler pages deploy` |

**Verification:**
- [ ] Deployed site loads
- [ ] All features work
- [ ] No errors in console

---

## Automation Scripts

### setup-project.sh
Creates initial project structure with HTML, CSS, JS files.

```bash
bash skills/webapp-development/scripts/setup-project.sh [project-name]
```

### verify-app.sh
Runs automated verification tests.

```bash
bash skills/webapp-development/scripts/verify-app.sh
```

### deploy.sh
Deploys to various platforms.

```bash
bash skills/webapp-development/scripts/deploy.sh [platform]
```

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Skills not loading | Read SKILL.md manually, follow instructions |
| Can't test | Start HTTP server: `python3 -m http.server` |
| Code not working | Check console, use DevTools |
| Dependencies missing | Run `npm install` |

---

## Present Results to User

After completing the workflow, present:

```
## ✅ WebApp Development Complete

### Summary
- **Project:** [Name]
- **Features:** [List]
- **Status:** [Deployed/Ready]

### What Was Built
[Description of what was created]

### Files Created
- index.html
- styles.css  
- app.js
- SPEC.md

### How to Use
1. Open index.html in a browser
2. [Usage instructions]

### Next Steps
- [Any remaining items]
```

---

## Dependencies

This skill coordinates these other skills:
- `spec-driven-development` - For Step 1
- `planning-and-task-breakdown` - For Step 2
- `incremental-implementation` - For Step 3
- `debugging-and-error-recovery` - For Step 4
- `code-review-and-quality` - For Step 5
- `shipping-and-launch` - For Step 6

---

## Troubleshooting

**Q: The skill tool doesn't work**
A: Read this SKILL.md manually and follow the steps. The skill tool may not be available in all environments.

**Q: How do I test the webapp?**
A: Open index.html in a browser, or start a server with `python3 -m http.server`

**Q: What if I get stuck?**
A: Ask the user for clarification. Never guess at requirements.

**Q: Can I skip steps?**
A: No. Always complete steps in order. Skipping leads to bugs.