export type WindowKind = 'project' | 'image' | 'text' | 'about' | 'notes' | 'trash' | 'browser';

export interface IconLink {
  url: string;
  label?: string;
}

export interface DesktopItem {
  id: string;
  label: string;
  kind: WindowKind;
  windowTitle: string;
  x: number;
  y: number;
  tags?: string[];
  link?: IconLink;
  description?: string;
  textLines?: string[];
}

export interface DockLink {
  id: string;
  label: string;
  href: string;
}

export const desktopItems: DesktopItem[] = [
  {
    id: 'the-view-dao',
    label: 'The View - DAO',
    kind: 'image',
    windowTitle: 'the view - dao',
    x: 4,
    y: 10,
  },
  {
    id: 'body-hommage',
    label: 'Body Hommage',
    kind: 'project',
    windowTitle: 'body hommage',
    x: 26,
    y: 10,
    tags: ['visual branding', 'website design', 'web development with framer'],
    link: { url: 'https://bodyhommage.com' },
  },
  {
    id: 'smiley-txt',
    label: ':).txt',
    kind: 'text',
    windowTitle: ':).txt',
    x: 48,
    y: 10,
    // Placeholder — original list was captured live in a prior session and not
    // preserved verbatim here. Replace with the real list before shipping.
    textLines: [
      'coffee',
      'dogs',
      'the color pink',
      'sunrises',
      'good playlists',
      'handwritten notes',
      'rainy days with nothing planned',
      'a clean inbox',
      'long walks',
      'old films',
      'fresh sheets',
      'a good pen',
      'golden hour',
      'unexpected messages from friends',
    ],
  },
  {
    id: 'trackster',
    label: 'Trackster',
    kind: 'project',
    windowTitle: 'trackster',
    x: 4,
    y: 34,
    tags: ['backend development', 'ui design', 'frontend development'],
    description: 'vat tracking system for freelancers on the danish tax system',
  },
  {
    id: 'antispace-poster',
    label: 'Antispace Poster.jpg',
    kind: 'image',
    windowTitle: 'antispace poster.jpg',
    x: 26,
    y: 34,
  },
  {
    id: 'antispace',
    label: 'antispace',
    kind: 'project',
    windowTitle: 'antispace',
    x: 48,
    y: 34,
    tags: [
      'website design',
      'web development',
      'booking system integration',
      'print media design',
    ],
  },
  {
    id: 'awake',
    label: 'Awake',
    kind: 'project',
    windowTitle: 'awake',
    x: 4,
    y: 58,
    tags: ['website design', 'web development with shopify', 'ai video creation'],
  },
  {
    id: 'antispace-flyer',
    label: 'Antispace Flyer.jpg',
    kind: 'image',
    windowTitle: 'antispace flyer.jpg',
    x: 26,
    y: 58,
  },
  {
    id: 'half-a-love-letter',
    label: 'Half a Love Letter',
    kind: 'project',
    windowTitle: 'half a love letter',
    x: 48,
    y: 58,
    tags: ['concept development', 'front- & backend development', 'ui design'],
    link: { url: 'https://halfaloveletter.com' },
    description: 'platform to anonymously submit and read love letters',
  },
];

export const systemWindows: DesktopItem[] = [
  {
    id: 'about-me',
    label: 'About Me',
    kind: 'about',
    windowTitle: 'about me',
    x: 0,
    y: 0,
    description:
      'Placeholder bio — designer & developer based in Copenhagen, building interactive web experiences. Replace this with your real bio.',
  },
  {
    id: 'notes',
    label: 'Notes',
    kind: 'notes',
    windowTitle: 'notes',
    x: 0,
    y: 0,
    textLines: ['Placeholder note — add your own notes here.'],
  },
  {
    id: 'safari',
    label: 'Safari',
    kind: 'browser',
    windowTitle: 'safari',
    x: 0,
    y: 0,
    link: { url: 'https://amused-memory-754088.framer.app/' },
  },
  {
    id: 'trash',
    label: 'Trash',
    kind: 'trash',
    windowTitle: 'trash',
    x: 0,
    y: 0,
  },
];

export const dockLinks = {
  instagram: 'https://instagram.com/iamparryhotter',
  github: 'https://github.com/tetetootoo',
  mail: 'mailto:ts@halfodd.com',
};
