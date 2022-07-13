import React, { FC, MutableRefObject } from 'react';
import { useGraph, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three-stdlib';
import { Model } from 'src/components/Models/Model';
import { Group } from 'three';
import { mutatePose } from 'src/services';

interface PoseModelProps {
  modelUrl: string;
  poseUrl: string;
  modelRef?: MutableRefObject<Group | undefined>;
  scale?: number;
}

export const PoseModel: FC<PoseModelProps> = ({ modelUrl, poseUrl, modelRef, scale = 1 }) => {
  const { scene } = useLoader(GLTFLoader, modelUrl);
  const { nodes } = useGraph(scene);
  const pose = useLoader(GLTFLoader, poseUrl);
  const { nodes: sourceNodes } = useGraph(pose.scene);

  mutatePose(nodes, sourceNodes);

  return <Model modelRef={modelRef} scene={scene} scale={scale} />;
};
