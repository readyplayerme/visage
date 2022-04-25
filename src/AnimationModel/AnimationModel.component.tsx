import { useGLTF } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import React, { useMemo, useRef, FC } from 'react';
import { useFrame, useGraph } from '@react-three/fiber';
import { AnimationMixer, LinearFilter, Material, MeshStandardMaterial, Object3D } from 'three';

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
  const { scene } = useGLTF(modelUrl, false);
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);
  const meshRef = useRef<Object3D>();
  const animationSource = useGLTF(animationUrl, false);
  const mixer = new AnimationMixer(nodes.Armature);

  mixer.clipAction(animationSource.animations[0]).play();
  mixer.update(0);

  Object.values(materials).forEach((material: Material) => {
    const mat = material as MeshStandardMaterial;
    if (mat.map) {
      mat.map.minFilter = LinearFilter;
      mat.depthWrite = true;
    }
  });

  useFrame((state, delta) => {
    const ref = meshRef.current as Object3D;
    mixer?.update(delta);
    currentRotation += delta * 0.2;
    ref.rotation.y = rotation + Math.sin(currentRotation) / 3;
  });

  return (
    <group ref={meshRef} rotation={[0, 0, 0]}>
      <primitive key="armature" object={nodes.Armature || nodes.Hips} scale={scale} />
      {Object.keys(nodes).map((key) => {
        const node: any = nodes[key];

        if (node.type === 'SkinnedMesh') {
          return <primitive key={node.name} object={node} receiveShadow castShadow />;
        }

        return null;
      })}
    </group>
  );
};
