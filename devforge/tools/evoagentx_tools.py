"""
Tools wrapper for EvoAgentX integration.
Provides database, API, and browser testing capabilities.
"""

import os
import json
import subprocess
from typing import Dict, Any, Optional, List
from pathlib import Path


class DatabaseTool:
    """Database operations tool wrapper."""

    def __init__(self, connection_string: str = None):
        self.connection_string = connection_string or os.getenv("DATABASE_URL")
        self.connected = False

    def connect(self) -> bool:
        if not self.connection_string:
            return False
        try:
            result = subprocess.run(
                ["psql", self.connection_string, "-c", "SELECT 1;"],
                capture_output=True,
                timeout=5,
            )
            self.connected = result.returncode == 0
            return self.connected
        except:
            return False

    def execute_migrations(self, migrations_dir: str) -> Dict[str, Any]:
        """Execute SQL migrations from directory."""
        if not self.connected:
            return {"success": False, "error": "Not connected"}

        migrations = sorted(Path(migrations_dir).glob("*.sql"))
        results = {"success": True, "migrations_run": 0, "tables": []}

        for migration in migrations:
            try:
                with open(migration) as f:
                    sql = f.read()
                result = subprocess.run(
                    ["psql", self.connection_string],
                    input=sql,
                    capture_output=True,
                    timeout=10,
                )
                if result.returncode == 0:
                    results["migrations_run"] += 1
                    tables = [
                        line.split()[2]
                        for line in sql.split("\n")
                        if line.startswith("CREATE TABLE") and len(line.split()) >= 3
                    ]
                    results["tables"].extend(tables)
            except Exception as e:
                results["error"] = str(e)

        return results

    def query(self, sql: str) -> List[Dict]:
        """Execute a query and return results."""
        if not self.connected:
            return []
        try:
            result = subprocess.run(
                ["psql", self.connection_string, "-t", "-A", "-c", sql],
                capture_output=True,
                text=True,
                timeout=10,
            )
            if result.returncode == 0:
                return [{"data": result.stdout}]
            return []
        except:
            return []


class APITool:
    """API testing and interaction tool."""

    def __init__(self, base_url: str = None):
        self.base_url = base_url or os.getenv("API_BASE_URL")
        self.session = None

    def get(self, endpoint: str, params: Dict = None) -> Dict[str, Any]:
        """Make GET request."""
        import urllib.request
        import urllib.parse

        url = f"{self.base_url}{endpoint}"
        if params:
            url += "?" + urllib.parse.urlencode(params)

        try:
            with urllib.request.urlopen(url, timeout=10) as response:
                return {"status": response.status, "data": json.loads(response.read())}
        except Exception as e:
            return {"error": str(e)}

    def post(
        self, endpoint: str, data: Dict = None, files: Dict = None
    ) -> Dict[str, Any]:
        """Make POST request."""
        import urllib.request
        import urllib.parse

        url = f"{self.base_url}{endpoint}"

        try:
            if files:
                import multipart

                body, content_type = multipart.encode(url, data or {}, files)
                req = urllib.request.Request(
                    url, data=body, headers={"Content-Type": content_type}
                )
            else:
                data = json.dumps(data or {}).encode()
                req = urllib.request.Request(
                    url, data=data, headers={"Content-Type": "application/json"}
                )

            with urllib.request.urlopen(req, timeout=30) as response:
                return {"status": response.status, "data": json.loads(response.read())}
        except Exception as e:
            return {"error": str(e)}

    def delete(self, endpoint: str) -> Dict[str, Any]:
        """Make DELETE request."""
        import urllib.request

        url = f"{self.base_url}{endpoint}"

        try:
            req = urllib.request.Request(url, method="DELETE")
            with urllib.request.urlopen(req, timeout=10) as response:
                return {"status": response.status, "data": json.loads(response.read())}
        except Exception as e:
            return {"error": str(e)}


class DeploymentTool:
    """Deployment automation tool."""

    def __init__(self, project_dir: str = None):
        self.project_dir = project_dir or os.getcwd()

    def deploy_frontend(self, target: str = "cloudflare-pages") -> Dict[str, Any]:
        """Deploy frontend to target."""
        if target == "cloudflare-pages":
            try:
                result = subprocess.run(
                    ["npx", "wrangler", "pages", "deploy", "dist"],
                    cwd=self.project_dir,
                    capture_output=True,
                    text=True,
                )
                return {
                    "success": result.returncode == 0,
                    "output": result.stdout,
                    "error": result.stderr if result.returncode != 0 else None,
                }
            except Exception as e:
                return {"success": False, "error": str(e)}
        return {"success": False, "error": f"Unknown target: {target}"}

    def deploy_api(self, target: str = "cloudflare-workers") -> Dict[str, Any]:
        """Deploy API to target."""
        if target == "cloudflare-workers":
            try:
                result = subprocess.run(
                    ["npx", "wrangler", "deploy"],
                    cwd=self.project_dir,
                    capture_output=True,
                    text=True,
                )
                return {
                    "success": result.returncode == 0,
                    "output": result.stdout,
                    "error": result.stderr if result.returncode != 0 else None,
                }
            except Exception as e:
                return {"success": False, "error": str(e)}
        return {"success": False, "error": f"Unknown target: {target}"}

    def set_secrets(self, secrets: Dict[str, str]) -> Dict[str, Any]:
        """Set deployment secrets."""
        results = []
        for key, value in secrets.items():
            try:
                proc = subprocess.Popen(
                    ["npx", "wrangler", "secret", "put", key],
                    stdin=subprocess.PIPE,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    cwd=self.project_dir,
                )
                proc.communicate(input=value.encode())
                results.append({"key": key, "success": proc.returncode == 0})
            except Exception as e:
                results.append({"key": key, "success": False, "error": str(e)})
        return {"results": results}


class E2ETestTool:
    """End-to-end testing tool using browser automation."""

    def __init__(self, headless: bool = True):
        self.headless = headless
        self.results = []

    def test_upload_flow(self, url: str, test_file: str = None) -> Dict[str, Any]:
        """Test file upload flow in browser."""
        # This would use BrowserUse in full implementation
        # For now, return a placeholder structure
        return {
            "test": "upload_flow",
            "url": url,
            "status": "pending",
            "steps": [
                "navigate_to_app",
                "click_upload_button",
                "select_file",
                "verify_upload_success",
            ],
        }

    def test_cloud_storage(self, url: str, user_id: str) -> Dict[str, Any]:
        """Test cloud storage integration."""
        import urllib.request

        # Test API connectivity
        try:
            api_url = f"{url}/api/files?userId={user_id}"
            with urllib.request.urlopen(api_url, timeout=10) as response:
                files = json.loads(response.read())
                return {"success": True, "files_count": len(files), "files": files}
        except Exception as e:
            return {"success": False, "error": str(e)}


# Tool factory
def create_tool(tool_type: str, **kwargs) -> Any:
    """Create a tool instance by type."""
    tools = {
        "database": DatabaseTool,
        "api": APITool,
        "deployment": DeploymentTool,
        "e2e": E2ETestTool,
    }
    tool_class = tools.get(tool_type)
    if tool_class:
        return tool_class(**kwargs)
    raise ValueError(f"Unknown tool type: {tool_type}")
