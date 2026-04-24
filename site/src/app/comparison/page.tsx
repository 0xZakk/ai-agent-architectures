import ComparisonClient from './ComparisonClient';
import { extractHeadings } from '@/lib/markdown';

const content = `
## Architecture

### Core Loop Patterns

Every framework has a main loop, and they're all different:

| Framework | Loop Pattern | Language | Concurrency Model |
|-----------|-------------|----------|-------------------|
| **OpenClaw** | Event-driven request-response with async tool loops | TypeScript | Lane-based command queues (per-session + global) |
| **IronClaw** | Event-driven message loop with \`tokio::select!\` | Rust | Single async loop, tools in-line |
| **PicoClaw** | Message bus with goroutine consumers | Go | Goroutines + channel-based bus |
| **HermitClaw** | Continuous autonomous loop (5s tick) | Python | Single asyncio task per crab |
| **Spacebot** | Concurrent process model (Channel/Branch/Worker) | Rust | \`tokio::spawn\` per process, broadcast events |
| **pi (pi.dev)** | Classic agentic loop with steering queues | TypeScript | Single-threaded with interrupt queues |
| **Hermes Agent** | Synchronous agentic loop with thread interrupts | Python | Synchronous core, subagent parallelism (up to 3) |
| **OpenAI Agents SDK** | Runner turn loop with guardrails and handoffs | Python / TypeScript | async/await, asyncio.gather for parallel guardrails |

**Request-response** (OpenClaw, IronClaw, PicoClaw, pi, Hermes): Wait for input, run it through an LLM + tool loop, return a response. Most frameworks do this.

**Continuous** (HermitClaw): No human trigger needed. Every 5 seconds it runs a think cycle -- picks topics, researches, writes. Human messages are just nudges it overhears.

**Delegation** (Spacebot): The user-facing Channel never executes work itself. It dispatches to Branches (thinking) and Workers (execution) running as concurrent tasks. Results flow back as events.

**Orchestration** (OpenAI Agents SDK): The Runner manages a turn loop where agents hand off to other agents, tools can pause for human approval, and guardrails validate inputs/outputs. Run state is fully serializable -- you can persist it and resume later.

### Module Structure Comparison

| Framework | Source Files | Lines (est.) | Key Abstraction |
|-----------|-------------|-------------|-----------------|
| **OpenClaw** | ~2,100 TS | ~100K+ | Channel plugins, tool registry, session lanes |
| **IronClaw** | ~88 RS | ~30K+ | Trait-based tools/channels, WASM sandbox |
| **PicoClaw** | ~125 Go | ~20K | Interface-based tools/channels, message bus |
| **HermitClaw** | ~14 Py | ~3K | Single Brain class, memory stream |
| **Spacebot** | ~88 RS | ~25K+ | Process types (Channel/Branch/Worker), memory graph |
| **pi (pi.dev)** | ~50 TS | ~15K+ | Operations interfaces, extension events |
| **Hermes Agent** | ~100+ Py | ~20K+ | AIAgent class, ToolRegistry singleton, BasePlatformAdapter |
| **OpenAI Agents SDK** | ~230+ Py / ~100+ TS | ~30K+ (Py) | Agent, Runner, Handoff, Guardrail, RunState |

### Framework Type Spectrum

Most frameworks here are **standalone applications** -- you run them, you interact with them. The OpenAI Agents SDK is a **library** -- you import it and build agents in your own code. Hermes Agent lands somewhere in between: it's an application, but the tool registry and platform adapter patterns make it easy to extend.

## Memory Systems

### Memory Architecture Comparison

| Framework | Short-term | Long-term | Semantic Search | Compaction |
|-----------|-----------|-----------|----------------|------------|
| **OpenClaw** | Session JSON transcript | Workspace files (MEMORY.md, daily notes) | Hybrid BM25 + vector (SQLite + sqlite-vec) | LLM-based summarization when context fills |
| **IronClaw** | In-memory session + DB persistence | Workspace filesystem in DB | Hybrid FTS + vector via RRF (PostgreSQL/pgvector) | Context summarization |
| **PicoClaw** | Session JSON files | File-based (MEMORY.md + daily notes) | **None** -- no embeddings, no vector DB | LLM summarization when >20 msgs or 75% tokens |
| **HermitClaw** | Last N thoughts in context | Append-only JSONL memory stream | 3-factor retrieval: recency + importance + cosine similarity | **None** -- memory grows unbounded |
| **Spacebot** | Channel conversation history | Typed memory graph (8 types) in SQLite + LanceDB | Hybrid FTS + vector + graph via RRF | Tiered: 80% background, 85% aggressive, 95% emergency |
| **pi (pi.dev)** | JSONL session with tree structure | AGENTS.md files (no cross-session memory) | **None** | LLM-based compaction with file tracking |
| **Hermes Agent** | Session JSON transcripts | MEMORY.md + USER.md (§-delimited entries) | Honcho AI cross-session memory; SQLite session search | ContextCompressor (middle turns summarized by auxiliary model) |
| **OpenAI Agents SDK** | Session interface (pluggable backends) | **None** built-in (use tools + external stores) | **None** built-in (file_search hosted tool available) | Server-side compaction via responses.compact API |

### Memory Retrieval Approaches

**Hybrid Search (RRF)** -- OpenClaw, IronClaw, and Spacebot all do this. They combine full-text search (BM25/FTS) with vector similarity, then merge results via Reciprocal Rank Fusion. If something shows up in both result sets, it gets a boosted score.

**Three-Factor Retrieval** -- HermitClaw's approach, straight from the Generative Agents paper: \`score = recency + importance + relevance\`. Each factor is 0-1. Recency decays exponentially, importance is LLM-scored 1-10, relevance is cosine similarity.

**External Memory Services** -- Hermes Agent uses Honcho for cross-session user modeling, plus SQLite-indexed session search for conversation history.

**Pluggable Session Backends** -- The OpenAI Agents SDK defines a Session protocol with 10+ backends (in-memory, SQLite, Redis, SQLAlchemy, MongoDB, Dapr, encrypted, OpenAI Conversations). Long-term memory is your problem.

**No Retrieval** -- PicoClaw and pi skip semantic search entirely. PicoClaw just injects MEMORY.md + the last 3 days into the system prompt. pi relies on AGENTS.md context files and the LLM reading files via tools.

### The Workspace File Pattern

Five of the eight frameworks converge on the same pattern for persistent identity and memory:

| File | Purpose | Used By |
|------|---------|---------|
| \`AGENTS.md\` | Operational instructions | OpenClaw, IronClaw, PicoClaw, Spacebot, pi, Hermes |
| \`SOUL.md\` | Personality/values | OpenClaw, IronClaw, PicoClaw, Spacebot, Hermes |
| \`USER.md\` | Info about the human | OpenClaw, IronClaw, PicoClaw, Spacebot, Hermes |
| \`MEMORY.md\` | Curated long-term memory | OpenClaw, IronClaw, PicoClaw, Hermes |
| \`memory/YYYY-MM-DD.md\` | Daily logs | OpenClaw, IronClaw, PicoClaw |

HermitClaw does its own thing -- \`identity.json\` (genome-derived traits) and \`memory_stream.jsonl\` (append-only with embeddings).

The OpenAI Agents SDK has no workspace file convention. Agent instructions live in code, and memory is delegated to the Session interface.

## Tool / Function Calling

### Tool Inventory

| Tool Category | OpenClaw | IronClaw | PicoClaw | HermitClaw | Spacebot | pi | Hermes | Agents SDK |
|--------------|----------|----------|----------|------------|----------|----|--------|------------|
| Shell exec | ✅ | ✅ | ✅ | ✅ (sandboxed) | ✅ (worker) | ✅ | ✅ (5 backends) | ✅ (ShellTool) |
| File R/W | ✅ | ✅ | ✅ | Via shell | ✅ (worker) | ✅ | ✅ | Via tools |
| File edit | ✅ | Via write | ✅ | Via shell | Via file tool | ✅ | ✅ (patch) | ✅ (ApplyPatchTool) |
| Web search | ✅ | ✅ | ✅ | ✅ (OpenAI built-in) | ✅ (worker) | Via extension | ✅ (Brave/Tavily) | ✅ (WebSearchTool) |
| Web fetch | ✅ | ✅ | ✅ | ✅ | Via shell | Via extension | ✅ | Via tools |
| Browser automation | ✅ (Playwright) | ❌ | ❌ | ❌ | ✅ (headless Chrome) | Via extension | ✅ (Playwright) | ✅ (ComputerTool) |
| Memory search | ✅ | ✅ | ❌ | Automatic (retrieval) | ✅ (branch) | ❌ | ✅ (Honcho + SQLite) | ✅ (FileSearchTool) |
| Message/channel | ✅ | Via channels | ✅ | ✅ (respond) | ✅ (reply) | Via extension | ✅ (send_message) | Via tools |
| Sub-agents | ✅ | ❌ | ✅ | ❌ | ✅ (branch/worker) | Via extension | ✅ (delegate_task) | ✅ (agent-as-tool) |
| Cron/scheduling | ✅ | ✅ (routines) | ✅ | ❌ | ✅ | Via extension | ✅ (natural language) | ❌ |
| TTS | ✅ | ❌ | ❌ | ❌ | ❌ | Via extension | ✅ (OpenAI/ElevenLabs) | ✅ (voice pipeline) |
| Image analysis | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ (read) | ✅ (vision models) | Via tools |
| Image generation | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (fal.ai) | ✅ (ImageGenerationTool) |
| Hardware I/O | ❌ | ❌ | ✅ (I2C/SPI) | ❌ | ❌ | ❌ | ✅ (Home Assistant) | ❌ |
| Code execution | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (Python RPC) | ✅ (CodeInterpreterTool) |
| MCP support | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ (local + hosted) |

### Sandboxing Spectrum

| Framework | Isolation Level | Technology | Notes |
|-----------|----------------|------------|-------|
| **IronClaw** | **Strongest** | WASM sandbox (Wasmtime) + capability model | Fuel metering, no filesystem, credential injection at boundary |
| **OpenClaw** | **Strong** | Optional Docker sandbox | Multi-layer tool policy pipeline, exec security modes |
| **Hermes Agent** | **Strong** | Docker (cap-drop ALL, no-new-privileges, PID limits) + SSH + Modal | 5 terminal backends with varying isolation levels |
| **Spacebot** | **Moderate** | Process type separation | Channel can't exec, Worker can't access memory, path restrictions |
| **OpenAI Agents SDK** | **Moderate** | Container-based ShellTool + sandbox providers | Docker, E2B, Modal, Vercel, Cloudflare, Daytona sandbox clients |
| **HermitClaw** | **Best-effort** | Command blocklist + Python monkey-patching | Explicitly "not a security boundary" |
| **PicoClaw** | **Basic** | Regex deny patterns (40+ rules) | Workspace restriction, no process isolation |
| **pi** | **None** | No sandboxing | "YOLO by default" -- full filesystem and shell access |

### Tool Definition Patterns

Every framework defines tools as name + JSON schema + execute function -- that's just what LLMs expect. The registration patterns differ though:

- **Registry pattern** (OpenClaw, IronClaw, PicoClaw, Spacebot, Hermes): Tools register in a central registry, filtered by policy before reaching the LLM
- **Direct assembly** (HermitClaw): Tools defined inline as OpenAI function schemas
- **Operations pattern** (pi): Tools wrap pluggable I/O interfaces, enabling tool redirection (e.g., SSH)
- **Declarative pattern** (OpenAI Agents SDK): Tools declared on agent construction via \`tools=[]\` array; the Runner resolves them per turn. Supports \`@function_tool\` decorator (Python) or \`tool()\` builder (JS) for automatic schema generation from type annotations.

## Security

### Security Model Comparison

| Feature | OpenClaw | IronClaw | PicoClaw | HermitClaw | Spacebot | pi | Hermes | Agents SDK |
|---------|----------|----------|----------|------------|----------|----|--------|------------|
| Process sandbox | Docker (optional) | WASM (Wasmtime) | None | Subprocess | Process separation | None | Docker/SSH/Modal | Container ShellTool |
| Credential encryption | N/A | AES at rest, inject at boundary | Plaintext JSON | Env vars only | Encrypted SQLite | Env vars/config | .env (sandboxed from agent) | Env vars |
| Prompt injection defense | External content wrapping | Aho-Corasick + regex detection | None | None | None | None | 25+ pattern scanner | None |
| Leak detection | N/A | Pattern scanning (pre/post request) | None | None | None | None | Memory entry scanning + log redaction | Trace data controls |
| Endpoint allowlisting | N/A | Host + path + method allowlist | None | Command blocklist | Path restrictions | None | Per-platform user allowlists | None |
| Tool policy layers | 5-layer pipeline | Capability-based + approval | AllowFrom per channel | Command blocklist | Process type isolation | None (extension-based) | Dangerous command approval (25+ patterns) | Guardrails (input/output/tool) + approval |
| Exec security modes | deny/allowlist/full | Approval per tool call | Regex deny patterns | Blocklist + env restriction | Workspace restriction | Full access | Confirmation (CLI) / approval (messaging) | needsApproval per tool |

IronClaw goes the deepest on security -- five layers (WASM sandbox, credential injection, prompt injection defense, leak detection, endpoint allowlisting). Hermes Agent adds prompt injection scanning and multi-backend isolation. The OpenAI Agents SDK takes a different angle: guardrails (tripwire-based safety checks at input, output, and tool levels) plus human-in-the-loop tool approval with serializable state.

## LLM Integration

### Provider Support

| Provider | OpenClaw | IronClaw | PicoClaw | HermitClaw | Spacebot | pi | Hermes | Agents SDK |
|----------|----------|----------|----------|------------|----------|----|--------|------------|
| Anthropic | ✅ | ✅ | ✅ (native) | Via OpenRouter | ✅ | ✅ | Via OpenRouter | Via LiteLLM / AI SDK |
| OpenAI | ✅ | ✅ | ✅ | ✅ (primary) | ✅ | ✅ | Via OpenRouter | ✅ (primary, Responses + Chat Completions) |
| Google | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ | Gemini Flash (aux) | Via LiteLLM / AI SDK |
| Ollama | ✅ | ✅ | ✅ | ✅ (custom) | ❌ | ✅ | ✅ (custom endpoint) | Via LiteLLM |
| OpenRouter | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ (primary, 200+ models) | Via LiteLLM |
| Groq | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ | Via OpenRouter | Via LiteLLM |
| DeepSeek | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | Via OpenRouter | Via LiteLLM |
| Bedrock | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | Via LiteLLM |
| Chinese providers | ❌ | ❌ | ✅ (Zhipu, Moonshot, etc.) | ❌ | ✅ (Zhipu) | ❌ | Via OpenRouter | Via LiteLLM |
| Provider count | 7+ | 5 | 15+ | 3 | 11 | 10+ | 200+ (via OpenRouter) | 100+ (via LiteLLM) |

### Resilience Features

| Feature | OpenClaw | IronClaw | PicoClaw | HermitClaw | Spacebot | pi | Hermes | Agents SDK |
|---------|----------|----------|----------|------------|----------|----|--------|------------|
| Streaming | ✅ | ✅ | ❌ | ❌ | ❌ (stubbed) | ✅ | ❌ (complete before send) | ✅ (RunResultStreaming) |
| Fallback chains | ✅ | ✅ (circuit breaker) | ✅ | ❌ | ✅ | ✅ | Graceful tool failure | ✅ (retry with backoff + jitter) |
| Cost tracking | ✅ (per-message) | ✅ (Decimal precision) | ❌ | ❌ | ❌ | ✅ (per-message) | ✅ (per-session) | ✅ (Usage tracking) |
| Auth rotation | ✅ (multi-key) | ❌ | ❌ | ❌ | ❌ | ❌ | OAuth token management | ❌ |
| Context handoff | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (cross-provider) | ❌ | ✅ (handoffs between agents) |

pi does something no other framework does here: you can start a session with Claude, switch to GPT mid-conversation, and continue with Gemini. It handles the message format conversion automatically. The Agents SDK's handoffs are between agents, not providers -- a different concept entirely.

## Multi-Channel Support

| Platform | OpenClaw | IronClaw | PicoClaw | HermitClaw | Spacebot | pi | Hermes | Agents SDK |
|----------|----------|----------|----------|------------|----------|----|--------|------------|
| CLI/REPL | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ (TUI) | ✅ (TUI) | ✅ (run_demo_loop) |
| Telegram | ✅ | ✅ (WASM) | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ |
| Discord | ✅ | ✅ (WASM) | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ |
| Slack | ✅ | ✅ (WASM) | ✅ | ❌ | ✅ | ✅ (mom) | ✅ | ❌ |
| WhatsApp | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ (Node bridge) | ❌ |
| Signal | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| iMessage | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Web UI | ✅ | ✅ | ❌ | ✅ (pixel art) | ✅ | ✅ (web-ui) | ❌ | ❌ |
| Home Assistant | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| QQ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| DingTalk | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Feishu/Lark | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| LINE | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Realtime/Voice | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (WebRTC, WebSocket, SIP) |
| **Total** | **7** | **4-5** | **10** | **1** | **4** | **3-4** | **6** | **1-2** |

PicoClaw leads with 10 channels -- mostly because of Chinese platform support (QQ, DingTalk, Feishu, OneBot). OpenClaw has the broadest Western platform coverage at 7. Hermes covers the core Western platforms plus Home Assistant for IoT.

The OpenAI Agents SDK is a library, not an application, so it doesn't ship platform adapters. What it does have is a Realtime API integration for voice agents (WebRTC, WebSocket, SIP) that you wire into your own app.

### Channel Abstraction Patterns

Every multi-channel framework abstracts messaging behind a common interface:

- **OpenClaw**: \`ChannelPlugin\` with optional adapters (setup, status, auth, messaging, streaming, etc.)
- **IronClaw**: \`Channel\` trait (\`start() -> MessageStream\`, \`respond()\`, \`health_check()\`)
- **PicoClaw**: \`Channel\` interface (Name/Start/Stop/Send/IsAllowed)
- **Spacebot**: \`Messaging\` trait (start/respond/broadcast/fetch_history)
- **Hermes Agent**: \`BasePlatformAdapter\` ABC producing normalized \`MessageEvent\` dataclass

## Identity & Personality

| Framework | Identity Source | Personality Mechanism | Unique Aspect |
|-----------|---------------|----------------------|---------------|
| **OpenClaw** | SOUL.md + AGENTS.md + USER.md + MEMORY.md | Workspace files injected into system prompt | Heartbeat system for continuous presence |
| **IronClaw** | SOUL.md + AGENTS.md + USER.md + VOICE.md | Workspace filesystem in system prompt | Voice profile in VOICE.md |
| **PicoClaw** | SOUL.md + AGENTS.md + USER.md + IDENTITY.md | Files + memory context in system prompt | OpenClaw-compatible workspace migration |
| **HermitClaw** | identity.json (genome-derived) | Cryptographic trait derivation from keyboard entropy | Personality is deterministic from a 32-byte genome |
| **Spacebot** | SOUL.md + IDENTITY.md + USER.md | Files + pre-computed memory bulletin | Per-process model routing (different models for different tasks) |
| **pi** | ~150 word default + AGENTS.md | Minimal system prompt, extensible via extensions | Stealth mode (mimics Claude Code tool names) |
| **Hermes Agent** | SOUL.md + AGENTS.md + USER.md + MEMORY.md | Workspace files + skills injected into system prompt | Skills system (agentskills.io compatible markdown docs with progressive disclosure) |
| **OpenAI Agents SDK** | Code-defined instructions string/function | Dynamic instructions via RunContext | Server-managed Prompt objects for centralized prompt management |

## Resource Footprint

| Framework | RAM (typical) | Boot Time | Binary/Install Size | External Dependencies |
|-----------|--------------|-----------|--------------------|-----------------------|
| **OpenClaw** | ~1GB+ | 5-10s | ~200MB (node_modules) | Node.js, npm |
| **IronClaw** | ~50-200MB | 1-3s | ~20-50MB binary | PostgreSQL (optional) |
| **PicoClaw** | <10MB | <1s | ~15-25MB binary | None (single static binary) |
| **HermitClaw** | ~100-200MB | 2-5s | ~50MB (Python + deps) | Python, pip |
| **Spacebot** | ~50-200MB | 1-3s | ~20-50MB binary | None (single Rust binary) |
| **pi** | ~200-500MB | 2-5s | ~100MB (node_modules) | Node.js, npm |
| **Hermes Agent** | ~200-500MB | 2-5s | ~100MB (Python + deps) | Python, pip, many optional services |
| **OpenAI Agents SDK** | ~50-200MB | <1s | ~20MB (pip) / ~10MB (npm) | Python or Node.js; OpenAI API key |

PicoClaw wins on footprint by a wide margin -- it was designed for $10 single-board computers, and it shows. The Agents SDK is light as a library, but it still needs an LLM API connection to do anything.

## Best For: When to Use Which

| If you want... | Use this framework | Why |
|----------------|-------------------|-----|
| Personal assistant across all messaging platforms | **OpenClaw** | 7 channels, rich tool suite, production-hardened |
| Maximum security for agent tool execution | **IronClaw** | 5-layer security with WASM sandbox, leak detection |
| Agent on embedded/IoT hardware | **PicoClaw** | <10MB RAM, single binary, I2C/SPI hardware tools |
| Autonomous research agent / digital pet | **HermitClaw** | Continuous thinking loop, Generative Agents memory |
| Multi-user team agent (Discord/Slack server) | **Spacebot** | Concurrent delegation model, multi-agent support |
| Minimalist coding assistant | **pi (pi.dev)** | 4 tools, cross-provider handoff, powerful extension system |
| Self-improving personal agent with skills | **Hermes Agent** | Persistent memory, skills system, cron, 5 terminal backends |
| Multi-agent workflows in your own app | **OpenAI Agents SDK** | Handoffs, guardrails, human-in-the-loop, serializable state |
| Learning agent architecture basics | **HermitClaw** or **PicoClaw** | Smallest codebases, easiest to read |
| Building a custom agent framework | **pi (pi.dev)** | Clean extension system, pluggable operations pattern |
| Maximum LLM provider support | **Hermes Agent** | 200+ models via OpenRouter |
| Production multi-agent with typed safety | **OpenAI Agents SDK** | Type-safe context, structured output, tracing, 10+ session backends |
| Voice / realtime agents | **OpenAI Agents SDK** | Voice pipeline (Python), Realtime API, WebRTC/SIP (JS) |
`;

export default function ComparisonPage() {
  const headings = extractHeadings(content);
  return <ComparisonClient content={content} headings={headings} />;
}
