import React, { Suspense, FC } from 'react';
import { PresentationControls, Environment, ContactShadows } from '@react-three/drei';
import type { PresetsType } from '@react-three/drei/helpers/environment-assets';
import { isValidGlbUrl } from 'src/Models';
import { CameraProps } from 'src/types';
import { BaseCanvas } from '../BaseCanvas';
import { FloatingModel } from '../Models/FloatingModel';

export interface ExhibitProps extends CameraProps {
  /**
   * Path to `.glb` file of the 3D model.
   */
  modelUrl: string;
  /**
   * Size of the rendered GLB model.
   */
  scale?: number;
  /**
   * Canvas background color. Supports all CSS color value types.
   */
  backgroundColor?: string;
  /**
   * Brightness, color hue, shadow contrast, reflection details change according to the selected environment.
   */
  environment?: PresetsType;
}

/**
 * Interactive presentation of any GLTF (.glb) asset.
 */
export const Exhibit: FC<ExhibitProps> = ({
  modelUrl,
  scale = 1.0,
  backgroundColor = '#f0f0f0',
  environment = 'city',
  cameraPosition
}) => (
  <BaseCanvas background={backgroundColor} cameraPosition={cameraPosition}>
    <Suspense fallback={null}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-mapSize={[512, 512]} castShadow />
      <PresentationControls
        global
        config={{ mass: 2, tension: 500 }}
        snap
        rotation={[0, -0.3, 0]}
        polar={[-Math.PI / 3, Math.PI / 3]}
        azimuth={[-Math.PI / 1.4, Math.PI / 2]}
      >
        {isValidGlbUrl(modelUrl) && <FloatingModel modelUrl={modelUrl} scale={scale} />}
      </PresentationControls>
      <ContactShadows
        rotation-x={Math.PI / 2}
        position={[0, -1.0, 0]}
        opacity={0.75}
        width={10}
        height={10}
        blur={2.6}
        far={2}
      />
      <Environment preset={environment} />
    </Suspense>
  </BaseCanvas>
);
