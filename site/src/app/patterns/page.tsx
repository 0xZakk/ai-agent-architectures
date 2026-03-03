import PatternsClient from './PatternsClient';
import { extractHeadings } from '@/lib/markdown';

const content = `
## The Agent Loop

The most fundamental pattern: call LLM with context and tool definitions, execute any tool calls, feed results back, repeat until the LLM produces a final text response.

Every framework implements this, but with variations:

### Variation 1: Simple Sequential Loop

Used by **PicoClaw**, **HermitClaw**, and the core of **IronClaw**.

\`\`\`
while true:
    response = llm.call(messages, tools)
    if response.has_tool_calls:
        for tool_call in response.tool_calls:
            result = execute(tool_call)
            messages.append(tool_result(result))
    else:
        return response.text
\`\`\`

Simple, easy to reason about, but blocks on each tool call. Good enough for most cases.

### Variation 2: Lane-Queued Loop

Used by **OpenClaw**. Each session gets its own queue lane, and there's a global lane for concurrency control. The LLM call is double-enqueued: first into the session lane (serialization), then the global lane (concurrency limit).

This prevents two messages to the same session from racing, while still allowing different sessions to run in parallel.

### Variation 3: Steering + Follow-up Queues

Used by **pi**. The loop checks two additional queues between iterations:
- **Steering messages**: Injected mid-execution (user interrupts)
- **Follow-up messages**: Checked when the agent would stop (queued user input)

This makes the agent responsive to user input even during long tool execution chains.

### Variation 4: Delegation Loop

Used by **Spacebot**. The Channel's "loop" is actually an event listener. It calls the LLM, but the LLM's tools are \`branch\`, \`spawn_worker\`, \`reply\`, \`skip\` -- not \`exec\` or \`read\`. Work happens in spawned tasks that send completion events back to the Channel.

### Variation 5: Continuous Autonomous Loop

Used by **HermitClaw**. The loop runs every 5 seconds regardless of user input. It builds context from recent thoughts, retrieved memories, and any mood/nudge, then thinks. Human messages are injected as "overheard" nudges rather than driving the loop.

## Memory Retrieval Patterns

### Pattern 1: Hybrid Search with Reciprocal Rank Fusion (RRF)

Used by **OpenClaw**, **IronClaw**, **Spacebot**.

Combines full-text search (BM25/FTS) and vector similarity search, then merges results:

\`\`\`
rrf_score(item) = Σ 1/(k + rank_in_list)
\`\`\`

Items appearing in both FTS and vector results get boosted scores. Default k=60 prevents any single high-ranked result from dominating. Spacebot adds a third signal: graph traversal from high-importance seed memories.

### Pattern 2: Three-Factor Scoring

Used by **HermitClaw** (from the Generative Agents paper).

\`\`\`
score = recency + importance + relevance
\`\`\`

- **Recency**: Exponential decay over hours (\`exp(-(1-decay) * hours)\`)
- **Importance**: LLM-scored 1-10, normalized to 0-1
- **Relevance**: Cosine similarity of embeddings

Simple sum, each factor ~0-1. A memory surfaces if it just happened, was important, or is semantically relevant.

### Pattern 3: Pre-computed Bulletins

Used by **Spacebot** (Cortex system).

Rather than searching memory at conversation time, a background process periodically synthesizes a "bulletin" from memory across 8 dimensions (identity, recent, decisions, importance, preferences, goals, events, observations). The bulletin is stored in an \`ArcSwap\` and injected into every system prompt.

Cost of retrieval is amortized. No conversation ever pays the latency of a memory search.

### Pattern 4: File Injection (No Search)

Used by **PicoClaw**, **pi**.

No embeddings, no vector DB. Memory is markdown files (\`MEMORY.md\`, \`AGENTS.md\`) injected directly into the system prompt. The LLM can read other files via tools. Works surprisingly well within context window limits.

## Tool Sandboxing Spectrum

From most to least isolated:

### Level 1: WASM Sandbox (IronClaw)

Untrusted tools compile to WASM components running in Wasmtime:
- Fuel metering (CPU bounded)
- No filesystem access
- Deny-by-default capabilities
- Secrets injected at host boundary (WASM never sees credentials)
- Endpoint allowlisting for HTTP requests

### Level 2: Container Sandbox (OpenClaw)

Optional Docker containers for tool execution:
- Filesystem access controls (rw/ro/none)
- Multi-layer tool policy pipeline (owner, group, subagent, sandbox, allowlist)
- Three exec security modes: deny, allowlist, full

### Level 3: Process Separation (Spacebot)

Not a sandbox per se, but the Channel (user-facing) has no exec/file tools. Workers have file/shell but no memory tools. Branches have memory but no file/shell. Separation of concerns prevents tool misuse.

### Level 4: Best-effort Blocklists (HermitClaw, PicoClaw)

Command blocklists (regex patterns) that reject dangerous commands (\`sudo\`, \`rm -rf\`, etc.). HermitClaw adds Python monkey-patching (\`builtins.open\` checked, \`subprocess\` poisoned). Both explicitly acknowledge these are bypassable.

### Level 5: No Sandboxing (pi)

Full filesystem and shell access. "YOLO by default." Security is left to extensions (e.g., a \`timed-confirm\` extension that prompts before tool execution).

## Channel Abstraction Patterns

### The Common Interface

All multi-channel frameworks converge on a similar abstraction:

\`\`\`
interface Channel {
    name(): string
    start(): MessageStream
    respond(message, response): void
    stop(): void
}
\`\`\`

Channels produce inbound messages and consume outbound responses. The core agent loop is channel-agnostic.

### Merging Strategies

- **Stream merging** (IronClaw): \`futures::stream::select_all\` merges all channel streams into one
- **Message bus** (PicoClaw): Channels publish to a central Go channel, agent consumes from it
- **Channel manager** (OpenClaw, Spacebot): Manager routes messages to/from channels, handles lifecycle

### Session Key Routing

Messages must be routed to the correct session. Common pattern:

\`\`\`
session_key = "{agent}:{channel}:{chat_type}:{chat_id}"
// e.g., "agent:main:telegram:dm:123456789"
\`\`\`

Used by OpenClaw, PicoClaw. Spacebot uses "bindings" that map platform conversations to agents.

## Context Window Management

### Strategy 1: LLM Summarization (Most frameworks)

When tokens approach the limit, older messages are summarized by the LLM itself. The summary replaces the original messages.

- **OpenClaw**: Chunks messages, summarizes each chunk, replaces with summary. 40% chunk ratio, 20% safety margin.
- **PicoClaw**: Summarizes when >20 messages or >75% tokens. Emergency: drops oldest 50%.
- **pi**: Compaction with file tracking -- tracks which files were read/modified across compaction boundaries.

### Strategy 2: Tiered Compaction (Spacebot)

Three thresholds with escalating response:
- **80%**: Background worker summarizes oldest 30% of messages
- **85%**: Aggressive -- summarize 50%
- **95%**: Emergency truncation (no LLM call) -- drop oldest 50%

Workers self-compact in 25-turn segments. On context overflow from provider, compact 75% and retry.

### Strategy 3: No Management (HermitClaw)

Memory stream grows unboundedly. Context window managed by limiting \`max_thoughts_in_context\` (default 4) and relying on retrieval to surface relevant memories.

### Strategy 4: Session Branching (pi)

When context is about to fill, pi can branch the session -- creating a new conversation fork with a summary of the previous context. The tree structure means you can navigate back.

## The Workspace Convention

A cross-cutting pattern that emerged independently across frameworks:

The agent's identity, instructions, and persistent memory live in **markdown files in a workspace directory**, injected into the system prompt at the start of every LLM call.

This is simple, debuggable, human-editable, and works with any LLM. Five of six frameworks use it. The files are:
- \`AGENTS.md\` -- how to behave (meta-instructions)
- \`SOUL.md\` -- who you are (personality)
- \`USER.md\` -- who the human is
- \`MEMORY.md\` -- what to remember

The agent can modify these files itself, creating a feedback loop where the agent shapes its own personality and memory over time.
`;

export default function PatternsPage() {
  const headings = extractHeadings(content);
  return <PatternsClient content={content} headings={headings} />;
}
