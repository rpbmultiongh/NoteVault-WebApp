# Complete Agent Instructions for WebApp Development

This document provides comprehensive, step-by-step instructions for AI agents to build production-ready webapps with full-stack capabilities.

---

## Table of Contents

1. [Quick Reference](#quick-reference)
2. [Step 1: DEFINE - Requirements](#step-1-define---requirements)
3. [Step 2: PLAN - Task Breakdown](#step-2-plan---task-breakdown)
4. [Step 3: BUILD - Implementation](#step-3-build---implementation)
5. [Step 4: VERIFY - Testing](#step-4-verify---testing)
6. [Step 5: REVIEW - Quality](#step-5-review---quality)
7. [Step 6: SHIP - Deployment](#step-6-ship---deployment)
8. [Backend Services Guide](#backend-services-guide)
9. [Deployment Commands](#deployment-commands)

---

## Quick Reference

```
┌────────────────────────────────────────────────────────────────┐
│           WEBAPP DEVELOPMENT LIFECYCLE                          │
├──────────┬─────────────────────────────────────┬─────────────┤
│ Step     │ Action                              │ Output     │
├──────────┼─────────────────────────────────────┼─────────────┤
│ 1 DEFINE │ Create SPEC.md                    │ SPEC.md    │
│ 2 PLAN   │ Create task list with priorities   │ Task list │
│ 3 BUILD  │ Implement features               │ Working   │
│          │                                 │ code      │
│ 4 VERIFY │ Test & fix bugs                  │ Fixed     │
│ 5 REVIEW │ Code quality check               │ Approved  │
│ 6 SHIP   │ Deploy to cloud                 │ Live URL  │
└──────────┴─────────────────────────────────────┴─────────────┘
```

**Never skip steps. Always follow in order.**

---

## Step 1: DEFINE - Requirements

### Purpose
Create a detailed specification that defines WHAT the webapp will do.

### Actions

1. **Analyze the user's request**
   - What problem does the webapp solve?
   - Who is the target audience?
   - What are the core features?

2. **Ask clarifying questions** (choose relevant):
   ```
   - What tech stack should be used? (React, Vue, Svelte, vanilla?)
   - How should data be stored? (localStorage, IndexedDB, cloud DB?)
   - Do you need authentication? (Yes/No/OAuth provider?)
   - Do you need file storage? (Yes/No/S3/R2?)
   - What deployment target? (Cloudflare/AWS/Vercel/Netlify?)
   - What's your budget? (Free/Low cost/No limit)
   ```

3. **Create SPEC.md** containing:
   ```markdown
   # Project Name - SPEC.md
   
   ## 1. Project Overview
   - **Name**: [Project name]
   - **Type**: [WebApp type]
   - **Core Functionality**: [What it does]
   - **Target Users**: [Who it's for]
   
   ## 2. UI/UX Specification
   - Layout structure
   - Color palette (hex codes)
   - Typography
   - Responsive breakpoints
   
   ## 3. Functionality Specification
   - Core features (numbered list)
   - User interactions
   - Data handling
   
   ## 4. Data Schema
   - Database/Storage mechanism
   - Schema definitions
   
   ## 5. Technical Stack
   - Frontend: [Framework]
   - Backend: [Services]
   - Deployment: [Platform]
   
   ## 6. Acceptance Criteria
   - Feature checklist
   ```
   
4. **Validate SPEC.md** using the checklist:
   - [ ] Project name defined
   - [ ] Core features listed
   - [ ] UI layout with dimensions
   - [ ] Color palette (hex codes)
   - [ ] Typography defined
   - [ ] Data storage mechanism defined
   - [ ] Acceptance criteria defined

### Output
`SPEC.md` - comprehensive specification document

---

## Step 2: PLAN - Task Breakdown

### Purpose
Break the specification into manageable, ordered tasks.

### Actions

1. **Analyze SPEC.md** - Understand all features
2. **Identify dependencies** - What must be built first?
3. **Create ordered task list** - Each task completable in 1-2 hours
4. **Prioritize tasks** - HIGH/Medium/Low

### Task Template

```markdown
## Tasks

### Phase 1: Foundation (HIGH)
1. [HIGH] Set up project structure
2. [HIGH] Configure development environment
3. [HIGH] Create base styling/CSS

### Phase 2: Core Features (HIGH)
4. [HIGH] Build data storage layer
5. [HIGH] Build main components
6. [HIGH] Implement core features

### Phase 3: Advanced (MEDIUM)
7. [MEDIUM] Add search/filter
8. [MEDIUM] Add user authentication
9. [MEDIUM] Add file upload

### Phase 4: Polish (LOW)
10. [LOW] Add responsive design
11. [LOW] Add keyboard shortcuts
12. [LOW] Performance optimization
```

### Output
Todo list with priorities (as JSON or markdown)

---

## Step 3: BUILD - Implementation

### Purpose
Implement each task, starting with the foundation.

### Implementation Order (Recommended)

```
Phase 1: Foundation
├── Initialize project (Vite/ Next/ etc.)
├── Create HTML structure
├── Create CSS variables/theme
└── Create entry point

Phase 2: Core Features
├── Build data storage layer
├── Build core components
├── Implement CRUD operations

Phase 3: Backend Services (if needed)
├── Set up authentication
├── Set up database
├── Set up file storage
├── Create API endpoints

Phase 4: Polish
├── Add responsive design
├── Add animations
└── Performance optimization
```

### Best Practices

- **One task at a time** - Don't try to do multiple tasks simultaneously
- **Test as you go** - Don't wait until the end to test
- **Follow the spec** - Don't deviate without user approval
- **Use the right tool** - Pick the simplest solution that works

---

## Step 4: VERIFY - Testing

### Purpose
Ensure the webapp works correctly and fix any issues.

### Testing Checklist

#### Functional
- [ ] Can create/read/update/delete data
- [ ] All navigation works
- [ ] All buttons/functions work correctly
- [ ] Forms submit correctly

#### Browser
- [ ] Works in Chrome
- [ ] Works in Firefox  
- [ ] Console has no errors
- [ ] Network requests succeed

#### Responsive
- [ ] Desktop layout (≥1024px)
- [ ] Tablet layout (768-1023px)
- [ ] Mobile layout (<768px)

### Debugging Process
```
1. REPRODUCE - Make the bug happen consistently
2. LOCALIZE - Find WHERE the bug occurs  
3. REDUCE - Create minimal reproduction
4. FIX - Address root cause
5. GUARD - Add test to prevent recurrence
6. VERIFY - Confirm fix works
```

---

## Step 5: REVIEW - Quality

### Purpose
Ensure code meets quality standards before deployment.

### Five-Axis Review

| Axis | Questions |
|------|-----------|
| **Correctness** | Does it work? Are edge cases handled? |
| **Readability** | Clear names? Logical organization? |
| **Architecture** | Follows patterns? Clean boundaries? |
| **Security** | No secrets? Input validated? |
| **Performance** | No N+1? Optimized rendering? |

### Code Review Questions (ask for each file)
1. Is this code correct?
2. Is this readable?
3. Is this well-architected?
4. Is this secure?
5. Is this performant?

---

## Step 6: SHIP - Deployment

### Purpose
Deploy the webapp to production.

### Pre-Launch Checklist

- [ ] All tests pass
- [ ] Build succeeds (`npm run build`)
- [ ] No console errors
- [ ] No secrets in code
- [ ] Environment variables configured

---

## Backend Services Guide

### Options by Use Case

| Need | Recommendation | Free Tier | Setup Complexity |
|------|--------------|----------|-----------------|
| File Storage | Cloudflare R2 | ✅ Yes | Easy |
| Database | Cloudflare D1 | ✅ Yes | Easy |
| Auth | SST Auth | ✅ Yes | Medium |
| Database | Supabase | ✅ Yes | Easy |
| Database | Firebase | ✅ Yes | Easy |

### Cloudflare (Recommended - Free)

**Why Cloudflare?**
- No egress fees (R2)
- Free tier generous
- Edge deployment
- Easy SST integration

**Setup:**
```bash
# Set credentials
export CLOUDFLARE_API_TOKEN=your_token
export CLOUDFLARE_ACCOUNT_ID=your_account_id

# Deploy
npx wrangler r2 bucket create my-bucket
npx wrangler d1 execute my-db --file=migrations/001_initial.sql --remote
npx wrangler deploy src/worker/api.ts --name my-api
npx wrangler pages project deploy dist --project-name=my-frontend
```

---

## Deployment Commands

### Cloudflare (Recommended)

```bash
# Full deploy to Cloudflare
npx wrangler r2 bucket create [bucket-name]
npx wrangler d1 create [db-name]
npx wrangler d1 execute [db-name] --file=migrations/001_initial.sql --remote
npx wrangler deploy src/worker/api.ts --name [api-name]
npx wrangler pages project deploy dist --project-name=[project-name]

# Get URLs
# Frontend: https://[project-name].[account].pages.dev
# API: https://[api-name].[account].workers.dev
```

### AWS (Alternative)

```bash
# Using SST
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
npx sst deploy
```

### Vercel (Simple)

```bash
# Deploy frontend only
npx vercel --prod

# With config
vercel.json:
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

---

## Quick Command Reference

```bash
# Development
npm run dev           # Start dev server
npm run build        # Build for production

# Deployment (Cloudflare)
npx wrangler pages project deploy dist

# SST Deployment
npx sst deploy
npx sst remove

# Verify
curl https://your-url.com
```

---

## Related Documents

- [SPEC.md template](./SPEC.md)
- [WORKFLOW.md](./WORKFLOW.md)
- [skills/](./skills/) - Available skills
- [agents/](./agents/) - Personas