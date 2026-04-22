export interface Framework {
  id: string;
  name: string;
  tagline: string;
  language: string;
  color: string;
  colorVar: string;
  colorClass: string;
  icon: string;
}

export const frameworks: Framework[] = [
  {
    id: 'openclaw',
    name: 'OpenClaw',
    tagline: 'Multi-channel personal AI gateway',
    language: 'TypeScript',
    color: 'var(--color-openclaw)',
    colorVar: 'openclaw',
    colorClass: 'text-[var(--color-openclaw)]',
    icon: '🦀',
  },
  {
    id: 'ironclaw',
    name: 'IronClaw',
    tagline: 'Security-first Rust agent framework',
    language: 'Rust',
    color: 'var(--color-ironclaw)',
    colorVar: 'ironclaw',
    colorClass: 'text-[var(--color-ironclaw)]',
    icon: '🛡️',
  },
  {
    id: 'picoclaw',
    name: 'PicoClaw',
    tagline: 'Ultra-lightweight embedded agent',
    language: 'Go',
    color: 'var(--color-picoclaw)',
    colorVar: 'picoclaw',
    colorClass: 'text-[var(--color-picoclaw)]',
    icon: '🔬',
  },
  {
    id: 'hermitclaw',
    name: 'HermitClaw',
    tagline: 'Autonomous research tamagotchi',
    language: 'Python',
    color: 'var(--color-hermitclaw)',
    colorVar: 'hermitclaw',
    colorClass: 'text-[var(--color-hermitclaw)]',
    icon: '🐚',
  },
  {
    id: 'spacebot',
    name: 'Spacebot',
    tagline: 'Multi-agent delegation framework',
    language: 'Rust',
    color: 'var(--color-spacebot)',
    colorVar: 'spacebot',
    colorClass: 'text-[var(--color-spacebot)]',
    icon: '🚀',
  },
  {
    id: 'pi-dev',
    name: 'pi (pi.dev)',
    tagline: 'Minimalist coding agent CLI',
    language: 'TypeScript',
    color: 'var(--color-pidev)',
    colorVar: 'pidev',
    colorClass: 'text-[var(--color-pidev)]',
    icon: '⚡',
  },
  {
    id: 'hermes-agent',
    name: 'Hermes Agent',
    tagline: 'Personal autonomous agent with persistent memory',
    language: 'Python',
    color: 'var(--color-hermes)',
    colorVar: 'hermes',
    colorClass: 'text-[var(--color-hermes)]',
    icon: '🪶',
  },
];

export function getFramework(id: string): Framework | undefined {
  return frameworks.find((f) => f.id === id);
}
