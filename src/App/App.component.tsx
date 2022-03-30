import React from 'react';
import { Exhibit } from '../Exhibit';

function App() {
  return (
    <div className="App">
      <p>localhost playground</p>
      <Exhibit glbUrl="/headwear.glb" backgroundColor="#f0f0f0" />
    </div>
  );
}

export default App;
