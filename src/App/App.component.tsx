import React from 'react';
import { Avatar } from 'src/components/Avatar';
import './App.scss';

function App() {
  return (
    <div className="App">
      <div>localhost playground</div>
      <div className="container">
        <div className="card" style={{ width: '100%' }}>
          <Avatar modelUrl="/male.glb" poseUrl="/male-pose-standing.glb" backgroundColor="#fafafa" shadows />
        </div>
      </div>
    </div>
  );
}

export default App;
