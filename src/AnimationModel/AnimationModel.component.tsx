import { useGLTF } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import React, { useMemo, useRef, FC } from 'react';
import { useFrame, useGraph } from '@react-three/fiber';
import { AnimationMixer, Group } from 'three';
import { normaliseMaterialsConfig } from 'src/helpers';

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
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);

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

  return (
    <group ref={ref} rotation={[0, 0, 0]}>
      <primitive key="armature" object={nodes.Armature || nodes.Hips} scale={scale} />
      {Object.keys(nodes).map((key) => {
        const node = nodes[key];

        if (node.type === 'SkinnedMesh') {
          return <primitive key={node.name} object={node} receiveShadow castShadow />;
        }

        return null;
      })}
    </group>
  );
};
