import React, { FC, MutableRefObject } from 'react';
import { useFrame, useGraph, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three-stdlib';
import { Model } from 'src/components/Models/Model';
import { Group, SkinnedMesh } from 'three';
import { mutatePose } from 'src/services';
import { EmotionVariantsType } from '../../Avatar/Avatar.component';

interface PoseModelProps {
  modelUrl: string;
  poseUrl: string;
  modelRef?: MutableRefObject<Group | undefined>;
  scale?: number;
  emotion?: EmotionVariantsType;
}

export type EmotionType = { id: number; value: number; name: string };

const emotions: Record<EmotionVariantsType, Array<EmotionType>> = {
  idle: [],
  impressed: [
    {
      id: 0,
      value: 0.7,
      name: 'mouthOpen'
    },
    {
      id: 1,
      value: 0.3,
      name: 'mouthSmile'
    },
    {
      id: 24,
      value: 0.4,
      name: 'mouthDimpleLeft'
    },
    {
      id: 25,
      value: 0.4,
      name: 'mouthDimpleRight'
    },
    {
      id: 7,
      value: 0.75,
      name: 'eyeWideLeft'
    },
    {
      id: 10,
      value: 0.75,
      name: 'eyeWideRight'
    },
    {
      id: 40,
      value: 0.3,
      name: 'browInnerUp'
    }
  ],
  sad: [
    {
      id: 1,
      value: -0.35,
      name: 'mouthSmile'
    },
    {
      id: 38,
      value: -0.45,
      name: 'browDownLeft'
    },
    {
      id: 39,
      value: -0.45,
      name: 'browDownRight'
    },
    {
      id: 30,
      value: 0.3,
      name: 'browDownRight'
    },
    {
      id: 46,
      value: -0.35,
      name: 'noseSneerLeft'
    },
    {
      id: 47,
      value: -0.35,
      name: 'noseSneerRight'
    }
  ],
  angry: [
    {
      id: 38,
      value: 0.95,
      name: 'browDownLeft'
    },
    {
      id: 39,
      value: 0.95,
      name: 'browDownRight'
    },
    {
      id: 24,
      value: -0.5,
      name: 'mouthDimpleLeft'
    },
    {
      id: 25,
      value: -0.5,
      name: 'mouthDimpleRight'
    },
    {
      id: 35,
      value: -0.3,
      name: 'mouthLowerDownRight'
    },
    {
      id: 34,
      value: -0.3,
      name: 'mouthLowerDownLeft'
    },
    {
      id: 46,
      value: 0.35,
      name: 'noseSneerLeft'
    },
    {
      id: 47,
      value: 0.35,
      name: 'noseSneerRight'
    },
    {
      id: 5,
      value: 0.15,
      name: 'eyeBlinkLeft'
    },
    {
      id: 8,
      value: 0.15,
      name: 'eyeBlinkRight'
    }
  ],
  happy: [
    {
      id: 1,
      value: 0.6,
      name: 'mouthSmile'
    },
    {
      id: 0,
      value: 0.3,
      name: 'mouthOpen'
    },
    {
      id: 39,
      value: -0.5,
      name: 'browDownRight'
    },
    {
      id: 38,
      value: -0.5,
      name: 'browDownLeft'
    },
    {
      id: 24,
      value: 0.7,
      name: 'mouthDimpleLeft'
    },
    {
      id: 25,
      value: 0.7,
      name: 'mouthDimpleRight'
    },
    {
      id: 46,
      value: 0.45,
      name: 'noseSneerLeft'
    },
    {
      id: 47,
      value: 0.45,
      name: 'noseSneerRight'
    }
  ]
};

export const PoseModel: FC<PoseModelProps> = ({ modelUrl, poseUrl, modelRef, scale = 1, emotion = 'idle' }) => {
  const { scene } = useLoader(GLTFLoader, modelUrl);
  const { nodes } = useGraph(scene);
  const pose = useLoader(GLTFLoader, poseUrl);
  const { nodes: sourceNodes } = useGraph(pose.scene);
  const headMesh = nodes.Wolf3D_Head as SkinnedMesh;

  useFrame(() => {
    if (!headMesh) {
      return;
    }

    if (emotion !== 'idle') {
      emotions[emotion].forEach((item) => {
        headMesh!.morphTargetInfluences![item.id] = item.value;
      });
    }
  });

  mutatePose(sourceNodes, nodes);

  return <Model modelRef={modelRef} scene={scene} scale={scale} />;
};
