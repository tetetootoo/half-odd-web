import wrestling from './wrestling-octopi-case-study.md?raw';
import sap from './sap-graph-case-study-preview.md?raw';
import antispace from './antispace-berlin-case-study.md?raw';
import letter from './half-a-love-letter-case-study.md?raw';

// Shared "little preview" document glyph — same icon .txt files use.
export const MARKDOWN_DOCUMENT_ICON = '/icons/doc-preview.svg';
export type CaseStudyId = 'wrestling-octopi-case-study' | 'sap-graph-case-study' | 'antispace-berlin-case-study' | 'half-a-love-letter-case-study';
export interface MediaSlot { label: string; path: string; src?: string; type?: 'video'; ratio?: string; hideCaption?: boolean; alt?: string; poster?: string; respectReducedMotion?: boolean; labelAbove?: boolean }
export interface LayoutDirective { layout: 'media' | 'intro' | 'split' | 'gallery' | 'bento' | 'comparison' | 'architecture' | 'sap-graph' | 'sap-reuse' | 'sap-exception' | 'sap-evolution'; size?: 'wide' | 'standard' | 'secondary' | 'process'; contentBlocks?: number; media: MediaSlot[]; paragraphs?: number }
export interface CaseStudyConfig {
  id: CaseStudyId;
  label: string;
  markdown: string;
  artDirection: 'product' | 'system' | 'editorial' | 'intimate';
  directives: Record<string, LayoutDirective>;
  links?: Record<string, string>;
}
const slot = (folder: string, file: string, label: string, ratio = '16 / 10', src?: string): MediaSlot => ({
  path: `/media/${folder}/${file}`, label, ratio, src,
  type: /\.(mp4|mov)$/.test(file) ? 'video' : undefined,
});
const wo = (file: string, label: string, alt: string, ratio = '2940 / 1602'): MediaSlot => ({
  ...slot('wrestling-octopi-case-study', file, label, ratio, `/media/wrestling-octopi-case-study/${file}`), alt,
});
const anti = (file: string, label: string, ratio = '3 / 4', src?: string) => slot('antispace-case-study', file, label, ratio, src);
const love = (file: string, label: string) => slot('half-a-love-letter-case-study', file, label, '2940 / 1600', `/media/half-a-love-letter-case-study/${file}`);
const media = (...items: MediaSlot[]): LayoutDirective => ({ layout: 'media', media: items });
const gallery = (...items: MediaSlot[]): LayoutDirective => ({ layout: 'gallery', media: items });
// Keeps the label for alt text / the placeholder's visible text, just hides the caption under the image.
const silent = (item: MediaSlot): MediaSlot => ({ ...item, hideCaption: true });

