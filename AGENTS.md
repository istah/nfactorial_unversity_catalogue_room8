# AI Agents & Workflow

This project is developed using AI-assisted workflow.
We use Codex CLI together with Context7 MCP for structured generation.

## Active Agents

### 1. Backend Architect Agent

**Role:**

- Design backend architecture
- Define database schema
- Define API contracts

**Tools:**

- Codex CLI
- Context7 MCP

---

### 2. Backend Implementation Agent

**Role:**

- Generate FastAPI structure
- Generate models, schemas, routers
- Follow PEP8 and typing standards

**Rules:**

- Use FastAPI
- Use application factory pattern
- Follow REST conventions

---

### 3. Documentation & QA Agent

**Role:**

- Generate README
- API documentation
- Validate endpoints existence

---

## Context Usage

All agents MUST:

- Refer to Context7 MCP
- Reuse project structure and existing files
- Avoid overwriting unrelated files

---

## Constraints

- No monolithic files
- No magic globals
- Explicit imports
- Clear folder separation
