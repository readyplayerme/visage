import React, { FC, MutableRefObject } from 'react';
import { useGraph, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three-stdlib';
import { Model } from 'src/components/Models/Model';
import { Group } from 'three';
import { mutatePose, useEmotion } from 'src/services';
import { Emotion } from '../../Avatar/Avatar.component';

interface PoseModelProps {
  modelSrc: string;
  poseSrc: string;
  modelRef?: MutableRefObject<Group | undefined>;
  scale?: number;
  emotion?: Emotion;
}

export const PoseModel: FC<PoseModelProps> = ({ modelSrc, poseSrc, modelRef, scale = 1, emotion }) => {
  const { scene } = useLoader(GLTFLoader, modelSrc);
  const { nodes } = useGraph(scene);
  const pose = useLoader(GLTFLoader, poseSrc);
  const { nodes: sourceNodes } = useGraph(pose.scene);

  mutatePose(nodes, sourceNodes);
  useEmotion(nodes, emotion);

  return <Model modelRef={modelRef} scene={scene} scale={scale} />;
};
