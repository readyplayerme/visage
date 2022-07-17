import React from 'react';
import { Avatar } from 'src/components/Avatar';
import './App.scss';

function App() {
  return (
    <div className="App">
      <div>localhost playground</div>
      <div className="container">
        <div className="card" style={{ width: '100%' }}>
          <Avatar
            modelUrl="https://d1a370nemizbjq.cloudfront.net/21285408-3fa1-4a18-8208-02c380f7c3f3.glb"
            // modelUrl="https://d1a370nemizbjq.cloudfront.net/f8d061fc-8f64-49d5-90b3-94fdadfc2974.glb"
            // modelUrl="https://d1a370nemizbjq.cloudfront.net/77d2b696-ba58-4874-9837-830069467841.glb"
            poseUrl="/male-pose-standing.glb"
            backgroundColor="#fafafa"
            shadows
          />
        </div>
      </div>
    </div>
  );
}

export default App;
