import { ContactShadows } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import React, { FC, useEffect, useState } from 'react';
import { LightingProps } from 'src/types';
import { Object3D, Vector3 } from 'three';

const LIGHT_CONFIG = Object.freeze({
  fillLightAngle: Math.PI / 3,
  backLightAngle: Math.PI / 8,
  keyLightAngle: Math.PI / 2,
  keyLightPosition: new Vector3(0.5, 1.55, 0.5),
  liftLightPosition: new Vector3(0.25, 1.7, 2.0),
  defaultProps: {
    keyLightIntensity: 1.2,
    keyLightColor: '#e8e3df',
    fillLightIntensity: 2.0,
    fillLightColor: '#99ccff',
    fillLightPosition: new Vector3(-0.5, 1.6, -0.5),
    backLightIntensity: 1.2,
    backLightColor: '#fff0d6',
    backLightPosition: new Vector3(0.5, 1.6, -1.0),
    lightTarget: new Vector3(0.0, 1.7, 0.0)
  } as Required<LightingProps>
});

Object.fromEntries = (arr: Array<any>) => Object.assign({}, ...arr.map(([k, v]) => ({ [k]: v })));

const definedProps = (obj: Object) =>
  Object.fromEntries(
    // eslint-disable-next-line
    Object.entries(obj).filter(([k, v]) => v !== undefined)
  );

const Lights: FC<LightingProps> = (lightingProps) => {
  // use default props as fallback if no custom lighting settings are provided
  const {
    keyLightIntensity,
    keyLightColor,
    fillLightIntensity,
    fillLightColor,
    fillLightPosition,
    backLightIntensity,
    backLightColor,
    backLightPosition,
    lightTarget
  } = Object.assign(LIGHT_CONFIG.defaultProps, definedProps(lightingProps));

  const { scene } = useThree();

  const [targets] = useState<{ head: Object3D; shoe: Object3D }>({
    head: new Object3D(),
    shoe: new Object3D()
  });

  useEffect(() => {
    // apply provided positions for targets
    targets.head.position.copy(lightTarget);
    targets.shoe.position.set(0.0, 0.0, 0.0);

    // add targets to scene (without the spotlights would not aim at them)
    scene.add(targets.head);
    scene.add(targets.shoe);
  }, []);

  return (
    <group>
      {/* Fill light that by default creates strong blue rim on the right face side. */}
      <spotLight
        position={fillLightPosition}
        target={targets.head}
        angle={LIGHT_CONFIG.fillLightAngle}
        color={fillLightColor}
        intensity={fillLightIntensity}
      />
      {/* Back light that by default creates light warm rim on the left face side. */}
      <spotLight
        position={backLightPosition}
        target={targets.head}
        angle={LIGHT_CONFIG.backLightAngle}
        color={backLightColor}
        intensity={backLightIntensity}
      />
      {/* Key light that creates soft face light. */}
      <spotLight
        position={LIGHT_CONFIG.keyLightPosition}
        target={targets.head}
        angle={LIGHT_CONFIG.keyLightAngle}
        color={keyLightColor}
        intensity={keyLightIntensity}
      />
      {/* Lift light that creates soft light on body and shoes. */}
      <spotLight
        position={LIGHT_CONFIG.liftLightPosition}
        target={targets.shoe}
        angle={LIGHT_CONFIG.keyLightAngle}
        color={keyLightColor}
        intensity={keyLightIntensity * 0.16}
      />
      <ContactShadows opacity={1.0} scale={2.0} blur={1.0} far={0.25} resolution={256} color="#000000" />
      {/* Invisble "shadow catcher" used by contact shadows with small offset on y axis to reduce clipping and artifacts. */}
      <mesh rotation={[Math.PI * -0.5, 0.0, 0.0]} position={[0.0, -0.05, 0.0]}>
        <planeGeometry args={[4.0, 4.0, 4.0]} />
        <meshBasicMaterial opacity={0.0} transparent depthWrite={false} />
      </mesh>
    </group>
  );
};

export default Lights;
