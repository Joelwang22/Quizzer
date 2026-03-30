export interface StoryCastMember {
  id: string;
  name: string;
  title: string;
  role: string;
  blurb: string;
  spriteSheet: string;
  accentClassName: string;
}

export const STORY_CAST: StoryCastMember[] = [
  {
    id: 'marty-bell',
    name: 'Marty Bell',
    title: 'Branch Director',
    role: 'overconfident manager',
    blurb: 'Treats risk like a morale issue until the incident reaches the monthly numbers deck.',
    spriteSheet: '/story-cast/marty-bell-idle.svg',
    accentClassName: 'text-rose-300',
  },
  {
    id: 'priya-nair',
    name: 'Priya Nair',
    title: 'IT Manager',
    role: 'competent cleanup crew',
    blurb: 'The one person who understands the environment and is tired of being proven right.',
    spriteSheet: '/story-cast/priya-nair-idle.svg',
    accentClassName: 'text-cyan-300',
  },
  {
    id: 'glen-foster',
    name: 'Glen Foster',
    title: 'Sales Lead',
    role: 'phishing magnet',
    blurb: 'Signs up for every trial, clicks every promo, and believes urgency is a sign of professionalism.',
    spriteSheet: '/story-cast/glen-foster-idle.svg',
    accentClassName: 'text-orange-300',
  },
  {
    id: 'denise-park',
    name: 'Denise Park',
    title: 'Finance Manager',
    role: 'approval chain stress test',
    blurb: 'Exceptionally careful until a fake executive email arrives marked urgent and confidential.',
    spriteSheet: '/story-cast/denise-park-idle.svg',
    accentClassName: 'text-emerald-300',
  },
  {
    id: 'rosa-jimenez',
    name: 'Rosa Jimenez',
    title: 'HR Lead',
    role: 'sensitive data custodian',
    blurb: 'Looks organized, sounds organized, and stores critical documents in folders named final-final-real.',
    spriteSheet: '/story-cast/rosa-jimenez-idle.svg',
    accentClassName: 'text-fuchsia-300',
  },
  {
    id: 'ethan-cole',
    name: 'Ethan Cole',
    title: 'Operations Coordinator',
    role: 'asset sprawl historian',
    blurb: 'Knows where the old badge readers, backup keys, and mystery laptops are buried.',
    spriteSheet: '/story-cast/ethan-cole-idle.svg',
    accentClassName: 'text-amber-300',
  },
  {
    id: 'noah-reed',
    name: 'Noah Reed',
    title: 'Junior Security Analyst',
    role: 'learner point of view',
    blurb: 'Trying to understand security concepts and office politics before either one detonates.',
    spriteSheet: '/story-cast/noah-reed-idle.svg',
    accentClassName: 'text-sky-300',
  },
  {
    id: 'tessa-vale',
    name: 'Tessa Vale',
    title: 'Vendor Representative',
    role: 'third-party risk ambassador',
    blurb: 'Always helpful, always polished, and occasionally attached to the exact shortcut that causes the problem.',
    spriteSheet: '/story-cast/tessa-vale-idle.svg',
    accentClassName: 'text-pink-300',
  },
];
