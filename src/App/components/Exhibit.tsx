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
      modelSrc="https://readyplayerme-assets.s3.amazonaws.com/animations/visage/headwear.glb"
    />
  </div>
);
