import React from 'react';
import { Vector3 } from 'three';
import { Exhibit } from 'src/components/Exhibit';

export const ExhibitPage = () => (
  <div style={{ width: '100%', height: '100%', background: '#444' }}>
    <Exhibit
      scale={2}
      environment="hub"
      position={new Vector3(0, 1, 5)}
      fit
      float={false}
      shadows={false}
      snap={false}
      lockVertical={false}
      lockHorizontal
      horizontalRotation
      modelSrc="https://files.readyplayer.dev/asset/modelUrl/04013f17-d197-49b8-9e7e-d782976b0b6f/a26d8ce7-5dcc-4d20-847a-6c8a69c5ed1f-1731509028078.glb"
    />
  </div>
);
