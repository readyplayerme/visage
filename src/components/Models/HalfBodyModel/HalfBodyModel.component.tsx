import React, { FC, useRef } from 'react';
import { useFrame, useGraph, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three-stdlib';
import { Model } from 'src/components/Models/Model';
import { useEmotion, useHeadMovement } from 'src/services';
import { Group } from 'three';
import { Emotion } from '../../Avatar/Avatar.component';

interface HalfBodyModelProps {
  modelSrc: string;
  rotation?: number;
  scale?: number;
  idleRotation?: boolean;
  emotion?: Emotion;
}

let currentRotation = 0;

export const HalfBodyModel: FC<HalfBodyModelProps> = ({
  modelSrc,
  scale = 1,
  rotation = 20 * (Math.PI / 180),
  idleRotation = false,
  emotion
}) => {
  const ref = useRef<Group>();
  const { scene } = useLoader(GLTFLoader, modelSrc);
  const { nodes } = useGraph(scene);

  scene.traverse((object) => {
    const node = object;
    if (node.name === 'Wolf3D_Hands') {
      node.visible = false;
    }

    if (node.name === 'RightHand') {
      node.position.set(0, -2, 0);
    }

    if (node.name === 'LeftHand') {
      node.position.set(0, -2, 0);
    }
  });

  useFrame((state, delta) => {
    if (!idleRotation) {
      return;
    }

    if (ref?.current) {
      currentRotation += delta * 0.2;
      ref.current.rotation.y = rotation + Math.sin(currentRotation) / 3;
    }
  });

  useHeadMovement(nodes, true);
  useEmotion(nodes, emotion);

  return <Model modelRef={ref} scene={scene} scale={scale} />;
};
