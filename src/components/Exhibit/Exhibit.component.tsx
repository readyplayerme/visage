import React, { Suspense, FC, CSSProperties } from 'react';
import { PresentationControls, Environment, ContactShadows } from '@react-three/drei';
import type { PresetsType } from '@react-three/drei/helpers/environment-assets';
import { isValidGlbFormat } from 'src/services';
import { CameraProps } from 'src/types';
import { BaseCanvas } from '../BaseCanvas';
import { FloatingModel } from '../Models/FloatingModel';

export interface ExhibitProps extends CameraProps {
  /**
   * Arbitrary binary data (base64 string | Blob) of a `.glb` file or path (URL) to a `.glb` resource.
   */
  modelSrc: string;
  /**
   * Size of the rendered GLB model.
   */
  scale?: number;
  /**
   * Brightness, color hue, shadow contrast, reflection details change according to the selected environment.
   */
  environment?: PresetsType;
  /**
   * Pass styling to canvas.
   */
  style?: CSSProperties;
  /**
   * Custom style classes for canvas.
   */
  className?: string;
}

/**
 * Interactive presentation of any GLTF (.glb) asset.
 */
export const Exhibit: FC<ExhibitProps> = ({
  modelSrc,
  scale = 1.0,
  environment = 'city',
  position,
  style,
  className
}) => (
  <BaseCanvas position={position} style={style} className={className}>
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
        {isValidGlbFormat(modelSrc) && <FloatingModel modelSrc={modelSrc} scale={scale} />}
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
