---
name: e2e-testing
description: End-to-end testing for webapps using browser automation and API verification
---

# E2E Testing Skill

Automated testing of webapp functionality including uploads, storage, and deployment verification.

## When to Use

- Verify webapp deployment after changes
- Test cloud storage integration
- Validate upload/download flows
- Check API connectivity

## Usage

```bash
bash skills/e2e-testing/scripts/test.sh <TEST_TYPE> <URL> [OPTIONS]
```

**Test Types:**
- `api` - Test API endpoints
- `storage` - Test cloud storage integration
- `upload` - Test file upload flow
- `full` - Run all tests

## Examples

```bash
# Test API connectivity
bash skills/e2e-testing/scripts/test.sh api "https://driveclone-api.driveclone.workers.dev"

# Test cloud storage
bash skills/e2e-testing/scripts/test.sh storage "https://master.driveclone-frontend.pages.dev" --user-id "test-user"

# Full test suite
bash skills/e2e-testing/scripts/test.sh full "https://master.driveclone-frontend.pages.dev"
```

## Output

Returns JSON with test results:
```json
{
  "tests_run": 5,
  "tests_passed": 4,
  "tests_failed": 1,
  "results": [
    {"name": "api_health", "status": "pass", "duration_ms": 120},
    {"name": "storage_test", "status": "fail", "error": "Connection timeout"}
  ]
}
```

## Integration with EvoAgentX

This skill wraps EvoAgentX's `browser_use.py` tool for automated browser testing and `request.py` for API testing.