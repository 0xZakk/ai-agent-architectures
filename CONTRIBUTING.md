# Contributing

Thanks for your interest in contributing to AI Agent Architectures!

## Suggesting a Framework

If there's an AI agent framework or harness you'd like to see analyzed, [open an issue](https://github.com/0xZakk/ai-agent-architectures/issues/new) and include:

- **Name** of the framework
- **Link** to the repository
- **Brief description** of what it does and why it's worth analyzing (e.g. novel architecture, unique approach to memory/tools/security, growing adoption)

## Submitting an Analysis

If you'd like to write an analysis yourself:

1. Use the template in [`analysis-prompt.md`](analysis-prompt.md) as a guide for what to cover
2. Write your analysis as a markdown file in the `analyses/` directory, named `<slug>.md`
3. Add the framework metadata to `site/src/lib/frameworks.ts`
4. Open a pull request

Each analysis should be thorough and reference specific files, functions, and code patterns from the framework's source. Include Mermaid diagrams and code snippets where they help illustrate the architecture.

## Running the Site Locally

```bash
npm install
npm run dev
```

The site will be available at [http://localhost:3000](http://localhost:3000).
