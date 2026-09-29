import { WRESTLING_OCTOPI_CASE_STUDY } from './wrestlingOctopiCaseStudy';
import type { TextBlock } from './textBlocks';

// 'site' = shown inside a Safari-style chrome (live iframe via embedUrl, or a
// screen-recording/screenshot via mediaSrc standing in until a phone-recorded
// video is dropped in). 'image' = a plain standalone picture, no browser chrome.
// 'trash' opens the Trash as a folder overlay listing multiple files instead
// of a single doc/site/image.
export type MobileAppKind = 'site' | 'image' | 'audio' | 'link' | 'text' | 'trash';

export interface MobileAppItem {
  id: string;
  label: string;
  iconSrc: string;
  kind: MobileAppKind;
  href?: string;
  audioSrc?: string;
  textLines?: TextBlock[];
  plainText?: string[];
  link?: { url: string };
  embedUrl?: string;
  mediaSrc?: string;
  mediaType?: 'image' | 'video';
  tags?: string[];
  description?: string;
  // Some source icons have transparent backgrounds or a non-square aspect
  // ratio that doesn't fill the tile cleanly — this bakes in a card behind
  // the glyph so it reads like the other icons.
  iconBg?: 'white' | 'grey';
  // Portrait source images letterbox (pillarbox) inside the square tile with
  // the default contain fit — 'cover' fills the tile edge-to-edge instead,
  // cropping top/bottom.
  iconFit?: 'cover';
  // For kind 'image': fill the overlay edge-to-edge (cropping to cover)
  // instead of the padded, letterboxed doc-style layout.
  overlayFill?: boolean;
}

export const aboutInfo = {
  name: 'theresa schantz',
  role: 'web designer / developer',
  mail: 'ts@halfodd.com',
  photoSrc: '/media/about-me/profile.jpg',
  bioParagraphs: [
    "i'm theresa schantz, a web designer & developer and brand designer based in copenhagen and berlin.",
    "i've been crafting websites, web apps, visual identities and branding products for companies across health, hospitality and tech. currently tinkering new digital systems, previously at sap.",
  ],
};

