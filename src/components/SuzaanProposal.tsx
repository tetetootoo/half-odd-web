import { lazy, Suspense } from 'react';
import markdown from '../data/suzaan-sauerman-proposal.md?raw';
import { MARKDOWN_DOCUMENT_ICON } from '../data/caseStudies';
import type { DesktopItem } from '../data/desktopContent';
import type { MobileAppItem } from '../data/mobileContent';

const Desktop = lazy(() => import('./Desktop/Desktop').then(({ Desktop }) => ({ default: Desktop })));
const Mobile = lazy(() => import('./Mobile/Mobile').then(({ Mobile }) => ({ default: Mobile })));

const document = {
  id: 'suzaan-sauerman-proposal',
  label: 'suzaan-sauerman-proposal.md',
  kind: 'markdown',
  iconSrc: MARKDOWN_DOCUMENT_ICON,
  markdown,
} satisfies MobileAppItem;

const desktopDocument: DesktopItem = {
  ...document,
  windowTitle: document.label,
  x: 0,
  y: 0,
};

function closeDocument() {
  window.location.replace('/');
}

export default function SuzaanProposal({ isMobile }: { isMobile: boolean }) {
  return (
    <Suspense fallback={null}>
      {isMobile
        ? <Mobile initialDocument={document} onDocumentClose={closeDocument} />
        : <Desktop initialDocument={desktopDocument} onDocumentClose={closeDocument} />}
    </Suspense>
  );
}
