export type WindowKind =
  | 'project'
  | 'image'
  | 'text'
  | 'about'
  | 'notes'
  | 'mail'
  | 'trash'
  | 'audio'
  | 'browser';

export interface IconLink {
  url: string;
  label?: string;
}

export interface AboutField {
  label: string;
  value: string;
  href?: string;
}

export interface NoteEntry {
  id: string;
  title: string;
  date: string;
  paragraphs: string[];
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
  mediaSrc?: string;
  mediaType?: 'image' | 'video';
  posterSrc?: string;
  iconSrc?: string;
  aboutFields?: AboutField[];
  bioParagraphs?: string[];
  notes?: NoteEntry[];
  trashItems?: DesktopItem[];
  mailTo?: string;
  mailSubject?: string;
  formEndpoint?: string;
}

const aboutBioParagraphs = [
  "i'm theresa schantz, a web designer & developer and brand designer based in copenhagen and berlin.",
  "i've been crafting websites, web apps, visual identities and branding products for companies across health, hospitality and tech. currently tinkering new digital systems, previously at sap.",
];

export interface DockLink {
  id: string;
  label: string;
  href: string;
}

export const desktopItems: DesktopItem[] = [
  {
    id: 'the-view-dao',
    label: 'The View - DAO',
    kind: 'audio',
    windowTitle: 'the view - dao',
    x: 4,
    y: 10,
    // Audio-only track extracted from the original video (see public/media/the-view-dao).
    mediaSrc: '/media/the-view-dao/the-view-dao.m4a',
    posterSrc: '/media/the-view-dao/cover.png',
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
    iconSrc: '/media/body-hommage/icon.png',
    mediaSrc: '/media/body-hommage/website.mp4',
    mediaType: 'video',
  },
  {
    id: 'smiley-txt',
    label: ':).txt',
    kind: 'text',
    windowTitle: ':).txt',
    x: 48,
    y: 10,
    iconSrc: '/icons/txt-doc.png',
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
    id: 'mom-spaghetti',
    label: 'mom spaghetti',
    kind: 'project',
    windowTitle: 'mom spaghetti',
    x: 4,
    y: 34,
    tags: ['concept development', 'frontend and backend dev', 'ui design'],
    description: 'VAT tracking app for freelancers in Denmark. Coming soon.',
    iconSrc: '/media/mom-spaghetti/icon.png',
    mediaSrc: '/media/mom-spaghetti/media.png',
    mediaType: 'image',
  },
  {
    id: 'antispace-poster',
    label: 'Antispace Poster.jpg',
    kind: 'image',
    windowTitle: 'antispace poster.jpg',
    x: 26,
    y: 34,
    iconSrc: '/media/antispace-poster/media.jpg',
    mediaSrc: '/media/antispace-poster/media.jpg',
    mediaType: 'image',
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
    iconSrc: '/media/antispace/icon.png',
    mediaSrc: '/media/antispace/website.mov',
    mediaType: 'video',
  },
  {
    id: 'awake',
    label: 'Awake',
    kind: 'project',
    windowTitle: 'awake',
    x: 4,
    y: 58,
    tags: ['website design', 'web development with shopify', 'ai video creation'],
    iconSrc: '/media/awake/icon.png',
    mediaSrc: '/media/awake/website.mp4',
    mediaType: 'video',
  },
  {
    id: 'antispace-flyer',
    label: 'Antispace Flyer.jpg',
    kind: 'image',
    windowTitle: 'antispace flyer.jpg',
    x: 26,
    y: 58,
    iconSrc: '/media/antispace-flyer/icon.png',
    mediaSrc: '/media/antispace-flyer/media.jpg',
    mediaType: 'image',
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
    iconSrc: '/media/half-a-love-letter/icon.png',
    mediaSrc: '/media/half-a-love-letter/screenshot.png',
    mediaType: 'image',
  },
  {
    id: 'bramlen',
    label: 'bramlen',
    kind: 'browser',
    windowTitle: 'bramlen',
    x: 4,
    y: 82,
    link: { url: 'https://bramlen.com' },
    iconSrc: '/icons/safari.png',
  },
  {
    id: 'wrestling-octopi',
    label: 'wrestling octopi',
    kind: 'project',
    windowTitle: 'wrestling octopi',
    x: 26,
    y: 82,
    tags: [
      'backend development',
      'ui design & visual identity',
      'frontend development',
      'online deployment',
    ],
    link: { url: 'https://wrestlingoctopi.com' },
    description: 'instagram business profile manager for desktop',
    iconSrc: '/media/wrestling-octopi/icon.png',
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
    posterSrc: '/media/about-me/profile.jpg',
    aboutFields: [
      { label: 'name', value: 'theresa schantz' },
      { label: 'position', value: 'web designer / developer' },
      { label: 'mail', value: 'ts@halfodd.com', href: 'mailto:ts@halfodd.com' },
    ],
    bioParagraphs: aboutBioParagraphs,
  },
  {
    id: 'notes',
    label: 'Notes',
    kind: 'notes',
    windowTitle: 'Notes',
    x: 0,
    y: 0,
    iconSrc: '/icons/txt-doc.png',
    notes: [
      {
        id: 'about',
        title: 'About',
        date: '2026-07-27T11:35:00',
        paragraphs: aboutBioParagraphs,
      },
      {
        id: 'imprint',
        title: 'Imprint',
        date: '2026-07-23T09:15:00',
        paragraphs: ['Half Odd\nc/o Theresa Schantz', 'CVR: 45714470', 'ts@halfodd.com'],
      },
      {
        id: 'legal',
        title: 'Legal',
        date: '2026-07-23T09:00:00',
        paragraphs: [
          '## Privacy Statement',
          'When you fill out the contact form, I collect your name, email address, and message. This information is used solely to respond to your enquiry and will never be shared with third parties, sold, or used for marketing purposes.',
          'Your data is stored securely and only kept for as long as needed to handle your request.',
          'Under GDPR, you have the right to access, correct, or request deletion of any personal data I hold about you. To exercise any of these rights, get in touch directly.',
          'This site processes personal data in accordance with the General Data Protection Regulation (EU) 2016/679.',
        ],
      },
    ],
  },
  {
    id: 'mail',
    label: 'Mail',
    kind: 'mail',
    windowTitle: 'contact',
    x: 0,
    y: 0,
    mailTo: 'ts@halfodd.com',
    mailSubject: "let's get in touch!",
    formEndpoint: 'https://formspree.io/f/mgogqkll',
  },
  {
    id: 'trash',
    label: 'Trash',
    kind: 'trash',
    windowTitle: 'trash',
    x: 0,
    y: 0,
    // Each entry is a kind: 'image' DesktopItem (mediaSrc/mediaType/iconSrc)
    // rendered as a clickable thumbnail; clicking opens it like any other window.
    trashItems: [
      {
        id: 'body-hommage-logo',
        label: 'Body Hommage Logo',
        kind: 'image',
        windowTitle: 'Body Hommage Logo',
        x: 0,
        y: 0,
        iconSrc: '/media/body-hommage-logo/logo.png',
        mediaSrc: '/media/body-hommage-logo/logo.png',
        mediaType: 'image',
      },
    ],
  },
];

export const dockLinks = {
  instagram: 'https://instagram.com/iamparryhotter',
  github: 'https://github.com/tetetootoo',
};
