# Skill Manifest

This file provides a catalog of all available skills in the harness-framework. AI agents should use this as a reference to find and invoke the appropriate skill for any task.

## Available Skills

### Core Development Skills

| Skill Name | Purpose | When to Use |
|------------|---------|-------------|
| `webapp-development` | Master workflow for building webapps | User asks to build any webapp |
| `spec-driven-development` | Create detailed specifications | Need to define requirements |
| `planning-and-task-breakdown` | Break into manageable tasks | Need to plan implementation |
| `incremental-implementation` | Build features incrementally | Implementing features |
| `test-driven-development` | Write tests first | Need to add tests |

### Quality & Verification Skills

| Skill Name | Purpose | When to Use |
|------------|---------|-------------|
| `debugging-and-error-recovery` | Find and fix bugs | Tests fail, bugs reported |
| `code-review-and-quality` | Multi-axis code review | Before merging/deploying |
| `security-and-hardening` | Security audit | Need to secure code |
| `performance-optimization` | Optimize performance | App is slow |
| `code-simplification` | Refactor and simplify | Code is complex |

### Domain-Specific Skills

| Skill Name | Purpose | When to Use |
|------------|---------|-------------|
| `frontend-ui-engineering` | Build UI components | Building user interface |
| `api-and-interface-design` | Design APIs | Creating backend interfaces |
| `browser-testing-with-devtools` | Browser testing | Need to test in browser |

### DevOps & Release Skills

| Skill Name | Purpose | When to Use |
|------------|---------|-------------|
| `shipping-and-launch` | Deploy to production | Ready to deploy |
| `ci-cd-and-automation` | Set up CI/CD | Need automation |
| `git-workflow-and-versioning` | Git best practices | Version control tasks |
| `deploy-webapp` | Deploy to Cloudflare + Supabase | Full-stack deployment |
| `database-setup` | Set up Supabase databases | Database initialization |
| `e2e-testing` | Test webapp functionality | End-to-end verification |

### EvoAgentX Integration Skills

| Skill Name | Purpose | When to Use |
|------------|---------|-------------|
| `fullstack-deploy` | Complete deployment workflow | Deploying full-stack apps |
| `api-testing` | Test API endpoints | Verify API functionality |
| `user-management` | Manage test users | Debug multi-user scenarios |

### Documentation & Process Skills

| Skill Name | Purpose | When to Use |
|------------|---------|-------------|
| `documentation-and-adrs` | Write docs and ADRs | Need documentation |
| `context-engineering` | Manage context | Working with context |

## Skill Invocation Guide

### For WebApp Development

**Step 1: Detect User Intent**
```
User: "Build me an Obsidian clone"
     ↓
This is a webapp development task
     ↓
Use: webapp-development skill
```

**Step 2: Follow Lifecycle**
```
1. DEFINE   → spec-driven-development
2. PLAN     → planning-and-task-breakdown  
3. BUILD    → incremental-implementation
4. VERIFY   → debugging-and-error-recovery
5. REVIEW   → code-review-and-quality
6. SHIP     → shipping-and-launch
```

### For Bug Fixes

```
User: "The app crashes when I click save"
     ↓
This is a bug/defect
     ↓
Use: debugging-and-error-recovery
     ↓
Follow the 6-step debugging process
```

### For Code Review

```
User: "Review my code"
     ↓
This is a review task
     ↓
Use: code-review-and-quality
     ↓
Follow 5-axis review
```

## Quick Reference

### Intent → Skill Mapping

| User Request | Skill |
|--------------|-------|
| Build a webapp | `webapp-development` |
| Create specification | `spec-driven-development` |
| Plan tasks | `planning-and-task-breakdown` |
| Implement feature | `incremental-implementation` |
| Fix bug | `debugging-and-error-recovery` |
| Review code | `code-review-and-quality` |
| Deploy | `shipping-and-launch` |
| Write tests | `test-driven-development` |
| Optimize performance | `performance-optimization` |
| Secure code | `security-and-hardening` |

## Workflow Automation

The `webapp-development` skill is the MASTER skill that orchestrates the entire development lifecycle. It should be used for any webapp development task.

```
User Request → webapp-development skill → Follows 6-step lifecycle
```

## Files Structure

```
skills/
├── webapp-development/
│   ├── SKILL.md
│   └── scripts/
│       ├── setup-project.sh
│       ├── verify-app.sh
│       └── deploy.sh
├── spec-driven-development/
│   └── SKILL.md
├── planning-and-task-breakdown/
│   └── SKILL.md
├── debugging-and-error-recovery/
│   └── SKILL.md
├── code-review-and-quality/
│   └── SKILL.md
└── shipping-and-launch/
    └── SKILL.md
```

## Notes

- All skills are in `skills/<skill-name>/SKILL.md` format
- Some skills have automation scripts in `scripts/` subdirectory
- If skill tool doesn't work, read SKILL.md manually and follow instructions
- Always complete all lifecycle steps in order