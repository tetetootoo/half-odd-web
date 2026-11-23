import { lazy, Suspense } from 'react';
import { useIsMobile } from './hooks/useIsMobile';
import { isSuzaanProposal } from './proposalRoute';

const Desktop = lazy(() =>
  import('./components/Desktop/Desktop').then((m) => ({ default: m.Desktop })),
);
const Mobile = lazy(() =>
  import('./components/Mobile/Mobile').then((m) => ({ default: m.Mobile })),
);

const SuzaanProposal = lazy(() => import('./components/SuzaanProposal'));

const FitzProposal = lazy(() => import('./components/FitzProposal/FitzProposal'));
const TottiProposal = lazy(() => import('./components/FitzProposal/TottiProposal'));

function App() {
  const isMobile = useIsMobile();
  if (/^\/angebot\/totti\/?$/.test(window.location.pathname)) {
    return <Suspense fallback={null}><TottiProposal /></Suspense>;
  }
  if (/^\/proposal\/fitz\/?$/.test(window.location.pathname)) {
    return <Suspense fallback={null}><FitzProposal /></Suspense>;
  }
  if (isSuzaanProposal) {
    return <Suspense fallback={null}><SuzaanProposal isMobile={isMobile} /></Suspense>;
  }
  return <Suspense fallback={null}>{isMobile ? <Mobile /> : <Desktop />}</Suspense>;
}

export default App;