export const CASE_STUDIES: Record<CaseStudyId, CaseStudyConfig> = {
  'wrestling-octopi-case-study': {
    id: 'wrestling-octopi-case-study', label: 'Wrestling Octopi.md', markdown: wrestling, artDirection: 'product',
    links: { 'View Wrestling Octopi ↗': 'https://www.wrestlingoctopi.com/', 'View GitHub ↗': 'https://github.com/tetetootoo' },
    directives: {
      HERO_MEDIA: { layout: 'intro', contentBlocks: 4, media: [{
        ...wo('canva-design-and-post-scheduling-workflow.mp4', 'Current product workflow', 'Wrestling Octopi workflow showing Canva design creation, return to the product, and post scheduling.', '2560 / 1380'),
        poster: '/media/wrestling-octopi-case-study/canva-design-and-post-scheduling-poster.jpg', respectReducedMotion: true, hideCaption: true,
      }] },
      BEFORE_AFTER: { layout: 'comparison', size: 'wide', media: [
        { ...wo('landing-page-early-purple.png', 'Early direction', 'Early Wrestling Octopi landing page with purple headlines and buttons beside a colorful feed-grid simulation.', '1400 / 910') },
        { ...wo('landing-page-current-monochrome.png', 'Current direction', 'Current black and white Wrestling Octopi landing page with a simplified headline and product preview.') },
      ] },
      FEED_PREVIEW: { layout: 'media', size: 'wide', media: [wo('instagram-feed-grid-preview.png', 'Feed Preview', 'Wrestling Octopi Feed Preview showing a three-column Instagram content grid.')] },
      PLANNING_PAIR: { layout: 'comparison', size: 'wide', media: [
        { ...wo('post-column-caption-and-schedule.png', 'Column view', 'Wrestling Octopi Column view with a scheduled post, caption editor, publishing time, and image preview.', '2940 / 1606') },
        { ...wo('post-calendar-october-2026.png', 'Calendar view', 'Wrestling Octopi calendar showing scheduled Instagram content in October 2026.') },
      ] },
      ANALYTICS: { layout: 'media', size: 'wide', media: [wo('analytics-engagement-and-posting-times.png', 'Analytics', 'Wrestling Octopi analytics view showing engagement metrics and suggested posting times.')] },
      COMMENTS: { layout: 'media', size: 'wide', media: [wo('post-comments-and-replies.png', 'Comments', 'Wrestling Octopi comments interface showing posts, comment threads, and replies.', '2940 / 1600')] },
      ARCHITECTURE: { layout: 'media', size: 'standard', media: [silent(wo('system-architecture-overview.png', 'System architecture', 'Wrestling Octopi system architecture showing frontend, backend, data infrastructure, and external services.', '1536 / 1024'))] },
      DEVELOPMENT_PROCESS: { layout: 'media', size: 'process', media: [silent(wo('ai-assisted-development-iteration-process.png', 'AI-assisted development process', 'Seven-step AI-assisted development loop: product decision, design, implementation, manual testing, catching issues, debugging, and refinement.', '1536 / 1024'))] },
    },
  },
  'sap-graph-case-study': {
    id: 'sap-graph-case-study', label: 'SAP Graph.md', markdown: sap, artDirection: 'system',
    directives: {
      SAP_GRAPH_DIAGRAM: { layout: 'sap-graph', media: [] },
      SAP_REUSE_DIAGRAM: { layout: 'sap-reuse', media: [] },
      SAP_EXCEPTION_DIAGRAM: { layout: 'sap-exception', media: [] },
      SAP_EVOLUTION: { layout: 'sap-evolution', media: [] },
    },
  },
  'antispace-berlin-case-study': {
    id: 'antispace-berlin-case-study', label: 'Antispace Berlin.md', markdown: antispace, artDirection: 'editorial',
    directives: {
      HERO_MEDIA: media(anti('home-website-screenrecord.mov', 'Antispace website', '1280 / 666', '/media/antispace-case-study/home-website-screenrecord.mov')),
      BRAND_GALLERY: { layout: 'bento', media: [
        anti('poster-1.jpg', 'Poster', '2 / 3', '/media/antispace-poster/media.jpg'),
        anti('name-cards.png', 'Name card', '900 / 1106', '/media/antispace-case-study/name-cards.png'),
        anti('flyer.png', 'Flyer', '1094 / 764', '/media/antispace-case-study/flyer.png'),
        anti('screenshot-recovery-hero.png', 'Typography detail', '2434 / 882', '/media/antispace-case-study/screenshot-recovery-hero.png'),
        anti('goodie-bags.png', 'Social asset', '630 / 1112', '/media/antispace-case-study/goodie-bags.png'),
      ] },
      WEBSITE_VIDEO: media(anti('home-website-screenrecord.mov', 'Navigation and interaction', '1280 / 666', '/media/antispace-case-study/home-website-screenrecord.mov')),
      DETAIL_ROW: gallery(
        silent(anti('screenshot-more-info.png', 'Typography', '2934 / 1596', '/media/antispace-case-study/screenshot-more-info.png')),
        silent(anti('screenshot-concept-tiles.png', 'Responsive tiles', '2900 / 1498', '/media/antispace-case-study/screenshot-concept-tiles.png')),
      ),
      BOOKING_SPLIT: { layout: 'split', paragraphs: 2, media: [anti('recovery-animation.mov', 'Booking path', '1280 / 666', '/media/antispace-case-study/recovery-animation.mov')] },
    },
  },
  'half-a-love-letter-case-study': {
    id: 'half-a-love-letter-case-study', label: 'Half a Love Letter.md', markdown: letter, artDirection: 'intimate',
    // No project repository URL is supplied. Keep the existing verified profile link.
    links: { 'View GitHub ↗': 'https://github.com/tetetootoo' },
    directives: {
      HERO_MEDIA: media(love('opening-experience.mp4', 'Opening experience')),
      AI_COMPARISON: { layout: 'comparison', media: [
        slot('half-a-love-letter-case-study', 'ai-1.png', 'Claude', '2930 / 1496', '/media/half-a-love-letter-case-study/ai-1.png'),
        slot('half-a-love-letter-case-study', 'ai-3.png', 'Figma AI', '434 / 966', '/media/half-a-love-letter-case-study/ai-3.png'),
        slot('half-a-love-letter-case-study', 'ai-4.png', 'Framer', '526 / 896', '/media/half-a-love-letter-case-study/ai-4.png'),
        slot('half-a-love-letter-case-study', 'ai-5.png', 'Figma → Framer', '1182 / 986', '/media/half-a-love-letter-case-study/ai-5.png'),
      ] },
      FINAL_DESIGN: media(love('final-experience.mp4', 'Final experience')),
    },
  },
};
