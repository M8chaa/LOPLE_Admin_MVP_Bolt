# Tool Requests

## Playwright MCP Tool Request

**Date**: 2025-01-28  
**Requested by**: Background Agent working on LOPLE Admin MVP  

**Description**: 
I need access to a Playwright MCP tool to properly test the LOPLE admin website MVP for the stakeholder demo. The current MVP includes:

- React frontend with Material-UI (running on localhost:5173)
- Node.js/Express backend with SQLite (running on localhost:4000)
- Authentication system (admin/admin123)
- Dashboard, Callcards, and Drivers pages

**Use Case**: 
To ensure the MVP is production-ready for the stakeholder demo, I need to:
1. Automated end-to-end testing of the login flow
2. Test navigation between pages
3. Test callcard assignment functionality
4. Verify UI responsiveness and functionality
5. Screenshot capture for documentation
6. Performance testing of the admin interface

**Current Testing Gap**: 
While I can test the backend APIs via curl, I cannot properly test the frontend user interface and interactions without browser automation capabilities.

**Available Tools Currently**: 
- `run_terminal_cmd` (for backend API testing)
- `edit_file` (for code changes)
- `read_file` (for code review)
- `codebase_search` (for code analysis)

**Missing**: 
- Browser automation/Playwright MCP tool for frontend testing