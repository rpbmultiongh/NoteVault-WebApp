# WebApp Specification Template

Use this template to create SPEC.md for any webapp project.

```markdown
# [PROJECT NAME] - Specification Document

## 1. Project Overview

| Field | Value |
|-------|-------|
| **Project Name** | [Name] |
| **Type** | [WebApp / PWA / SPA] |
| **Core Functionality** | [One sentence describing what it does] |
| **Target Users** | [Who is this for?] |
| **Version** | 1.0.0 |
| **Status** | [Planning / In Development / Complete] |

---

## 2. Goals

### Primary Goals
1. [Most important goal]
2. [Second most important]
3. [Third most important]

### Secondary Goals
- [Nice to have features]

---

## 3. User Experience

### Layout Structure

```
┌──────────────────────────────────────────────────┐
│  HEADER (60px)                                   │
│  [Logo] [Search] [User Avatar/Nav]              │
├────────────┬─────────────────────────────────────┤
│  SIDEBAR   │  MAIN CONTENT                      │
│  (240px)  │  (flex: 1)                       │
│           │                                    │
│  - Nav 1  │  [Component / Content Area]         │
│  - Nav 2  │                                    │
│  - Nav 3  │                                    │
│           │                                    │
└────────────┴─────────────────────────────────────┘

[Optional: FOOTER if needed]
```

### Responsive Breakpoints

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Desktop | ≥1024px | Sidebar + Full content |
| Tablet | 768-1023px | Collapsible sidebar |
| Mobile | <768px | Bottom nav, stacked |

---

## 4. Visual Design

### Color Palette

| Role | Color | Hex | Usage |
|------|-------|-----|------|
| Primary | [Name] | #______ | Main actions, links |
| Primary Dark | [Name] | #______ | Hover states |
| Secondary | [Name] | #______ | Secondary elements |
| Background | [Name] | #______ | Page background |
| Surface | [Name] | #______ | Cards, panels |
| Border | [Name] | #______ | Dividers |
| Text Primary | [Name] | #______ | Main text |
| Text Secondary | [Name] | #______ | Descriptions |
| Success | [Name] | #______ | Success states |
| Warning | [Name] | #______ | Warnings |
| Error | [Name] | #______ | Errors |

### Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Logo | Family | 22px | 400 |
| H1 | Family | 24px | 500 |
| H2 | Family | 20px | 500 |
| Body | Family | 14px | 400 |
| Caption | Family | 12px | 400 |
| Button | Family | 14px | 500 |

### Spacing System

- Base unit: 8px
- XS: 4px
- SM: 8px
- MD: 16px
- LG: 24px
- XL: 32px
- XXL: 48px

### Visual Effects

- Border radius: 8px
- Card shadow: [shadow definition]
- Hover shadow: [hover shadow]
- Transition: 150ms ease-in-out

---

## 5. Functionality Specification

### Core Features

| # | Feature | Priority | Description |
|---|---------|----------|-------------|
| 1 | [Feature Name] | HIGH | [Description] |
| 2 | [Feature Name] | HIGH | [Description] |
| 3 | [Feature Name] | MEDIUM | [Description] |
| 4 | [Feature Name] | MEDIUM | [Description] |
| 5 | [Feature Name] | LOW | [Description] |

### User Interactions

| Action | Trigger | Result |
|--------|---------|--------|
| [Action] | [Click/Await] | [Result] |
| [Action] | [Drag/Drop] | [Result] |
| [Action] | [Keyboard] | [Result] |

### Data Handling

| Data Type | Storage | Mechanism |
|-----------|---------|-----------|
| User Data | [localStorage/IndexedDB/Cloud] | [description] |
| Files | [R2/S3/local] | [description] |
| Settings | [localStorage] | [description] |

---

## 6. Technical Stack

### Frontend

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | [React/Vue/Svelte] | latest |
| Build Tool | [Vite] | latest |
| Styling | [CSS Modules/Tailwind] | latest |
| Icons | [lucide-react] | latest |
| State | [React Context/Zustand] | latest |

### Backend Services (if needed)

| Service | Provider | Purpose |
|---------|----------|---------|
| Database | [Cloudflare D1/Supabase] | [Data storage] |
| Storage | [Cloudflare R2/S3] | [File storage] |
| Auth | [SST Auth/Firebase] | [User auth] |
| API | [Cloudflare Workers] | [Backend logic] |

### Deployment

| Platform | Type | URL Pattern |
|----------|-----|-----------|
| [Cloudflare Pages/AWS] | Frontend | [pattern] |
| [Cloudflare Workers] | API | [pattern] |

---

## 7. API Endpoints (if needed)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/[resource] | List items | [Yes/No] |
| POST | /api/[resource] | Create item | [Yes/No] |
| GET | /api/[resource]/:id | Get item | [Yes/No] |
| PUT | /api/[resource]/:id | Update item | [Yes/No] |
| DELETE | /api/[resource]/:id | Delete item | [Yes/No] |

---

## 8. Database Schema (if needed)

### Table: [name]

| Column | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | UUID |
| name | TEXT | NOT NULL | Item name |
| [column] | [type] | [constraints] | [description] |
| created_at | INTEGER | NOT NULL | Timestamp |
| updated_at | INTEGER | NOT NULL | Timestamp |

---

## 9. Acceptance Criteria

### Must Have (HIGH)
- [ ] [Criterion]
- [ ] [Criterion]
- [ ] [Criterion]

### Should Have (MEDIUM)
- [ ] [Criterion]
- [ ] [Criterion]

### Nice to Have (LOW)
- [ ] [Criterion]
- [ ] [Criterion]

---

## 10. File Structure

```
[project-name]/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   ├── components/
│   │   └── [Component]/
│   ├── hooks/
│   ├── utils/
│   └── worker/
│       └── api.ts
├── migrations/
│   └── 001_initial.sql
├── public/
└── dist/
```

---

## 11. Environment Variables

| Variable | Required | Description | Default |
|---------|----------|-------------|---------|
| VITE_API_URL | No | API base URL | /api |
| VITE_MODE | No | local/cloud | local |
| CLOUDFLARE_API_TOKEN | Yes* | Cloudflare token | - |
| CLOUDFLARE_ACCOUNT_ID | Yes* | Account ID | - |

*Only required for cloud deployment

---

## 12. Security Considerations

- [ ] No secrets in frontend code
- [ ] Input validation on all forms
- [ ] XSS prevention
- [ ] CSRF protection (if using cookies)
- [ ] Rate limiting (if API)
- [ ] CORS configured correctly

---

## 13. Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Lighthouse Score | > 90 |
| Bundle Size | < 500KB |

---

## Revision History

| Version | Date | Changes | Author |
|---------|------|--------|--------|
| 1.0.0 | [YYYY-MM-DD] | Initial spec | [Name] |