import React from 'react';
import { Avatar } from 'src/components/Avatar';
import './App.scss';

function App() {
  return (
    <div className="App">
      <div className="settings">
        <div className="wrapper">
          <h3 className="title">localhost playground</h3>
          <div className="content">
            Paste your content in there to test the avatar props without shrinking the canvas
          </div>
        </div>
      </div>
      <div className="container">
        <div className="card" style={{ width: '100%' }}>
          <Avatar modelUrl="/male.glb" poseUrl="/male-pose-standing.glb" backgroundColor="#fafafa" shadows={false} />
        </div>
      </div>
    </div>
  );
}

export default App;
