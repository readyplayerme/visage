import React, { FC, MutableRefObject } from 'react';
import { useGraph } from '@react-three/fiber';
import { Model } from 'src/components/Models/Model';
import { Group } from 'three';
import { mutatePose, useEmotion, useFallback, useGltfLoader } from 'src/services';
import { Emotion } from '../../Avatar/Avatar.component';

interface PoseModelProps {
  modelSrc: string | Blob;
  poseSrc: string | Blob;
  modelRef?: MutableRefObject<Group | undefined>;
  scale?: number;
  emotion?: Emotion;
  setModelFallback: (fallback: JSX.Element) => void;
}

export const PoseModel: FC<PoseModelProps> = ({
  modelSrc,
  poseSrc,
  modelRef,
  scale = 1,
  emotion,
  setModelFallback
}) => {
  const { scene } = useGltfLoader(modelSrc);
  const { nodes } = useGraph(scene);
  const pose = useGltfLoader(poseSrc);
  const { nodes: sourceNodes } = useGraph(pose.scene);

  mutatePose(nodes, sourceNodes);
  useEmotion(nodes, emotion);
  useFallback(setModelFallback, nodes);

  return <Model modelRef={modelRef} scene={scene} scale={scale} />;
};
