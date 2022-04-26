import { useGLTF } from '@react-three/drei';
import React, { useRef, FC } from 'react';
import { useFrame, useGraph } from '@react-three/fiber';
import { AnimationMixer, Group } from 'three';
import { normaliseMaterialsConfig } from 'src/helpers';
import { Model } from 'src/Model/Model.component';

interface AnimationModelProps {
  modelUrl: string;
  animationUrl: string;
  rotation?: number;
  scale?: number;
}

const defaultRotation = 20 * (Math.PI / 180);
let currentRotation = 0;

export const AnimationModel: FC<AnimationModelProps> = ({
  modelUrl,
  animationUrl,
  rotation = defaultRotation,
  scale = 1
}) => {
  const ref = useRef<Group>();
  const { scene } = useGLTF(modelUrl, false);
  const { nodes, materials } = useGraph(scene);
  normaliseMaterialsConfig(materials);

  const animationSource = useGLTF(animationUrl, false);
  const mixer = new AnimationMixer(nodes.Armature);
  mixer.clipAction(animationSource.animations[0]).play();
  mixer.update(0);

  useFrame((state, delta) => {
    mixer?.update(delta);
    if (ref?.current) {
      currentRotation += delta * 0.2;
      ref.current.rotation.y = rotation + Math.sin(currentRotation) / 3;
    }
  });

  return <Model modelRef={ref} scene={scene} scale={scale} />;
};
