import { useState } from 'react';
import { Boot } from './os/Boot';
import { Desktop } from './os/Desktop';
import { useStore } from './store';

export default function App() {
  const [booted, setBooted] = useState(() => useStore.getState().settings.skipBoot || sessionStorage.getItem('vc_booted') === '1');
  if (!booted) return <Boot onDone={() => { sessionStorage.setItem('vc_booted', '1'); setBooted(true); }} />;
  return <Desktop />;
}
