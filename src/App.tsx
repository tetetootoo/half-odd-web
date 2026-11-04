import { lazy, Suspense } from 'react';
import { useIsMobile } from './hooks/useIsMobile';

const Desktop = lazy(() =>
  import('./components/Desktop/Desktop').then((m) => ({ default: m.Desktop })),
);
const Mobile = lazy(() =>
  import('./components/Mobile/Mobile').then((m) => ({ default: m.Mobile })),
);

const FitzProposal = lazy(() => import('./components/FitzProposal/FitzProposal'));

function App() {
  const isMobile = useIsMobile();
  if (/^\/proposal\/fitz\/?$/.test(window.location.pathname)) {
    return <Suspense fallback={null}><FitzProposal /></Suspense>;
  }
  return <Suspense fallback={null}>{isMobile ? <Mobile /> : <Desktop />}</Suspense>;
}

export default App;
