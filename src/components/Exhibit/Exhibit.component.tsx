import React, { Suspense, FC, CSSProperties, useMemo } from 'react';
import { PresentationControls, ContactShadows, Bounds } from '@react-three/drei';
import { Environment } from 'src/components/Scene/Environment.component';
import { isValidGlbFormat } from 'src/services';
import { CameraProps, EnvironmentProps } from 'src/types';
import { FloatingModel } from 'src/components/Models/FloatingModel';
import { StaticModel } from 'src/components/Models/StaticModel';
import { BoundsModel } from 'src/components/Models/BoundsModel';
import { BaseCanvas } from '../BaseCanvas';

export interface ExhibitProps extends CameraProps, EnvironmentProps {
  /**
   * Arbitrary binary data (base64 string | Blob) of a `.glb` file or path (URL) to a `.glb` resource.
   */
  modelSrc: string;
  /**
   * Size of the rendered GLB model.
   */
  scale?: number;
  /**
   * Pass styling to canvas.
   */
  style?: CSSProperties;
  /**
   * Custom style classes for canvas.
   */
  className?: string;
  /**
   * Enables soft shadows.
   */
  shadows?: boolean;
  /**
   * Enables floating idle animation.
   */
  float?: boolean;
  /**
   * Enables model to fit to available canvas dimensions.
   */
  fit?: boolean;
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
  className,
  shadows = false,
  float = false,
  fit = false
}) => {
  const model = useMemo(() => {
    if (!isValidGlbFormat(modelSrc)) {
      return null;
    }

    if (!float) {
      return <StaticModel modelSrc={modelSrc} scale={scale} />;
    }

    return <FloatingModel modelSrc={modelSrc} scale={scale} />;
  }, [float, modelSrc, scale]);

  return (
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
          {model && (
            <Bounds fit={fit} clip={fit} observe={fit}>
              <BoundsModel modelSrc={modelSrc} fit={fit}>
                {model}
              </BoundsModel>
            </Bounds>
          )}
        </PresentationControls>
        {shadows && (
          <ContactShadows
            rotation-x={Math.PI / 2}
            position={[0, -1.0, 0]}
            opacity={0.75}
            width={10}
            height={10}
            blur={2.6}
            far={2}
          />
        )}
        <Environment environment={environment} />
      </Suspense>
    </BaseCanvas>
  );
};
