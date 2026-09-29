import wrestling from './wrestling-octopi-case-study.md?raw';
import sap from './sap-graph-case-study-preview.md?raw';
import antispace from './antispace-berlin-case-study.md?raw';
import letter from './half-a-love-letter-case-study.md?raw';

// Shared "little preview" document glyph — same icon .txt files use.
export const MARKDOWN_DOCUMENT_ICON = '/icons/doc-preview.svg';
export type CaseStudyId = 'wrestling-octopi-case-study' | 'sap-graph-case-study' | 'antispace-berlin-case-study' | 'half-a-love-letter-case-study';
export interface MediaSlot { label: string; path: string; src?: string; type?: 'video'; ratio?: string; hideCaption?: boolean }
export interface LayoutDirective { layout: 'media' | 'split' | 'gallery' | 'bento' | 'comparison' | 'architecture'; media: MediaSlot[]; paragraphs?: number }
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
const wo = (file: string, label: string) => slot('wrestling-octopi-case-study', file, label);
const anti = (file: string, label: string, ratio = '3 / 4', src?: string) => slot('antispace-case-study', file, label, ratio, src);
const love = (file: string, label: string) => slot('half-a-love-letter-case-study', file, label, '2940 / 1600', `/media/half-a-love-letter-case-study/${file}`);
const media = (...items: MediaSlot[]): LayoutDirective => ({ layout: 'media', media: items });
const gallery = (...items: MediaSlot[]): LayoutDirective => ({ layout: 'gallery', media: items });
// Keeps the label for alt text / the placeholder's visible text, just hides the caption under the image.
const silent = (item: MediaSlot): MediaSlot => ({ ...item, hideCaption: true });

export const CASE_STUDIES: Record<CaseStudyId, CaseStudyConfig> = {
  'wrestling-octopi-case-study': {
    id: 'wrestling-octopi-case-study', label: 'Wrestling Octopi.md', markdown: wrestling, artDirection: 'product',
    links: { 'View live product ↗': 'https://www.wrestlingoctopi.com/', 'View GitHub ↗': 'https://github.com/tetetootoo' },
    directives: {
      HERO_MEDIA: media(wo('hero.mp4', 'Current product')),
      INTRO_SPLIT: { layout: 'split', paragraphs: 3, media: [wo('intro-visual.mp4', 'Product overview')] },
      FEED_PLANNER_VIDEO: media(wo('feed-planner.mp4', 'Feed planner interaction')),
      STATE_GRID: gallery(...['Draft', 'Scheduled', 'Publishing', 'Failed / Retry'].map((label, i) => wo(`feed-state-${i + 1}.png`, label))),
      BEFORE_AFTER: { layout: 'comparison', media: [wo('ai-exploration.png', 'Early AI-heavy direction'), wo('final-direction.png', 'Current refined direction')] },
      DESIGN_DETAILS: gallery(...['Hierarchy', 'Typography + spacing', 'Components + states'].map((label, i) => wo(`design-detail-${i + 1}.png`, label))),
      PROCESS_SEQUENCE: gallery(...['01 / Idea', '02 / First implementation', '03 / Refined interaction'].map((label, i) => wo(`process-${i + 1}.png`, label))),
      ARCHITECTURE: { layout: 'architecture', media: [] },
      FINAL_PRODUCT_INTERACTION: media(wo('final-interaction.mp4', 'Current product interaction')),
      FINAL_SEQUENCE: media(wo('final-sequence.mp4', 'Connected product interactions')),
    },
  },
  'sap-graph-case-study': {
    id: 'sap-graph-case-study', label: 'SAP Graph.md', markdown: sap, artDirection: 'system',
    directives: {
      COLLABORATION_DIAGRAM: media(silent(slot('sap-graph-case-study', 'collaboration.svg', 'Design, engineering and product contribute to a shared system and release.', '640 / 738', '/media/sap-graph-case-study/collaboration.svg'))),
      COMPONENT_DIAGRAM: media(silent(slot('sap-graph-case-study', 'component-layers.svg', 'Fiori / UI5 primitives → wrappers → reusable product components → interface.', '640 / 636', '/media/sap-graph-case-study/component-layers.svg'))),
      TRADEOFF_DIAGRAM: media(silent(slot('sap-graph-case-study', 'engineering-tradeoff.svg', 'Internal workarounds add complexity; an external library enables the intended tooltip interaction.', '640 / 690', '/media/sap-graph-case-study/engineering-tradeoff.svg'))),
      CHANGE_DIAGRAM: media(silent(slot('sap-graph-case-study', 'software-change.svg', 'Reusability, testing, feature toggles, maintainability and collaboration support software that can change.', '640 / 544', '/media/sap-graph-case-study/software-change.svg'))),
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
      ] },
      FINAL_DESIGN: media(love('final-experience.mp4', 'Final experience')),
    },
  },
};
