"""
WebApp Deployment Workflow
Implements EvoAgentX-style workflow orchestration for automated webapp deployment.
"""

import json
import time
from typing import Dict, Any, List, Optional, Tuple
from dataclasses import dataclass, field
from enum import Enum


class TaskState(Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


@dataclass
class Task:
    """Represents a workflow task/node."""

    name: str
    description: str
    action: str
    inputs: Dict[str, Any] = field(default_factory=dict)
    outputs: List[str] = field(default_factory=list)
    state: TaskState = TaskState.PENDING
    result: Any = None
    error: Optional[str] = None


@dataclass
class Workflow:
    """Workflow definition with tasks and dependencies."""

    goal: str
    tasks: List[Task]
    dependencies: Dict[str, List[str]] = field(default_factory=dict)

    def get_next_tasks(self) -> List[Task]:
        """Get tasks ready to execute (all dependencies completed)."""
        completed = {t.name for t in self.tasks if t.state == TaskState.COMPLETED}
        ready = []
        for task in self.tasks:
            if task.state == TaskState.PENDING:
                deps = self.dependencies.get(task.name, [])
                if all(d in completed for d in deps):
                    ready.append(task)
        return ready

    def get_execution_history(self) -> str:
        """Get formatted execution history."""
        history = []
        for task in self.tasks:
            if task.state == TaskState.COMPLETED:
                history.append(f"{task.name} (completed)")
            elif task.state == TaskState.RUNNING:
                history.append(f"{task.name} (running)")
        return " -> ".join(history) if history else "None"


class WorkflowExecutor:
    """Executes workflows using available tools."""

    def __init__(self, tools: Dict[str, Any]):
        self.tools = tools
        self.execution_data: Dict[str, Any] = {}

    def execute_task(self, task: Task) -> Tuple[bool, Any]:
        """Execute a single task."""
        task.state = TaskState.RUNNING
        print(f"[WORKFLOW] Executing: {task.name}")

        try:
            if task.action == "database_migrate":
                result = self._execute_database_migrate(task)
            elif task.action == "api_health_check":
                result = self._execute_api_health_check(task)
            elif task.action == "deploy_api":
                result = self._execute_deploy_api(task)
            elif task.action == "deploy_frontend":
                result = self._execute_deploy_frontend(task)
            elif task.action == "test_cloud_storage":
                result = self._execute_test_cloud_storage(task)
            elif task.action == "verify_schema":
                result = self._execute_verify_schema(task)
            elif task.action == "set_secrets":
                result = self._execute_set_secrets(task)
            else:
                result = {"error": f"Unknown action: {task.action}"}

            task.result = result
            if "error" in result:
                task.state = TaskState.FAILED
                task.error = result["error"]
                return False, result
            else:
                task.state = TaskState.COMPLETED
                self.execution_data.update(
                    {k: v for k, v in result.items() if k != "error"}
                )
                return True, result

        except Exception as e:
            task.state = TaskState.FAILED
            task.error = str(e)
            return False, {"error": str(e)}

    def _execute_database_migrate(self, task: Task) -> Dict[str, Any]:
        """Execute database migrations."""
        db_tool = self.tools.get("database")
        if not db_tool:
            return {"error": "Database tool not available"}

        if not db_tool.connected:
            if not db_tool.connect():
                return {"error": "Cannot connect to database"}

        migrations_dir = task.inputs.get("migrations_dir", "./migrations")
        return db_tool.execute_migrations(migrations_dir)

    def _execute_api_health_check(self, task: Task) -> Dict[str, Any]:
        """Check API health."""
        api_tool = self.tools.get("api")
        if not api_tool:
            return {"error": "API tool not available"}

        endpoint = task.inputs.get("endpoint", "/api/health")
        result = api_tool.get(endpoint)
        return result

    def _execute_deploy_api(self, task: Task) -> Dict[str, Any]:
        """Deploy API."""
        deploy_tool = self.tools.get("deployment")
        if not deploy_tool:
            return {"error": "Deployment tool not available"}

        target = task.inputs.get("target", "cloudflare-workers")
        result = deploy_tool.deploy_api(target)
        return result

    def _execute_deploy_frontend(self, task: Task) -> Dict[str, Any]:
        """Deploy frontend."""
        deploy_tool = self.tools.get("deployment")
        if not deploy_tool:
            return {"error": "Deployment tool not available"}

        target = task.inputs.get("target", "cloudflare-pages")
        result = deploy_tool.deploy_frontend(target)
        return result

    def _execute_test_cloud_storage(self, task: Task) -> Dict[str, Any]:
        """Test cloud storage integration."""
        e2e_tool = self.tools.get("e2e")
        if not e2e_tool:
            return {"error": "E2E tool not available"}

        url = task.inputs.get("url")
        user_id = task.inputs.get("user_id", "test-user")
        return e2e_tool.test_cloud_storage(url, user_id)

    def _execute_verify_schema(self, task: Task) -> Dict[str, Any]:
        """Verify database schema."""
        db_tool = self.tools.get("database")
        if not db_tool:
            return {"error": "Database tool not available"}

        tables = task.inputs.get("expected_tables", [])
        query_result = db_tool.query("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        """)

        if query_result:
            actual_tables = [r.get("table_name") for r in query_result]
            missing = set(tables) - set(actual_tables)
            return {
                "verified": len(missing) == 0,
                "expected": tables,
                "actual": actual_tables,
                "missing": list(missing),
            }
        return {"error": "Could not query database"}

    def _execute_set_secrets(self, task: Task) -> Dict[str, Any]:
        """Set deployment secrets."""
        deploy_tool = self.tools.get("deployment")
        if not deploy_tool:
            return {"error": "Deployment tool not available"}

        secrets = task.inputs.get("secrets", {})
        return deploy_tool.set_secrets(secrets)

    def run(self, workflow: Workflow, max_iterations: int = 10) -> Dict[str, Any]:
        """Execute workflow until completion or max iterations."""
        print(f"[WORKFLOW] Starting: {workflow.goal}")
        print(f"[WORKFLOW] Tasks: {len(workflow.tasks)}")

        iteration = 0
        while iteration < max_iterations:
            iteration += 1
            next_tasks = workflow.get_next_tasks()

            if not next_tasks:
                if all(t.state != TaskState.PENDING for t in workflow.tasks):
                    break
                print(f"[WORKFLOW] No tasks ready, but some still pending")
                break

            for task in next_tasks:
                success, result = self.execute_task(task)
                print(f"[WORKFLOW] {task.name}: {'SUCCESS' if success else 'FAILED'}")
                if not success:
                    print(f"[WORKFLOW] Error: {task.error}")

        failed = [t for t in workflow.tasks if t.state == TaskState.FAILED]
        completed = [t for t in workflow.tasks if t.state == TaskState.COMPLETED]

        return {
            "success": len(failed) == 0,
            "completed": len(completed),
            "failed": len(failed),
            "failed_tasks": [t.name for t in failed],
            "execution_history": workflow.get_execution_history(),
            "execution_data": self.execution_data,
        }


def create_webapp_deployment_workflow(
    project_dir: str,
    supabase_url: str,
    supabase_key: str,
    api_url: str,
    frontend_url: str,
) -> Workflow:
    """Create a complete webapp deployment workflow."""

    tasks = [
        # 1. Set secrets
        Task(
            name="set_secrets",
            description="Set deployment secrets",
            action="set_secrets",
            inputs={
                "project_dir": project_dir,
                "secrets": {"SUPABASE_SERVICE_ROLE_KEY": supabase_key},
            },
            outputs=["secrets_set"],
        ),
        # 2. Verify database schema
        Task(
            name="verify_schema",
            description="Verify Supabase schema is correct",
            action="verify_schema",
            inputs={"expected_tables": ["files", "folders", "users"]},
            outputs=["schema_verified"],
        ),
        # 3. Deploy API
        Task(
            name="deploy_api",
            description="Deploy Cloudflare Worker API",
            action="deploy_api",
            inputs={"project_dir": project_dir},
            outputs=["api_url"],
        ),
        # 4. Deploy frontend
        Task(
            name="deploy_frontend",
            description="Deploy frontend to Cloudflare Pages",
            action="deploy_frontend",
            inputs={"project_dir": project_dir},
            outputs=["frontend_deployed"],
        ),
        # 5. Test cloud storage
        Task(
            name="test_storage",
            description="Test cloud storage integration",
            action="test_cloud_storage",
            inputs={"url": frontend_url, "user_id": "workflow-test"},
            outputs=["storage_working"],
        ),
    ]

    dependencies = {
        "verify_schema": ["set_secrets"],
        "deploy_api": ["verify_schema"],
        "deploy_frontend": ["deploy_api"],
        "test_storage": ["deploy_frontend"],
    }

    return Workflow(
        goal="Deploy and verify webapp", tasks=tasks, dependencies=dependencies
    )


if __name__ == "__main__":
    # Example usage
    from evoagentx_tools import create_tool

    tools = {
        "database": create_tool("database", connection_string="postgresql://..."),
        "api": create_tool(
            "api", base_url="https://driveclone-api.driveclone.workers.dev"
        ),
        "deployment": create_tool("deployment", project_dir="./driveclone"),
        "e2e": create_tool("e2e"),
    }

    workflow = create_webapp_deployment_workflow(
        project_dir="./driveclone",
        supabase_url="https://spykxpepfpzrvnxdmjra.supabase.co",
        supabase_key="...",
        api_url="https://driveclone-api.driveclone.workers.dev",
        frontend_url="https://master.driveclone-frontend.pages.dev",
    )

    executor = WorkflowExecutor(tools)
    result = executor.run(workflow)

    print("\n[WORKFLOW] Result:")
    print(json.dumps(result, indent=2))
