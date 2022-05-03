import React from 'react';
import { Avatar } from '../Avatar/Avatar.component';
import './App.scss';

function App() {
  return (
    <div className="App">
      <div>localhost playground</div>
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ width: '50%' }}>
          <Avatar modelUrl="/male.glb" animationUrl="/maleIdle.glb" backgroundColor="#fafafa" shadows />
        </div>
      </div>
    </div>
  );
}

export default App;