# Agent Framework Analysis Template

For the framework you're analyzing, produce a comprehensive markdown document covering ALL of the following sections. Be extremely detailed -- reference specific files, functions, and code patterns. Include mermaid diagrams and code snippets.

## Required Sections

### 1. Overview
- What is it? One-paragraph summary
- Language/runtime
- License
- GitHub stats context
- Primary use case

### 2. Architecture
- **Core Loop**: How does the main agent loop work? Request-response vs continuous? Event-driven vs polling?
- **Entry Points**: Where does execution start? Trace the flow from startup to first response
- **Module/Package Structure**: How is the codebase organized? What are the key modules?
- **Mermaid Diagram**: Architecture overview showing major components and data flow
- **Code Snippet**: The core loop or main execution path

### 3. Memory System
- How does it store/retrieve context?
- Short-term (conversation history)
- Long-term (if any -- semantic search, embeddings, files)
- Episodic memory (specific events)
- Reflection/synthesis (higher-order insights)
- **Mermaid Diagram**: Memory architecture
- **Code Snippet**: Key memory retrieval code

### 4. Tool Calling / Function Execution
- How are tools defined?
- How are they discovered and registered?
- How are they executed? (sandboxing, permissions)
- Error handling and retry logic
- **Code Snippet**: Tool definition and execution example

### 5. LLM Integration
- Which providers/models supported?
- How are API calls structured?
- Streaming support?
- Token management / context window handling
- Cost tracking?
- **Code Snippet**: LLM call pattern

### 6. Security
- Sandboxing approach (WASM, Docker, process isolation, none)
- Credential/secret management
- Prompt injection defenses
- Network access controls
- Permission models
- **Mermaid Diagram**: Security boundary diagram

### 7. Multi-Channel / UI
- What interfaces does it support? (CLI, web, Telegram, Discord, etc.)
- How is the channel abstraction implemented?
- Real-time communication (WebSocket, polling, etc.)
- **Code Snippet**: Channel abstraction

### 8. State Management
- How is agent state persisted?
- File-based, database, hybrid?
- Session management
- Configuration system

### 9. Identity / Personality
- How does it maintain consistent persona?
- System prompt management
- SOUL.md or equivalent patterns

### 10. Unique Features
- What makes this framework different from the others?
- Novel patterns or approaches
- Strengths and limitations

### 11. Key Files Reference
- Table of the most important files/modules and what they do

### 12. Code Quality & Developer Experience
- How easy is it to extend?
- Plugin/skill system?
- Documentation quality
- Testing approach

Be thorough. Reference actual file paths, function names, and include real code snippets (not pseudocode). The goal is that a senior engineer reading this could understand exactly how the framework is built without reading the source themselves.
