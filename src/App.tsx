import React from 'react';
import { useRete } from './rete';

function App() {
  const [setContainer] = useRete();
  return <div style={{ width: '100vw', height: '600px' }} ref={(ref) => ref && setContainer(ref)} />;
}

export default App;
