import React from 'react';
import { Vector3 } from 'three';
import { Exhibit } from 'src/components/Exhibit';

export const ExhibitPage = () => (
  <div style={{ width: '100%', height: '100%', background: '#444' }}>
    <Exhibit
      scale={1}
      environment="hub"
      position={new Vector3(0, 1, 5)}
      fit
      float={false}
      shadows={false}
      snap={false}
      lockVertical
      lockHorizontal={false}
      horizontalRotation
      modelSrc="https://files.readyplayer.dev/asset/previewModelUrl/bb715b27-635e-4c09-8ea9-f16a2bc085bf/668009a1-b417-4a1e-90e0-2055775b0abd-1746632664732.glb"
    />
  </div>
);
