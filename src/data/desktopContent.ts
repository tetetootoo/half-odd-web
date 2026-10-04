import { CASE_STUDIES, MARKDOWN_DOCUMENT_ICON, type CaseStudyId } from './caseStudies';
import type { TextBlock } from './textBlocks';

export type WindowKind =
  | 'project'
  | 'image'
  | 'text'
  | 'markdown'
  | 'about'
  | 'notes'
  | 'mail'
  | 'trash'
  | 'audio'
  | 'browser'
  // Opens the linked URL directly in a new tab instead of any overlay window
  // — for icons that should just forward straight to the external site.
  | 'link';

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
  // Desktop items can be dragged to the Trash unless this is false.
  trashable?: boolean;
  tags?: string[];
  link?: IconLink;
  showLinkBadge?: boolean;
  showScrollHint?: boolean;
  description?: string;
  textLines?: TextBlock[];
  caseStudyId?: CaseStudyId;
  plainText?: string[];
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
  "i'm theresa schantz, a designer & software engineer working across digital products, visual identities and technology.",
  "i like figuring out how things should look, how they should work, and then building them. currently building wrestling octopi and running half odd, previously engineering at sap.",
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
    x: 81.9,
    y: 81.1,
    // Audio-only track extracted from the original video (see public/media/the-view-dao).
    mediaSrc: '/media/the-view-dao/the-view-dao.m4a',
    posterSrc: '/media/the-view-dao/cover.png',
  },
  {
    id: 'body-hommage',
    label: 'Body Hommage',
    kind: 'browser',
    windowTitle: 'body hommage',
    x: 41.1,
    y: 70.6,
    tags: ['visual branding', 'website design', 'web development with framer'],
    link: { url: 'https://bodyhommage.com' },
    showScrollHint: true,
    iconSrc: '/media/body-hommage/icon.png',
  },
  {
    id: 'smiley-txt',
    label: ':).txt',
    kind: 'text',
    windowTitle: ':).txt',
    x: 75.1,
    y: 81.1,
    iconSrc: '/icons/doc-preview.svg',
    plainText: [
      'Things that make me :)',
      '',
      '',
      'that first sip of coffee in the morning',
      'long and short legged dogs',
      'the color pink',
      'a really good website',
      "juno bakery's cardamom bun",
      'a good nap on a sunday',
      '22°C, shorts and a sweatshirt',
      'sunrises',
      'long fins and a snorkel',
      'sunrise shack',
      'bio supermarkets',
      'daydreaming about the farm I will own one day (manifesting!!)',
      'pyjama sets',
      'heated rivalry',
      'photo booth',
    ],
  },
  {
    id: 'mom-spaghetti',
    label: 'mom spaghetti',
    kind: 'project',
    windowTitle: 'mom spaghetti',
    x: 55.1,
    y: 71,
    tags: ['concept development', 'frontend and backend dev', 'ui design'],
    description: 'VAT tracking app for freelancers in Denmark. Coming soon.',
    iconSrc: '/media/mom-spaghetti/icon.png',
    mediaSrc: '/media/mom-spaghetti/desktop.mov',
    mediaType: 'video',
  },
  {
    id: 'antispace-poster',
    label: 'Antispace Poster.jpg',
    kind: 'image',
    windowTitle: 'antispace poster.jpg',
    x: 29.6,
    y: 37.7,
    iconSrc: '/media/antispace-poster/media.jpg',
    mediaSrc: '/media/antispace-poster/media.jpg',
    mediaType: 'image',
  },
  {
    id: 'antispace',
    label: 'antispace',
    kind: 'project',
    windowTitle: 'antispace',
    x: 32.6,
    y: 23.5,
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
    x: 47.9,
    y: 64.7,
    tags: ['website design', 'web development with shopify', 'ai video creation'],
    link: { url: 'https://awake.de' },
    iconSrc: '/media/awake/icon.png',
    mediaSrc: '/media/awake/website.mp4',
    mediaType: 'video',
  },
  {
    id: 'antispace-flyer',
    label: 'Antispace Flyer.jpg',
    kind: 'image',
    windowTitle: 'antispace flyer.jpg',
    x: 38.4,
    y: 31.1,
    iconSrc: '/media/antispace-flyer/icon.png',
    mediaSrc: '/media/antispace-flyer/media.jpg',
    mediaType: 'image',
  },
  {
    id: 'half-a-love-letter',
    label: 'Half a Love Letter',
    kind: 'browser',
    windowTitle: 'half a love letter',
    x: 86.1,
    y: 23.8,
    tags: ['concept development', 'front- & backend development', 'ui design'],
    link: { url: 'https://halfaloveletter.com' },
    description: 'platform to anonymously submit and read love letters',
    iconSrc: '/media/half-a-love-letter/icon.png',
  },
  {
    id: 'bramlen',
    label: 'bramlen',
    kind: 'browser',
    windowTitle: 'bramlen',
    x: 10.7,
    y: 70,
    link: { url: 'https://bramlen.com' },
    description: 'my side quest software business. dare to click the button!',
    iconSrc: '/media/bramlen/icon.png',
  },
  {
    id: 'wrestling-octopi',
    label: 'wrestling octopi',
    kind: 'link',
    windowTitle: 'wrestling octopi',
    x: 10.2,
    y: 26.9,
    link: { url: 'https://www.wrestlingoctopi.com/' },
    showLinkBadge: true,
    iconSrc: '/media/wrestling-octopi/icon.png',
  },
  {
    id: 'antispace-berlin-case-study',
    label: CASE_STUDIES['antispace-berlin-case-study'].label,
    kind: 'markdown',
    caseStudyId: 'antispace-berlin-case-study',
    iconSrc: MARKDOWN_DOCUMENT_ICON,
    windowTitle: CASE_STUDIES['antispace-berlin-case-study'].label,
    x: 32.6,
    y: 8.5,
  },
  {
    id: 'half-a-love-letter-case-study',
    label: CASE_STUDIES['half-a-love-letter-case-study'].label,
    kind: 'markdown',
    caseStudyId: 'half-a-love-letter-case-study',
    iconSrc: MARKDOWN_DOCUMENT_ICON,
    windowTitle: CASE_STUDIES['half-a-love-letter-case-study'].label,
    x: 85.9,
    y: 9.5,
  },
  {
    id: 'sap-graph-case-study',
    label: CASE_STUDIES['sap-graph-case-study'].label,
    kind: 'markdown',
    caseStudyId: 'sap-graph-case-study',
    iconSrc: MARKDOWN_DOCUMENT_ICON,
    windowTitle: CASE_STUDIES['sap-graph-case-study'].label,
    x: 61,
    y: 8.8,
  },
  {
    id: 'wrestling-octopi-case-study',
    label: CASE_STUDIES['wrestling-octopi-case-study'].label,
    kind: 'markdown',
    caseStudyId: 'wrestling-octopi-case-study',
    iconSrc: MARKDOWN_DOCUMENT_ICON,
    windowTitle: CASE_STUDIES['wrestling-octopi-case-study'].label,
    x: 9.9,
    y: 8.1,
  },
  {
    id: 'photo-portfolio',
    label: 'Photography',
    kind: 'browser',
    windowTitle: 'Photography',
    x: 21.6,
    y: 69.8,
    link: { url: 'https://theresaschantz.com' },
    description: 'personal photography portfolio',
    iconSrc: '/media/photo-portfolio/icon.png',
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
      { label: 'position', value: 'designer / software engineer' },
      { label: 'based', value: 'copenhagen / berlin' },
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
          '## Design Credit',
          "This site's design takes heavy inspiration from Apple's macOS and iOS operating systems. Not all icon designs are my own — where icons are Apple's own designs, credit belongs to Apple and I do not claim them as my own work.",
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