export const notesInfo = [
  {
    id: 'about',
    title: 'About',
    date: '27/07/2026',
    paragraphs: aboutInfo.bioParagraphs,
  },
  {
    id: 'imprint',
    title: 'Imprint',
    date: '23/07/2026',
    paragraphs: ['Half Odd\nc/o Theresa Schantz', 'CVR: 45714470', 'ts@halfodd.com'],
  },
  {
    id: 'legal',
    title: 'Legal',
    date: '23/07/2026',
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
];

export const contactInfo = {
  mailTo: 'ts@halfodd.com',
  mailSubject: "let's get in touch!",
  formEndpoint: 'https://formspree.io/f/mgogqkll',
};

// Files inside the Trash "folder" — more can be added here later.
export const trashItems: MobileAppItem[] = [
  {
    id: 'body-hommage-logo',
    label: 'Body Hommage Logo',
    iconSrc: '/media/body-hommage-logo/logo.png',
    iconBg: 'white',
    kind: 'image',
    mediaSrc: '/media/body-hommage-logo/logo.png',
    mediaType: 'image',
  },
];

// Everything that isn't About/Notes/Mail lives here, in a fixed grid order —
// the dock only holds those three, matching the desktop dock's reduced set.
export const gridApps: MobileAppItem[] = [
  {
    id: 'antispace',
    label: 'antispace',
    iconSrc: '/media/antispace/icon.png',
    kind: 'site',
    mediaSrc: '/media/antispace/website.mov',
    mediaType: 'video',
    tags: [
      'website design',
      'web development',
      'booking system integration',
      'print media design',
    ],
  },
  {
    id: 'body-hommage',
    label: 'Body Hommage',
    iconSrc: '/media/body-hommage/icon.png',
    kind: 'site',
    embedUrl: 'https://bodyhommage.com',
    link: { url: 'https://bodyhommage.com' },
    tags: ['visual branding', 'website design', 'web development with framer'],
  },
  {
    id: 'awake',
    label: 'Awake',
    iconSrc: '/media/awake/icon.png',
    kind: 'site',
    link: { url: 'https://awake.de' },
    // Placeholder desktop screen recording until a phone-recorded video is dropped in.
    mediaSrc: '/media/awake/website.mp4',
    mediaType: 'video',
    tags: ['website design', 'web development with shopify', 'ai video creation'],
  },
  {
    id: 'smiley-txt',
    label: ':).txt',
    iconSrc: '/icons/txt-icon.png',
    kind: 'text',
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
    id: 'bramlen',
    label: 'bramlen',
    iconSrc: '/media/bramlen/icon.png',
    kind: 'site',
    embedUrl: 'https://bramlen.com',
    link: { url: 'https://bramlen.com' },
    description: 'my side quest software business. dare to click the button!',
  },
  {
    id: 'wrestling-octopi',
    label: 'wrestling octopi',
    iconSrc: '/media/wrestling-octopi/icon.png',
    iconBg: 'white',
    kind: 'site',
    embedUrl: 'https://www.wrestlingoctopi.com/',
    link: { url: 'https://www.wrestlingoctopi.com/' },
    tags: [
      'backend development',
      'ui design & visual identity',
      'frontend development',
      'online deployment',
    ],
    description: 'instagram business profile manager for desktop',
  },
  {
    id: 'wrestling-octopi-case-study',
    label: 'wrestling octopi case study.txt',
    iconSrc: '/icons/txt-icon.png',
    kind: 'text',
    // wrestling-octopi is a 'site' overlay on mobile, so reuse it in place;
    // GitHub has no internal overlay on either platform, so that one's
    // always an external link.
    textLines: [
      ...WRESTLING_OCTOPI_CASE_STUDY,
      { openId: 'wrestling-octopi', label: 'View Live Product' },
      { href: 'https://github.com/tetetootoo', label: 'View GitHub' },
    ],
  },
  {
    id: 'mom-spaghetti',
    label: 'mom spaghetti',
    iconSrc: '/media/mom-spaghetti/icon.png',
    iconBg: 'white',
    kind: 'site',
    mediaSrc: '/media/mom-spaghetti/phone.mov',
    mediaType: 'video',
    tags: ['concept development', 'frontend and backend dev', 'ui design'],
    description: 'VAT tracking app for freelancers in Denmark. Coming soon.',
  },
  {
    id: 'the-view-dao',
    label: 'The View - DAO',
    iconSrc: '/media/the-view-dao/cover.png',
    kind: 'audio',
    audioSrc: '/media/the-view-dao/the-view-dao.m4a',
  },
  {
    id: 'half-a-love-letter',
    label: 'Half a Love Letter',
    iconSrc: '/media/half-a-love-letter/icon.png',
    iconBg: 'white',
    kind: 'site',
    embedUrl: 'https://halfaloveletter.com',
    link: { url: 'https://halfaloveletter.com' },
    tags: ['concept development', 'front- & backend development', 'ui design'],
    description: 'platform to anonymously submit and read love letters',
  },
  {
    id: 'antispace-poster',
    label: 'Antispace Poster',
    // Cropped to just the orange poster itself, without the grey wall it's
    // photographed against — mediaSrc below keeps the full original photo.
    iconSrc: '/media/antispace-poster/icon.jpg',
    iconFit: 'cover',
    kind: 'image',
    mediaSrc: '/media/antispace-poster/media.jpg',
    mediaType: 'image',
    overlayFill: true,
  },
  {
    id: 'antispace-flyer',
    label: 'Antispace Flyer',
    iconSrc: '/media/antispace-flyer/icon.png',
    iconFit: 'cover',
    kind: 'image',
    mediaSrc: '/media/antispace-flyer/media.jpg',
    mediaType: 'image',
    overlayFill: true,
  },
  {
    id: 'photo-portfolio',
    label: 'Photo Portfolio',
    iconSrc: '/media/photo-portfolio/icon.png',
    kind: 'site',
    embedUrl: 'https://theresaschantz.com',
    link: { url: 'https://theresaschantz.com' },
    description: 'personal photography portfolio',
  },
  {
    id: 'trash',
    label: 'Trash',
    iconSrc: '/icons/trash.png',
    iconBg: 'grey',
    kind: 'trash',
  },
  {
    id: 'github',
    label: 'GitHub',
    iconSrc: '/icons/github.png',
    kind: 'link',
    href: 'https://github.com/tetetootoo',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    iconSrc: '/icons/instagram.png',
    kind: 'link',
    href: 'https://instagram.com/iamparryhotter',
  },
];
