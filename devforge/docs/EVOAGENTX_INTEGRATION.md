# EvoAgentX Integration Guide

## Overview

This document describes how to integrate capabilities from the [EvoAgentX framework](https://github.com/anomalyco/EvoAgentX) into the workspace harness-framework for enhanced automation.

## Key Capabilities

### 1. Agent System

EvoAgentX provides a flexible agent architecture in `evoagentx/agents/`:

```
agents/
├── agent.py          # Base Agent class with actions, memory, LLM support
├── agent_manager.py  # Manages multiple agents
├── action_agent.py    # Agents with custom actions
├── task_planner.py   # Task planning capabilities
└── workflow_reviewer.py  # Code review functionality
```

**Key Concepts:**
- Agents have **actions** (capabilities) and **memory** (short-term and long-term)
- Agents use LLMs for decision-making
- Agents can be orchestrated in workflows

### 2. Action System

Actions in `evoagentx/actions/` define what agents can do:

- **CodeExtraction** - Extract code blocks from documentation and save to files
- **CodeVerification** - Verify code correctness
- **TaskPlanning** - Break down complex tasks into steps

### 3. Tools

The tools in `evoagentx/tools/` provide reusable capabilities:

#### PostgreSQL Tools (database_postgresql.py)

```python
from evoagentx.tools.database_postgresql import PostgreSQLDatabase

# Remote PostgreSQL
db = PostgreSQLDatabase(
    connection_string="postgresql://user:pass@host:5432/dbname"
)

# Execute queries
result = db.execute_query("SELECT * FROM files LIMIT 10")
```

**Features:**
- Remote connection with psycopg2
- File-based fallback mode
- SQL parsing for basic operations
- Connection timeout handling

#### Browser Automation (browser_use.py)

```python
from evoagentx.tools.browser_use import BrowserUseToolkit

toolkit = BrowserUseToolkit(
    model="gpt-4o-mini",
    browser_type="chromium",
    headless=False
)

result = toolkit.browser_use(task="Go to Google Drive and upload a file")
```

### 4. Workflow System

EvoAgentX workflows in `evoagentx/workflow/` enable multi-step task execution:

```python
from evoagentx.workflow.workflow import WorkFlow

workflow = WorkFlow(
    graph=workflow_graph,
    llm=llm,
    agent_manager=agent_manager,
    max_execution_steps=10
)

result = workflow.execute(inputs={"goal": "Build a webapp"})
```

## Integration Patterns

### Pattern 1: Database Setup Automation

Use PostgreSQL tools for automated backend setup:

```python
# Example: Automated Supabase migration script
from evoagentx.tools.database_postgresql import PostgreSQLDatabase

class BackendSetupTool:
    def __init__(self, connection_string):
        self.db = PostgreSQLDatabase(connection_string=connection_string)
    
    def run_migrations(self, migrations_dir):
        for sql_file in sorted(Path(migrations_dir).glob("*.sql")):
            with open(sql_file) as f:
                self.db.execute_query(f.read())
```

### Pattern 2: Browser Testing

Use BrowserUse for E2E testing:

```python
# Example: Test webapp upload flow
toolkit = BrowserUseToolkit(headless=True)
toolkit.browser_use(
    task="Login to the app, navigate to the upload section, "
         "and verify a test file appears in the file list"
)
```

### Pattern 3: Code Generation from Documentation

Use CodeExtraction for project scaffolding:

```python
from evoagentx.actions.code_extraction import CodeExtraction

extractor = CodeExtraction()
result = extractor.execute(
    llm=llm,
    inputs={
        "code_string": documentation_with_code_blocks,
        "target_directory": "./projects/new-webapp"
    }
)
```

## File Structure

```
harness-framework/
├── skills/
│   ├── webapp-development/
│   │   └── SKILL.md
│   └── database-setup/
│       └── SKILL.md          # NEW: Database setup skill
├── tools/
│   ├── database_tool.py       # NEW: Wrapper for PostgreSQL tools
│   └── browser_tool.py        # NEW: Wrapper for BrowserUse
├── protocols/
│   ├── supabase-migration.yaml
│   └── cloudflare-deploy.yaml
└── docs/
    └── EVOAGENTX_INTEGRATION.md
```

## Next Steps

1. Create `skills/database-setup/` skill using PostgreSQL tools
2. Create `tools/database_tool.py` wrapper
3. Add Supabase migration protocol using EvoAgentX patterns
4. Integrate BrowserUse for automated E2E testing

## References

- EvoAgentX Repo: ~/Downloads/EvoAgentX-main/evoagentx/
- Original Framework: https://github.com/anomalyco/EvoAgentX