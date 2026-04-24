import BuildClient from './BuildClient';
import { extractHeadings } from '@/lib/markdown';

const content = `
## Core Architecture Decisions

### Language Choice

| Language | Pros | Cons | Frameworks |
|----------|------|------|------------|
| **TypeScript** | Fast iteration, rich npm ecosystem, same language for web UI | Higher memory, slower startup, no static binary | OpenClaw, pi |
| **Rust** | Memory safety, single binary, excellent concurrency | Steep learning curve, slower development | IronClaw, Spacebot |
| **Go** | Single binary, fast compilation, low memory, easy concurrency | Less expressive type system | PicoClaw |
| **Python** | Fastest to prototype, best ML/AI library ecosystem | Slowest runtime, GIL, dependency management | HermitClaw |

**Recommendation**: Start with TypeScript or Python for prototyping. Move to Go or Rust if you need deployment efficiency or are building for constrained environments.

### Loop Style

Choose based on your use case:

- **Request-response** (most frameworks): User sends message, agent processes, returns response. Best for assistants, coding agents, chatbots.
- **Continuous** (HermitClaw): Agent thinks on its own schedule. Best for research agents, monitoring, autonomous systems.
- **Delegation** (Spacebot): Orchestrator dispatches to specialized workers. Best for multi-user, high-concurrency, team environments.

### State Management

Every framework stores state as files or SQLite. None use external databases as a hard requirement (IronClaw supports PostgreSQL but also works with libSQL).

**Start with files**. JSON for structured data, markdown for human-readable content. You can always add a database later, but files are debuggable, portable, and simple.

## Essential Components Checklist

Build these in order:

### 1. LLM Client
- [ ] Call an LLM API with messages and tools
- [ ] Parse tool call responses
- [ ] Handle streaming (or buffer for simplicity)
- [ ] Support at least 2 providers (for fallback)

### 2. Agent Loop
- [ ] Send messages + tool definitions to LLM
- [ ] Execute tool calls and append results
- [ ] Loop until LLM returns text (no tool calls)
- [ ] Set a max iteration limit (10-20)

### 3. Basic Tools
- [ ] Shell command execution
- [ ] File read/write
- [ ] Web search (Brave API or similar)
- Start with 3-4 tools. You can always add more.

### 4. Session Persistence
- [ ] Save conversation history to disk (JSON/JSONL)
- [ ] Load history on session resume
- [ ] Session key routing (channel + chat ID)

### 5. System Prompt
- [ ] Load identity files (AGENTS.md, SOUL.md)
- [ ] Inject tool descriptions
- [ ] Add runtime context (date, model, capabilities)

### 6. Context Window Management
- [ ] Estimate token count (chars/4 is fine to start)
- [ ] Implement basic compaction (LLM summarization of old messages)
- [ ] Emergency fallback: drop oldest messages

### 7. Channel Adapter
- [ ] Define a channel interface (receive messages, send responses)
- [ ] Implement one channel (Telegram or Discord are easiest)
- [ ] Route messages to correct session

### 8. Memory
- [ ] Workspace files (MEMORY.md pattern)
- [ ] Optional: embeddings + vector search for semantic retrieval
- [ ] Optional: daily note logging

## Memory System Design

### Decision Tree

1. **Do you need cross-session memory?**
   - No → Session history + AGENTS.md is enough (pi approach)
   - Yes → Continue

2. **How much memory?**
   - Small (fits in system prompt) → File injection (PicoClaw approach: MEMORY.md + daily notes)
   - Large → You need search. Continue.

3. **What kind of search?**
   - Keyword only → BM25/FTS is fast and good enough
   - Semantic → Add embeddings + vector search
   - Both → Hybrid with RRF (OpenClaw/IronClaw/Spacebot approach)

4. **Real-time or pre-computed?**
   - Real-time → Search on every query (most frameworks)
   - Pre-computed → Background bulletin synthesis (Spacebot Cortex approach, better for high-traffic)

### Embedding Setup

If you go the vector route:
- **Model**: \`all-MiniLM-L6-v2\` (384 dims, fast, local) or \`text-embedding-3-small\` (OpenAI, better quality)
- **Storage**: SQLite + sqlite-vec (simplest), LanceDB (Spacebot), or PostgreSQL + pgvector (IronClaw)
- **Chunk size**: 500-1000 tokens per chunk
- **Search**: Always combine with FTS via RRF for best results

## Tool System Design

### Minimum Viable Tool Set

Every framework converges on these essentials:

1. **Shell execution** -- \`exec\`/\`bash\`/\`shell\`
2. **File read** -- Read file contents
3. **File write** -- Create/overwrite files
4. **File edit** -- Surgical find-and-replace (better than full rewrites)

Add as needed: web search, web fetch, message sending, browser automation.

### Tool Definition Pattern

All frameworks use the same pattern (matching LLM APIs):

\`\`\`typescript
interface Tool {
  name: string;
  description: string;
  parameters: JSONSchema;
  execute(args: unknown): Promise<ToolResult>;
}
\`\`\`

### Operations Pattern (from pi)

Make tool I/O pluggable:

\`\`\`typescript
interface FileOperations {
  read(path: string): Promise<string>;
  write(path: string, content: string): Promise<void>;
}

function createReadTool(ops: FileOperations): Tool {
  return {
    name: 'read',
    execute: (args) => ops.read(args.path),
  };
}
\`\`\`

This lets you redirect tools to SSH, Docker, or any other backend without changing tool logic.

## Security Considerations

### Threat Model

Your agent has access to tools. The LLM decides which tools to call. The LLM can be manipulated by:
1. **Prompt injection** -- Malicious content in web pages, emails, or user input that instructs the LLM to take harmful actions
2. **Data exfiltration** -- The LLM sends private data to external services via tool calls
3. **Privilege escalation** -- The LLM runs commands that exceed intended permissions

### Minimum Security (Do This)

- [ ] Restrict exec tool to a working directory
- [ ] Block obviously dangerous commands (rm -rf /, sudo, etc.)
- [ ] Wrap untrusted content with markers (OpenClaw pattern)
- [ ] Log all tool calls for audit

### Better Security (If You Care)

- [ ] Run tools in a container/sandbox
- [ ] Implement tool allowlists per context (Spacebot's process separation)
- [ ] Add approval workflow for destructive operations (IronClaw pattern)
- [ ] Scan for credential leaks in tool output (IronClaw leak detector)

### Best Security (IronClaw's Approach)

- [ ] WASM sandbox for untrusted tools
- [ ] Capability-based permissions (deny by default)
- [ ] Credential injection at the host boundary (tools never see secrets)
- [ ] Endpoint allowlisting for HTTP requests
- [ ] Prompt injection detection (Aho-Corasick + regex)

## Recommended Reading Order

If you're studying these frameworks to learn agent architecture:

1. **Start with HermitClaw** -- Smallest codebase (~3K lines, 14 files). You can read the entire thing in an afternoon. The Generative Agents memory system and continuous thinking loop are educational even if you build something different.

2. **Then PicoClaw** -- Clean Go code (~20K lines). Shows how to build a complete agent with tools, channels, and sessions in a resource-efficient way. Good model for "the minimum viable agent framework."

3. **Then pi** -- The extension system and pluggable operations pattern are masterfully designed. Study this if you want to build something extensible.

4. **Then Spacebot** -- The delegation model (Channel/Branch/Worker) is the most innovative architecture. Study this for multi-user or high-concurrency designs.

5. **Then IronClaw** -- Deep security architecture. Study this if security is a priority or you want to understand WASM sandboxing.

6. **Finally OpenClaw** -- The most complete framework. Study this last because it's the most complex, but also the most production-hardened.

## "If You Want X, Study Y"

| If you want... | Study... | Specifically... |
|----------------|----------|----------------|
| Simplest possible agent | HermitClaw | \`brain.py\` -- the entire loop in one file |
| Best tool interface design | pi | \`core/tools/*.ts\` -- operations pattern |
| Best memory system | Spacebot | \`memory/\` -- typed graph + bulletin synthesis |
| Best security model | IronClaw | \`safety/\` + \`tools/wasm/\` -- 5 security layers |
| Best channel abstraction | OpenClaw | \`channels/plugins/\` -- most mature multi-channel system |
| Best extension system | pi | \`core/extensions/\` -- 20+ event types, full lifecycle |
| Smallest footprint | PicoClaw | The whole codebase -- every design decision is about efficiency |
| Multi-user concurrency | Spacebot | \`agent/channel.rs\` -- event loop + delegation |
| Context window management | Spacebot | \`agent/compactor.rs\` -- tiered compaction |
| Autonomous agent behavior | HermitClaw | \`brain.py\` -- continuous thinking + reflection |
| Hardware/IoT integration | PicoClaw | \`tools/i2c_linux.go\` -- direct syscall tools |
| Cross-provider LLM support | pi | \`packages/ai/\` -- unified API with context handoff |
`;

export default function BuildYourOwnPage() {
  const headings = extractHeadings(content);
  return <BuildClient content={content} headings={headings} />;
}
