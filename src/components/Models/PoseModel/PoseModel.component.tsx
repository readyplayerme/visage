import React, { FC, MutableRefObject } from 'react';
import { useFrame, useGraph, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three-stdlib';
import { Model } from 'src/components/Models/Model';
import { Group } from 'three';
import { mutatePose } from 'src/services';
import { EmotionType } from '../../Avatar/Avatar.component';

interface PoseModelProps {
  modelUrl: string;
  poseUrl: string;
  modelRef?: MutableRefObject<Group | undefined>;
  scale?: number;
  emotion?: EmotionType;
}

// const emotions = {
//   idle : {
//     mouth: 0,
//     leftEye: 0,
//     rightEye: 0,
//     leftEyebrow: 0,
//     rightEyebrow: 0
//   },
//   sad: {
//     mouth: 0,
//     leftEye: 0,
//     rightEye: 0,
//     leftEyebrow: 0,
//     rightEyebrow: 0
//   },
//   angry: {
//     mouth: 0,
//     leftEye: 0,
//     rightEye: 0,
//     leftEyebrow: 0,
//     rightEyebrow: 0
//   },
//   happy: {
//     mouth: 0,
//     leftEye: 0,
//     rightEye: 0,
//     leftEyebrow: 0,
//     rightEyebrow: 0
//   },
// }

export const PoseModel: FC<PoseModelProps> = ({ modelUrl, poseUrl, modelRef, scale = 1, emotion = 'idle' }) => {
  const { scene } = useLoader(GLTFLoader, modelUrl);
  const { nodes } = useGraph(scene);
  const pose = useLoader(GLTFLoader, poseUrl);
  const { nodes: sourceNodes } = useGraph(pose.scene);
  const headMesh = sourceNodes;

  useFrame(() => {
    if (!nodes.RightEye || !nodes.LeftEye) {
      return;
    }

    nodes.RightEye.rotation.x = 0;
    nodes.RightEye.rotation.y = -0.5;
    nodes.RightEye.rotation.z = 0;

    nodes.LeftEye.rotation.x = 0.3;
    nodes.LeftEye.rotation.y = 0.5;
    nodes.LeftEye.rotation.z = 0.3;
  });

  console.log('emotion', emotion);
  console.log('nodes', nodes);
  console.log('headmesh', headMesh);

  mutatePose(nodes, sourceNodes);

  return <Model modelRef={modelRef} scene={scene} scale={scale} />;
};
