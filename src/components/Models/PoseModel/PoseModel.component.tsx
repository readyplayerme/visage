import React, { FC, MutableRefObject } from 'react';
import { useGraph } from '@react-three/fiber';
import { Model } from 'src/components/Models/Model';
import { Group } from 'three';
import { mutatePose, useEmotion, useGltfLoader } from 'src/services';
import { Emotion } from '../../Avatar/Avatar.component';

interface PoseModelProps {
  modelSrc: string | Blob;
  poseSrc: string | Blob;
  modelRef?: MutableRefObject<Group | undefined>;
  scale?: number;
  emotion?: Emotion;
}

export const PoseModel: FC<PoseModelProps> = ({ modelSrc, poseSrc, modelRef, scale = 1, emotion }) => {
  const { scene } = useGltfLoader(modelSrc);
  const { nodes } = useGraph(scene);
  const pose = useGltfLoader(poseSrc);
  const { nodes: sourceNodes } = useGraph(pose.scene);

  mutatePose(nodes, sourceNodes);
  useEmotion(nodes, emotion);

  return <Model modelRef={modelRef} scene={scene} scale={scale} />;
};
