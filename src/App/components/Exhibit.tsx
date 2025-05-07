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
      modelSrc="https://files.readyplayer.dev/asset/previewModelUrl/68990f29-d852-447b-a372-d81a997ede97/1c824b9e-2490-44fe-ab98-8d40bcf2e8a1-1746536677903.glb"
    />
  </div>
);
