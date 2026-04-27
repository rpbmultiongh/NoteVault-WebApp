# AI Agent WebApp Development Workflow

This is the **master workflow** for building web applications using AI agents. It provides step-by-step instructions that any AI coding agent can follow to develop a complete, production-ready webapp.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Lifecycle Overview](#lifecycle-overview)
3. [Step 1: Define (Requirements & Specification)](#step-1-define-requirements--specification)
4. [Step 2: Plan (Task Breakdown)](#step-2-plan-task-breakdown)
5. [Step 3: Build (Implementation)](#step-3-build-implementation)
6. [Step 4: Verify (Testing & Debugging)](#step-4-verify-testing--debugging)
7. [Step 5: Review (Code Quality)](#step-5-review-code-quality)
8. [Step 6: Ship (Deploy)](#step-6-ship-deploy)
9. [Automation Scripts](#automation-scripts)
10. [Troubleshooting](#troubleshooting)

---

## Quick Start

To build ANY webapp, follow this exact sequence:

```bash
# 1. DEFINE - Create specification
# 2. PLAN   - Break into tasks  
# 3. BUILD  - Implement features
# 4. VERIFY - Test & fix bugs
# 5. REVIEW - Quality check
# 6. SHIP   - Deploy
```

**For Obsidian Clone:** Follow steps 1-6 below in order. Do NOT skip any step.

---

## Lifecycle Overview

| Step | Command | Skill | Output |
|------|---------|-------|--------|
| 1 | DEFINE | `spec-driven-development` | SPEC.md |
| 2 | PLAN | `planning-and-task-breakdown` | Task list |
| 3 | BUILD | `incremental-implementation` | Working code |
| 4 | VERIFY | `debugging-and-error-recovery` | Fixed issues |
| 5 | REVIEW | `code-review-and-quality` | Approval |
| 6 | SHIP | `shipping-and-launch` | Deployed app |

---

## Step 1: DEFINE (Requirements & Specification)

### Goal
Create a detailed specification document that defines WHAT the webapp will do.

### Actions

1. **Analyze the user's request** - Understand the core requirements
2. **Ask clarifying questions** if needed:
   - What core features are required?
   - What tech stack should be used?
   - How should data be stored?
   - What is the target audience?
3. **Create SPEC.md** with:
   - Project overview
   - UI/UX specification (layout, colors, typography)
   - Functionality specification
   - Data schema
   - Acceptance criteria

### Output
`SPEC.md` - A comprehensive specification document

### Validation Checklist
- [ ] Project name defined
- [ ] Core features listed
- [ ] UI layout described with dimensions
- [ ] Color palette specified (hex codes)
- [ ] Typography defined (font families, sizes)
- [ ] Data storage mechanism defined
- [ ] Acceptance criteria defined

---

## Step 2: PLAN (Task Breakdown)

### Goal
Break the specification into manageable, ordered tasks.

### Actions

1. **Analyze SPEC.md** - Understand all features
2. **Identify dependencies** - What must be built first?
3. **Create ordered task list** - Each task should be completable in 1-2 hours
4. **Prioritize tasks** - High/Medium/Low

### Task Template

```markdown
## Tasks

1. **[HIGH]** Set up project structure (HTML, CSS, JS files)
2. **[HIGH]** Create storage layer (IndexedDB/localStorage)
3. **[HIGH]** Build sidebar with navigation
4. **[HIGH]** Build main editor component
5. **[MEDIUM]** Implement feature X
6. **[MEDIUM]** Implement feature Y
7. **[LOW]** Add polish and refinements
```

### Output
A structured todo list with priorities

---

## Step 3: BUILD (Implementation)

### Goal
Implement each task, starting with the foundation.

### Workflow

For each task:
1. **Read the spec** to understand requirements
2. **Implement the code**
3. **Test manually** (if possible)
4. **Mark task as complete**

### Implementation Order (Recommended)

```
Phase 1: Foundation
├── Set up project structure
├── Create HTML skeleton
├── Create CSS styles (base theme)
└── Create JS entry point

Phase 2: Core Features
├── Build data storage layer
├── Build sidebar component
├── Build editor component
└── Build context panel

Phase 3: Advanced Features
├── Implement bi-directional links
├── Implement tags
├── Build graph view
└── Add export functionality

Phase 4: Polish
├── Add responsive design
├── Add keyboard shortcuts
└── Add animations
```

### Best Practices

- **One task at a time** - Don't try to do multiple tasks simultaneously
- **Commit after each task** - Small, focused commits
- **Test as you go** - Don't wait until the end to test
- **Follow the spec** - Don't deviate without user approval

---

## Step 4: VERIFY (Testing & Debugging)

### Goal
Ensure the webapp works correctly and fix any issues.

### Testing Checklist

#### Functional Testing
- [ ] Can create new notes/documents
- [ ] Can edit and save content
- [ ] Can delete items
- [ ] Can navigate between views
- [ ] All buttons work correctly
- [ ] Forms submit correctly

#### Browser Testing
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge
- [ ] Console has no errors
- [ ] Network tab shows no failed requests

#### Responsive Testing
- [ ] Desktop layout (≥1024px)
- [ ] Tablet layout (768-1023px)
- [ ] Mobile layout (<768px)

### Debugging Process

If you encounter bugs, follow this process:

```
1. REPRODUCE - Make the bug happen consistently
2. LOCALIZE - Find WHERE the bug occurs
3. REDUCE - Create minimal reproduction
4. FIX - Address root cause
5. GUARD - Add test to prevent recurrence
6. VERIFY - Confirm fix works
```

### Common WebApp Issues

| Issue | Solution |
|-------|----------|
| Page blank | Check console for errors |
| Data not saving | Check localStorage/IndexedDB |
| Slow performance | Check for memory leaks |
| Responsive issues | Check CSS media queries |
| Links not working | Check event delegation |

---

## Step 5: REVIEW (Code Quality)

### Goal
Ensure code meets quality standards before deployment.

### Five-Axis Review

#### 1. Correctness
- [ ] Code does what it claims
- [ ] Edge cases handled
- [ ] Error paths handled

#### 2. Readability
- [ ] Clear variable names
- [ ] Logical organization
- [ ] No complex nesting

#### 3. Architecture
- [ ] Follows project patterns
- [ ] Clean module boundaries
- [ ] No code duplication

#### 4. Security
- [ ] No secrets in code
- [ ] Input validation
- [ ] XSS prevention

#### 5. Performance
- [ ] No N+1 patterns
- [ ] Efficient data fetching
- [ ] Optimized rendering

### Code Review Questions

Ask these for each file:
1. Is this code correct?
2. Is this readable?
3. Is this well-architected?
4. Is this secure?
5. Is this performant?

---

## Step 6: SHIP (Deploy)

### Goal
Deploy the webapp to production.

### Pre-Launch Checklist

#### Code Quality
- [ ] All tests pass
- [ ] Build succeeds
- [ ] No console errors
- [ ] No TODO comments

#### Security
- [ ] No secrets in code
- [ ] No vulnerable dependencies
- [ ] Input validation in place

#### Performance
- [ ] Fast initial load
- [ ] Smooth interactions
- [ ] Optimized assets

#### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast OK

### Deployment Options

For static webapps:

| Platform | Command | Free Tier | Notes |
|----------|---------|----------|-------|
| GitHub Pages | `git push` | Yes | Free, simple |
| Netlify | Drag & drop | Yes | Free tier available |
| Vercel | `vercel deploy` | Yes | Free for static |
| Cloudflare Pages | `wrangler` | Yes | Free, fast (RECOMMENDED) |

For full-stack (with backend):

| Platform | Services | Free Tier | Docs |
|----------|----------|----------|------|
| Cloudflare | R2 + D1 + Workers | Yes | [Cloudflare Deploy Guide](./CLOUDFLARE_DEPLOY.md) |
| AWS | S3 + DynamoDB + Lambda | Pay | SST required |
| Supabase | Database + Storage | Yes | supabase.com |

### Post-Launch

- [ ] Verify deployed site works
- [ ] Test all features in production
- [ ] Monitor for errors
- [ ] Share URL with user

---

## Automation Scripts

These scripts automate common workflow tasks:

### setup-project.sh
Creates the initial project structure.

```bash
#!/bin/bash
# Usage: bash scripts/setup-project.sh [project-name]
```

### run-tests.sh
Runs all tests and reports results.

```bash
#!/bin/bash
# Usage: bash scripts/run-tests.sh
```

### deploy.sh
Deploys the webapp to production.

```bash
#!/bin/bash
# Usage: bash scripts/deploy.sh [platform]
```

### code-review.sh
Performs automated code review.

```bash
#!/bin/bash
# Usage: bash scripts/code-review.sh
```

---

## Troubleshooting

### Issue: Skills not loading

**Problem:** The `skill` tool shows "Available skills: none"

**Solution:**
1. Skills exist but aren't being loaded by the agent
2. Read the SKILL.md file manually and follow its instructions
3. The skills are in `skills/<skill-name>/SKILL.md`

### Issue: Can't test in browser

**Problem:** No test server available

**Solution:**
```bash
# Start a simple HTTP server
python3 -m http.server 8000

# Or use npx
npx serve .
```

### Issue: Code not working

**Problem:** Unexpected behavior

**Solution:**
1. Check browser console for errors
2. Use debugging tools (Chrome DevTools)
3. Add console.log statements to trace execution
4. Check network tab for failed requests

### Issue: Dependencies missing

**Problem:** Can't install packages

**Solution:**
1. Check if package.json exists
2. Run `npm install`
3. Verify node version compatibility

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────┐
│              WEBAPP DEVELOPMENT WORKFLOW                     │
├─────────────────────────────────────────────────────────────┤
│  1. DEFINE   → Create SPEC.md                               │
│  2. PLAN     → Create task list                             │
│  3. BUILD    → Implement code                               │
│  4. VERIFY   → Test & fix bugs                              │
│  5. REVIEW   → Check quality                                │
│  6. SHIP     → Deploy                                       │
├─────────────────────────────────────────────────────────────┤
│  NEVER skip steps. Always follow in order.                  │
│  When in doubt, ask the user.                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Related Documentation

- [AGENTS.md](../AGENTS.md) - Agent integration guide
- [skills/](../skills/) - Available skills
- [agents/](../agents/) - Available personas
- [SPEC.md](./SPEC.md) - Project specification template
- [AGENT_INSTRUCTIONS.md](./AGENT_INSTRUCTIONS.md) - Comprehensive agent instructions
- [SPEC_TEMPLATE.md](./SPEC_TEMPLATE.md) - Specification template
- [WEBAPP_WALKTHROUGH.md](./WEBAPP_WALKTHROUGH.md) - User walkthrough guide
- [CLOUDFLARE_DEPLOY.md](./CLOUDFLARE_DEPLOY.md) - Cloudflare deployment guide