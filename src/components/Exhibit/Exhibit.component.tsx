import React, { Suspense, FC, CSSProperties, useMemo, useEffect } from 'react';
import { PresentationControls, ContactShadows, Bounds } from '@react-three/drei';
import { Environment } from 'src/components/Scene/Environment.component';
import { isValidGlbFormat, triggerCallback } from 'src/services';
import { BaseModelProps, CameraProps, EnvironmentProps } from 'src/types';
import { FloatingModel } from 'src/components/Models/FloatingModel';
import { StaticModel } from 'src/components/Models/StaticModel';
import { BoundsModel } from 'src/components/Models/BoundsModel';
import { BaseCanvas } from 'src/components/BaseCanvas';
import Capture, { CaptureType } from 'src/components/Capture/Capture.component';
import { BackgroundColor } from 'src/components/Background';

export interface ExhibitProps extends CameraProps, EnvironmentProps, Omit<BaseModelProps, 'setModelFallback'> {
  /**
   * Arbitrary binary data (base64 string | Blob) of a `.glb` file or path (URL) to a `.glb` resource.
   */
  modelSrc: string | Blob;
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
  /**
   * Return base64 image after making screenshot of the canvas.
   */
  capture?: CaptureType;
  /**
   * Enables snap-back to center after rotating model.
   */
  snap?: boolean;
  /**
   * Disables vertical rotation.
   */
  lockVertical?: boolean;
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
  fit = false,
  capture,
  snap = false,
  lockVertical = false,
  onLoaded,
  onLoading
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

  useEffect(() => triggerCallback(onLoading), [modelSrc, onLoading]);

  return (
    <BaseCanvas position={position} style={style} className={className}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-mapSize={[512, 512]} castShadow />
        <PresentationControls
          global
          config={{ mass: 2, tension: 500 }}
          snap={snap}
          rotation={[0, -0.3, 0]}
          polar={lockVertical ? [0, 0] : [-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Infinity, Infinity]}
        >
          {model && (
            <Bounds fit={fit} clip={fit} observe={fit}>
              <BoundsModel modelSrc={modelSrc} fit={fit} onLoaded={onLoaded}>
                {model}
              </BoundsModel>
            </Bounds>
          )}
        </PresentationControls>
        {shadows && <ContactShadows position={[0, -1.0, 0]} opacity={0.75} scale={10} blur={2.6} far={2} />}
        <Environment environment={environment} />
      </Suspense>
      {capture && <Capture {...capture} />}
      {style?.background && <BackgroundColor color={style.background as string} />}
    </BaseCanvas>
  );
};
