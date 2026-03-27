# AI Agent Architectures

A deep technical comparison of 7 open-source AI agent frameworks, built for software engineers who want to understand how AI agents work under the hood — and how to build their own.

## Frameworks Analyzed

| Framework | Language | Focus |
|-----------|----------|-------|
| **OpenClaw** | TypeScript | Multi-channel personal AI gateway |
| **IronClaw** | Rust | Security-first agent framework |
| **PicoClaw** | Go | Ultra-lightweight embedded agent |
| **HermitClaw** | Python | Autonomous research tamagotchi |
| **Spacebot** | Rust | Multi-agent delegation framework |
| **pi (pi.dev)** | TypeScript | Minimalist coding agent CLI |
| **Hermes Agent** | Python | Personal autonomous agent with persistent memory |

Each analysis covers architecture, memory systems, tool calling, LLM integration, security, multi-channel support, state management, and more — with annotated code snippets and Mermaid diagrams throughout.

## What's in the Site

- **Individual framework analyses** — 30+ pages each of annotated source code and architecture breakdowns
- **Cross-framework comparison** — synthesized findings across all seven frameworks
- **Architecture patterns** — recurring design themes and trade-offs
- **Build your own guide** — actionable patterns distilled into a practical reference

## Project Structure

```
├── analyses/          # Markdown source for each framework analysis
├── site/              # Next.js site that renders the analyses
│   └── src/
│       ├── app/       # Pages (home, comparison, patterns, build-your-own, framework/[slug])
│       ├── components/
│       └── lib/       # Markdown parsing and framework metadata
├── analysis-prompt.md # Template used to generate each analysis
└── package.json       # Root package.json (proxies to site/)
```

## Getting Started

```bash
# Install dependencies
npm install

# Run the dev server
npm run dev

# Build for production
npm run build
```

The site runs at [http://localhost:3000](http://localhost:3000).

## Adding a New Analysis

1. Write a markdown file in `analyses/` following the template in `analysis-prompt.md`
2. Add the framework metadata to `site/src/lib/frameworks.ts`
3. The site will automatically pick up the new analysis at `/framework/<slug>`

## License

MIT
