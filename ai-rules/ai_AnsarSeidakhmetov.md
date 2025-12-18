# AI Rules - Ansar Seidakhmetov

## How to Use This File
**When working on AI/LLM tasks in this project, use the `ai-engineer` subagent.**

```
Task tool with subagent_type="ai-engineer"
```

The `ai-engineer` subagent specializes in:
- LLM integrations and LangChain agents
- RAG systems and vector search
- Prompt engineering and tool design
- Agent orchestration

**Always spawn the ai-engineer subagent for tasks involving:**
- Modifying `agent.py` or `chat.py`
- Adding new LangChain tools
- Updating prompts or agent behavior
- Debugging LLM responses

---

## Role
AI Engineer responsible for building the LangChain-based university admissions assistant that uses the existing backend data layer.

## Project Context
- **Project**: University Catalog Room 8 - AI-assisted admissions assistant
- **Stack**: Python, LangChain, OpenAI, FastAPI
- **Backend Structure**: See `AGENTS.md` for full architecture
- **AI Components**: `app/agent.py` (tools + agent), `app/api/chat.py` (endpoint)

## Scope Boundaries
1. Only modify files: `app/agent.py`, `app/api/chat.py`
2. Do NOT modify existing backend files (services, models, schemas, routers)
3. USE the existing backend data layer (`UniversityService`, `SessionLocal`)
4. Import and call backend services - don't duplicate logic

## Data Integration Rules
1. Use `app/services/university_service.py` for all database operations
2. Use `app/core/database.SessionLocal` to create database sessions
3. Always close sessions in `finally` blocks
4. Serialize ORM objects to dicts before returning JSON from tools
5. Match the existing filter parameters: `country_code`, `program`, `exam`, `min_score`, `query`

## LangChain/LangGraph Agent Rules
1. Always use `@tool` decorator from `langchain_core.tools` for tool definitions
2. Tools MUST return JSON strings for consistent LLM parsing
3. Tool docstrings are critical - they guide the LLM on when/how to use tools
4. Never hardcode LLM responses; always let the agent call tools for data
5. Set `temperature=0` for deterministic, reliable tool-calling
6. Use `create_react_agent` from `langgraph.prebuilt` for ReAct agent pattern
7. Use `ChatOpenAI` from `langchain_openai` for the LLM
8. Agent accepts `{"messages": [...]}` and returns `{"messages": [...]}`

## Tool Design Rules
1. Each tool should do ONE thing well
2. Return structured JSON with clear field names
3. Include helpful error messages with suggestions when queries fail
4. Provide tips when user input doesn't match any results
5. Tool parameters should use Optional types with sensible defaults
6. University IDs are integers (from database), not strings

## Chat Endpoint Rules
1. Endpoint: `POST /api/chat` under `/api` prefix
2. Request: `{"message": str, "chat_history": list | null}`
3. Response: `{"response": str, "tool_calls": list | null}`
4. Cache agent instance to avoid recreating on every request
5. Validate `OPENAI_API_KEY` exists before creating agent

## Error Handling
1. Wrap agent.invoke() in try/except
2. Return HTTP 400 for empty messages
3. Return HTTP 500 for agent/LLM errors with user-friendly message
4. Never expose raw stack traces to users
5. Handle database connection errors gracefully

## Configuration
1. Use environment variables via `app/core/config.py`
2. Required: `OPENAI_API_KEY`, `DATABASE_URL`
3. Optional: `OPENAI_MODEL` (default: gpt-4o-mini)
4. Never commit API keys to repository

## Code Style
1. Use Python type hints for all functions
2. Keep functions under 50 lines
3. Use descriptive names: `university_data` not `ud`
4. Follow existing project patterns from `AGENTS.md`
5. Explicit imports, no magic globals
6. Helper functions prefixed with `_` for internal use

## Testing Approach
1. Test tools independently with test database
2. Mock OpenAI calls in unit tests
3. Test edge cases: empty results, invalid IDs, DB connection errors
4. Verify tool docstrings guide LLM correctly

---

## Current Implementation Status

### Completed
- `app/agent.py` with 4 tools using LangGraph ReAct agent
- `app/api/chat.py` endpoint integrated with agent
- Tools: `get_available_filters`, `search_universities`, `get_university`, `compare_universities`

### Agent Architecture
```python
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langgraph.prebuilt import create_react_agent

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0, api_key=api_key)
agent = create_react_agent(model=llm, tools=TOOLS, prompt=SYSTEM_PROMPT)
result = agent.invoke({"messages": messages})
```

### Test Examples
```bash
# List available options
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What universities are available?"}'

# Search by country
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Show me universities in Germany"}'

# Get details
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me about Technical University of Munich"}'
```