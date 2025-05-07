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
      modelSrc="https://files.readyplayer.dev/asset/previewModelUrl/f53175fc-95cc-471c-8016-95008a6a192f/a0ea4dfd-0d4e-4f59-9da2-98965c1a1141-1746619069810.glb"
    />
  </div>
);
