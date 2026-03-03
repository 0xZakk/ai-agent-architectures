export interface Framework {
  id: string;
  name: string;
  tagline: string;
  language: string;
  color: string;
  colorClass: string;
  icon: string;
}

export const frameworks: Framework[] = [
  {
    id: 'openclaw',
    name: 'OpenClaw',
    tagline: 'Multi-channel personal AI gateway',
    language: 'TypeScript',
    color: '#7c8af6',
    colorClass: 'text-[#7c8af6]',
    icon: '🦀',
  },
  {
    id: 'ironclaw',
    name: 'IronClaw',
    tagline: 'Security-first Rust agent framework',
    language: 'Rust',
    color: '#f6845c',
    colorClass: 'text-[#f6845c]',
    icon: '🛡️',
  },
  {
    id: 'picoclaw',
    name: 'PicoClaw',
    tagline: 'Ultra-lightweight embedded agent',
    language: 'Go',
    color: '#4ccf8e',
    colorClass: 'text-[#4ccf8e]',
    icon: '🔬',
  },
  {
    id: 'hermitclaw',
    name: 'HermitClaw',
    tagline: 'Autonomous research tamagotchi',
    language: 'Python',
    color: '#c084fc',
    colorClass: 'text-[#c084fc]',
    icon: '🐚',
  },
  {
    id: 'spacebot',
    name: 'Spacebot',
    tagline: 'Multi-agent delegation framework',
    language: 'Rust',
    color: '#38bdf8',
    colorClass: 'text-[#38bdf8]',
    icon: '🚀',
  },
  {
    id: 'pi-dev',
    name: 'pi (pi.dev)',
    tagline: 'Minimalist coding agent CLI',
    language: 'TypeScript',
    color: '#fb923c',
    colorClass: 'text-[#fb923c]',
    icon: '⚡',
  },
  {
    id: 'hermes-agent',
    name: 'Hermes Agent',
    tagline: 'Personal autonomous agent with persistent memory',
    language: 'Python',
    color: '#e879f9',
    colorClass: 'text-[#e879f9]',
    icon: '🪶',
  },
];

export function getFramework(id: string): Framework | undefined {
  return frameworks.find((f) => f.id === id);
}
