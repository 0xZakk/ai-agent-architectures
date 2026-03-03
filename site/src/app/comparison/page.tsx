import ComparisonClient from './ComparisonClient';
import { extractHeadings } from '@/lib/markdown';

const content = `
## Architecture

### Core Loop Patterns

Each framework takes a fundamentally different approach to its main execution loop:

| Framework | Loop Pattern | Language | Concurrency Model |
|-----------|-------------|----------|-------------------|
| **OpenClaw** | Event-driven request-response with async tool loops | TypeScript | Lane-based command queues (per-session + global) |
| **IronClaw** | Event-driven message loop with \`tokio::select!\` | Rust | Single async loop, tools in-line |
| **PicoClaw** | Message bus with goroutine consumers | Go | Goroutines + channel-based bus |
| **HermitClaw** | Continuous autonomous loop (5s tick) | Python | Single asyncio task per crab |
| **Spacebot** | Concurrent process model (Channel/Branch/Worker) | Rust | \`tokio::spawn\` per process, broadcast events |
| **pi (pi.dev)** | Classic agentic loop with steering queues | TypeScript | Single-threaded with interrupt queues |

**Request-response** (OpenClaw, IronClaw, PicoClaw, pi): The agent waits for input, processes it through an LLM + tool loop, returns a response. This is the dominant pattern.

**Continuous** (HermitClaw): The agent thinks on its own, continuously, with no human trigger. Every 5 seconds it runs a think cycle, picks topics, researches, writes. Human messages are "overheard" as nudges.

**Delegation** (Spacebot): The user-facing Channel never executes work -- it dispatches to Branches (thinking) and Workers (execution) that run as concurrent tasks. Results flow back as events.

### Module Structure Comparison

| Framework | Source Files | Lines (est.) | Key Abstraction |
|-----------|-------------|-------------|-----------------|
| **OpenClaw** | ~2,100 TS | ~100K+ | Channel plugins, tool registry, session lanes |
| **IronClaw** | ~88 RS | ~30K+ | Trait-based tools/channels, WASM sandbox |
| **PicoClaw** | ~125 Go | ~20K | Interface-based tools/channels, message bus |
| **HermitClaw** | ~14 Py | ~3K | Single Brain class, memory stream |
| **Spacebot** | ~88 RS | ~25K+ | Process types (Channel/Branch/Worker), memory graph |
| **pi (pi.dev)** | ~50 TS | ~15K+ | Operations interfaces, extension events |

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

### Memory Retrieval Approaches

**Hybrid Search (RRF)** -- Used by OpenClaw, IronClaw, and Spacebot. Combines full-text search (BM25/FTS) with vector similarity, merging results via Reciprocal Rank Fusion. Items appearing in both result sets get boosted scores.

**Three-Factor Retrieval** -- HermitClaw's approach from the Generative Agents paper: \`score = recency + importance + relevance\`. Each factor ranges 0-1, recency decays exponentially, importance is LLM-scored 1-10, relevance is cosine similarity.

**No Retrieval** -- PicoClaw and pi have no semantic search. PicoClaw injects MEMORY.md + last 3 days into the system prompt. pi relies on AGENTS.md context files and the LLM reading files via tools.

### The Workspace File Pattern

Five of six frameworks use a shared pattern for persistent identity and memory:

| File | Purpose | Used By |
|------|---------|---------|
| \`AGENTS.md\` | Operational instructions | OpenClaw, IronClaw, PicoClaw, Spacebot, pi |
| \`SOUL.md\` | Personality/values | OpenClaw, IronClaw, PicoClaw, Spacebot |
| \`USER.md\` | Info about the human | OpenClaw, IronClaw, PicoClaw, Spacebot |
| \`MEMORY.md\` | Curated long-term memory | OpenClaw, IronClaw, PicoClaw |
| \`memory/YYYY-MM-DD.md\` | Daily logs | OpenClaw, IronClaw, PicoClaw |

HermitClaw is the outlier -- it uses \`identity.json\` (genome-derived traits) and \`memory_stream.jsonl\` (append-only with embeddings) instead.

## Tool / Function Calling

### Tool Inventory

| Tool Category | OpenClaw | IronClaw | PicoClaw | HermitClaw | Spacebot | pi |
|--------------|----------|----------|----------|------------|----------|----|
| Shell exec | ✅ | ✅ | ✅ | ✅ (sandboxed) | ✅ (worker) | ✅ |
| File R/W | ✅ | ✅ | ✅ | Via shell | ✅ (worker) | ✅ |
| File edit | ✅ | Via write | ✅ | Via shell | Via file tool | ✅ |
| Web search | ✅ | ✅ | ✅ | ✅ (OpenAI built-in) | ✅ (worker) | Via extension |
| Web fetch | ✅ | ✅ | ✅ | ✅ | Via shell | Via extension |
| Browser automation | ✅ (Playwright) | ❌ | ❌ | ❌ | ✅ (headless Chrome) | Via extension |
| Memory search | ✅ | ✅ | ❌ | Automatic (retrieval) | ✅ (branch) | ❌ |
| Message/channel | ✅ | Via channels | ✅ | ✅ (respond) | ✅ (reply) | Via extension |
| Sub-agents | ✅ | ❌ | ✅ | ❌ | ✅ (branch/worker) | Via extension |
| Cron/scheduling | ✅ | ✅ (routines) | ✅ | ❌ | ✅ | Via extension |
| TTS | ✅ | ❌ | ❌ | ❌ | ❌ | Via extension |
| Image analysis | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ (read) |
| Hardware I/O | ❌ | ❌ | ✅ (I2C/SPI) | ❌ | ❌ | ❌ |
| Movement/position | ❌ | ❌ | ❌ | ✅ (room) | ❌ | ❌ |

### Sandboxing Spectrum

| Framework | Isolation Level | Technology | Notes |
|-----------|----------------|------------|-------|
| **IronClaw** | **Strongest** | WASM sandbox (Wasmtime) + capability model | Fuel metering, no filesystem, credential injection at boundary |
| **OpenClaw** | **Strong** | Optional Docker sandbox | Multi-layer tool policy pipeline, exec security modes |
| **Spacebot** | **Moderate** | Process type separation | Channel can't exec, Worker can't access memory, path restrictions |
| **HermitClaw** | **Best-effort** | Command blocklist + Python monkey-patching | Explicitly "not a security boundary" |
| **PicoClaw** | **Basic** | Regex deny patterns (40+ rules) | Workspace restriction, no process isolation |
| **pi** | **None** | No sandboxing | "YOLO by default" -- full filesystem and shell access |

### Tool Definition Patterns

All six frameworks define tools as name + JSON schema + execute function, matching the LLM tool-calling convention. But the registration patterns differ:

- **Registry pattern** (OpenClaw, IronClaw, PicoClaw, Spacebot): Tools register in a central registry, filtered by policy before reaching the LLM
- **Direct assembly** (HermitClaw): Tools defined inline as OpenAI function schemas
- **Operations pattern** (pi): Tools wrap pluggable I/O interfaces, enabling tool redirection (e.g., SSH)

## Security

### Security Model Comparison

| Feature | OpenClaw | IronClaw | PicoClaw | HermitClaw | Spacebot | pi |
|---------|----------|----------|----------|------------|----------|----|
| Process sandbox | Docker (optional) | WASM (Wasmtime) | None | Subprocess | Process separation | None |
| Credential encryption | N/A | AES at rest, inject at boundary | Plaintext JSON | Env vars only | Encrypted SQLite | Env vars/config |
| Prompt injection defense | External content wrapping | Aho-Corasick + regex detection | None | None | None | None |
| Leak detection | N/A | Pattern scanning (pre/post request) | None | None | None | None |
| Endpoint allowlisting | N/A | Host + path + method allowlist | None | Command blocklist | Path restrictions | None |
| Tool policy layers | 5-layer pipeline | Capability-based + approval | AllowFrom per channel | Command blocklist | Process type isolation | None (extension-based) |
| Exec security modes | deny/allowlist/full | Approval per tool call | Regex deny patterns | Blocklist + env restriction | Workspace restriction | Full access |
| Security audit | Built-in audit system | Comprehensive test suite | N/A | N/A | N/A | N/A |

IronClaw's security is the standout -- five layers deep (WASM sandbox, credential injection, prompt injection defense, leak detection, endpoint allowlisting). OpenClaw has the most configurable policy system. The rest range from basic to nonexistent.

## LLM Integration

### Provider Support

| Provider | OpenClaw | IronClaw | PicoClaw | HermitClaw | Spacebot | pi |
|----------|----------|----------|----------|------------|----------|----|
| Anthropic | ✅ | ✅ | ✅ (native) | Via OpenRouter | ✅ | ✅ |
| OpenAI | ✅ | ✅ | ✅ | ✅ (primary) | ✅ | ✅ |
| Google | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Ollama | ✅ | ✅ | ✅ | ✅ (custom) | ❌ | ✅ |
| OpenRouter | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Groq | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| DeepSeek | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ |
| Bedrock | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Chinese providers | ❌ | ❌ | ✅ (Zhipu, Moonshot, etc.) | ❌ | ✅ (Zhipu) | ❌ |
| Provider count | 7+ | 5 | 15+ | 3 | 11 | 10+ |

### Resilience Features

| Feature | OpenClaw | IronClaw | PicoClaw | HermitClaw | Spacebot | pi |
|---------|----------|----------|----------|------------|----------|----|
| Streaming | ✅ | ✅ | ❌ | ❌ | ❌ (stubbed) | ✅ |
| Fallback chains | ✅ | ✅ (circuit breaker) | ✅ | ❌ | ✅ | ✅ |
| Cost tracking | ✅ (per-message) | ✅ (Decimal precision) | ❌ | ❌ | ❌ | ✅ (per-message) |
| Auth rotation | ✅ (multi-key) | ❌ | ❌ | ❌ | ❌ | ❌ |
| Context handoff | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (cross-provider) |

pi's cross-provider context handoff is unique -- you can start with Claude, switch to GPT mid-session, and continue with Gemini, with automatic message format conversion.

## Multi-Channel Support

| Platform | OpenClaw | IronClaw | PicoClaw | HermitClaw | Spacebot | pi |
|----------|----------|----------|----------|------------|----------|----|
| CLI/REPL | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ (TUI) |
| Telegram | ✅ | ✅ (WASM) | ✅ | ❌ | ✅ | ❌ |
| Discord | ✅ | ✅ (WASM) | ✅ | ❌ | ✅ | ❌ |
| Slack | ✅ | ✅ (WASM) | ✅ | ❌ | ✅ | ✅ (mom) |
| WhatsApp | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Signal | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| iMessage | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Web UI | ✅ | ✅ | ❌ | ✅ (pixel art) | ✅ | ✅ (web-ui) |
| QQ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| DingTalk | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Feishu/Lark | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| LINE | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Total** | **7** | **4-5** | **10** | **1** | **4** | **3-4** |

PicoClaw leads with 10 channels, largely because of Chinese platform support (QQ, DingTalk, Feishu, OneBot). OpenClaw has the broadest Western platform coverage with 7 channels.

### Channel Abstraction Patterns

All multi-channel frameworks abstract messaging via a common interface:

- **OpenClaw**: \`ChannelPlugin\` with optional adapters (setup, status, auth, messaging, streaming, etc.)
- **IronClaw**: \`Channel\` trait (\`start() -> MessageStream\`, \`respond()\`, \`health_check()\`)
- **PicoClaw**: \`Channel\` interface (Name/Start/Stop/Send/IsAllowed)
- **Spacebot**: \`Messaging\` trait (start/respond/broadcast/fetch_history)

## Identity & Personality

| Framework | Identity Source | Personality Mechanism | Unique Aspect |
|-----------|---------------|----------------------|---------------|
| **OpenClaw** | SOUL.md + AGENTS.md + USER.md + MEMORY.md | Workspace files injected into system prompt | Heartbeat system for continuous presence |
| **IronClaw** | SOUL.md + AGENTS.md + USER.md + VOICE.md | Workspace filesystem in system prompt | Voice profile in VOICE.md |
| **PicoClaw** | SOUL.md + AGENTS.md + USER.md + IDENTITY.md | Files + memory context in system prompt | OpenClaw-compatible workspace migration |
| **HermitClaw** | identity.json (genome-derived) | Cryptographic trait derivation from keyboard entropy | Personality is deterministic from a 32-byte genome |
| **Spacebot** | SOUL.md + IDENTITY.md + USER.md | Files + pre-computed memory bulletin | Per-process model routing (different models for different tasks) |
| **pi** | ~150 word default + AGENTS.md | Minimal system prompt, extensible via extensions | Stealth mode (mimics Claude Code tool names) |

## Resource Footprint

| Framework | RAM (typical) | Boot Time | Binary/Install Size | External Dependencies |
|-----------|--------------|-----------|--------------------|-----------------------|
| **OpenClaw** | ~1GB+ | 5-10s | ~200MB (node_modules) | Node.js, npm |
| **IronClaw** | ~50-200MB | 1-3s | ~20-50MB binary | PostgreSQL (optional) |
| **PicoClaw** | <10MB | <1s | ~15-25MB binary | None (single static binary) |
| **HermitClaw** | ~100-200MB | 2-5s | ~50MB (Python + deps) | Python, pip |
| **Spacebot** | ~50-200MB | 1-3s | ~20-50MB binary | None (single Rust binary) |
| **pi** | ~200-500MB | 2-5s | ~100MB (node_modules) | Node.js, npm |

PicoClaw is the clear winner here -- designed explicitly for $10 SBCs with <10MB RAM and sub-second boot.

## Best For: When to Use Which

| If you want... | Use this framework | Why |
|----------------|-------------------|-----|
| Personal assistant across all messaging platforms | **OpenClaw** | 7 channels, rich tool suite, production-hardened |
| Maximum security for agent tool execution | **IronClaw** | 5-layer security with WASM sandbox, leak detection |
| Agent on embedded/IoT hardware | **PicoClaw** | <10MB RAM, single binary, I2C/SPI hardware tools |
| Autonomous research agent / digital pet | **HermitClaw** | Continuous thinking loop, Generative Agents memory |
| Multi-user team agent (Discord/Slack server) | **Spacebot** | Concurrent delegation model, multi-agent support |
| Minimalist coding assistant | **pi (pi.dev)** | 4 tools, cross-provider handoff, powerful extension system |
| Learning agent architecture basics | **HermitClaw** or **PicoClaw** | Smallest codebases, easiest to read |
| Building a custom agent framework | **pi (pi.dev)** | Clean extension system, pluggable operations pattern |
| Maximum LLM provider support | **PicoClaw** | 15+ providers including Chinese platforms |
`;

export default function ComparisonPage() {
  const headings = extractHeadings(content);
  return <ComparisonClient content={content} headings={headings} />;
}
