import { lazy, Suspense } from 'react';
import { useIsMobile } from './hooks/useIsMobile';

const Desktop = lazy(() =>
  import('./components/Desktop/Desktop').then((m) => ({ default: m.Desktop })),
);
const Mobile = lazy(() =>
  import('./components/Mobile/Mobile').then((m) => ({ default: m.Mobile })),
);

function App() {
  const isMobile = useIsMobile();
  return <Suspense fallback={null}>{isMobile ? <Mobile /> : <Desktop />}</Suspense>;
}

export default App;
