#!/bin/bash

TEST_TYPE="${1:-api}"
URL="${2:-}"
USER_ID="${3:-test-user-$(date +%s)}"
RESULTS_FILE="/tmp/e2e-results-$$.json"

log_info() { echo "[INFO] $1"; }
log_error() { echo "[ERROR] $1"; }

init_results() {
    echo '{"tests_run":0,"tests_passed":0,"tests_failed":0,"results":[]}' > "$RESULTS_FILE"
}

add_result() {
    local name="$1"
    local status="$2"
    local duration="$3"
    local error="$4"
    
    local current=$(cat "$RESULTS_FILE")
    local run=$(( $(echo "$current" | jq '.tests_run') + 1 ))
    local pass=$(( $(echo "$current" | jq '.tests_passed') + ($( [ "$status" = "pass" ] && echo 1 || echo 0)) ))
    local fail=$(( $(echo "$current" | jq '.tests_failed') + ($( [ "$status" = "fail" ] && echo 1 || echo 0)) ))
    
    local result='{"name":"'"$name"'","status":"'"$status"'","duration_ms":'"$duration"'}'"${error:+,$(printf '%s' "$error")}"
    result="[$(echo "$current" | jq -r '.results | map(tostring) | join(",")')]$(printf '%s' "$result")"
    result="${result#[]}"; result="${result%]},$result"; result="[${result#,[}"
    
    echo "{\"tests_run\":$run,\"tests_passed\":$pass,\"tests_failed\":$fail,\"results\":[]}" > "$RESULTS_FILE"
}

test_api_health() {
    local start=$(date +%s%3N)
    log_info "Testing API health..."
    
    local http_code=$(curl -s -o /dev/null -w "%{http_code}" "${URL}/api/health" 2>/dev/null || echo "000")
    local end=$(date +%s%3N)
    local duration=$((end - start))
    
    if [ "$http_code" = "200" ]; then
        log_info "API health: PASS"
        echo "Health check passed (HTTP $http_code)" >> "$RESULTS_FILE"
        return 0
    else
        log_error "API health: FAIL (HTTP $http_code)"
        echo "Health check failed (HTTP $http_code)" >> "$RESULTS_FILE"
        return 1
    fi
}

test_files_list() {
    local start=$(date +%s%3N)
    log_info "Testing files list..."
    
    local response=$(curl -s "${URL}/api/files?userId=${USER_ID}" 2>/dev/null)
    local end=$(date +%s%3N)
    local duration=$((end - start))
    
    if echo "$response" | grep -q '\[' 2>/dev/null; then
        local count=$(echo "$response" 2>/dev/null | grep -o '"id"' | wc -l)
        log_info "Files list: PASS ($count files)"
        return 0
    else
        log_error "Files list: FAIL"
        return 1
    fi
}

test_storage_upload() {
    local start=$(date +%s%3N)
    log_info "Testing file upload..."
    
    local response=$(curl -s -X POST "${URL}/api/files" \
        -F "file=@/dev/stdin;filename=test-e2e.txt" \
        -F "userId=${USER_ID}" 2>/dev/null <<< "E2E test content")
    
    local end=$(date +%s%3N)
    local duration=$((end - start))
    
    if echo "$response" | grep -q '"id"' 2>/dev/null; then
        log_info "Storage upload: PASS"
        return 0
    else
        log_error "Storage upload: FAIL"
        return 1
    fi
}

test_frontend_load() {
    local start=$(date +%s%3N)
    log_info "Testing frontend load..."
    
    local http_code=$(curl -s -o /dev/null -w "%{http_code}" "${URL}/" 2>/dev/null || echo "000")
    local end=$(date +%s%3N)
    local duration=$((end - start))
    
    if [ "$http_code" = "200" ]; then
        log_info "Frontend load: PASS"
        return 0
    else
        log_error "Frontend load: FAIL (HTTP $http_code)"
        return 1
    fi
}

main() {
    log_info "E2E Testing: $TEST_TYPE on $URL"
    
    init_results
    
    case "$TEST_TYPE" in
        api) test_api_health; test_files_list ;;
        storage) test_api_health; test_storage_upload ;;
        upload) test_storage_upload; test_files_list ;;
        full)
            test_api_health
            test_files_list
            test_storage_upload
            test_frontend_load
            ;;
        *)
            log_error "Usage: $0 <api|storage|upload|full> <url> [user-id]"
            exit 1
            ;;
    esac
    
    log_info "Done"
}

main "$@"