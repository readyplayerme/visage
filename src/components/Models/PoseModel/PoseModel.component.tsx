import React, {FC, MutableRefObject, useEffect} from 'react';
import {useGraph, useLoader, useThree} from '@react-three/fiber';
import { GLTFLoader } from 'three-stdlib';
import { Model } from 'src/components/Models/Model';
import { Group } from 'three';
import { mutatePose, useEmotion } from 'src/services';
import { Emotion } from '../../Avatar/Avatar.component';

interface PoseModelProps {
  modelUrl: string;
  poseUrl: string;
  modelRef?: MutableRefObject<Group | undefined>;
  scale?: number;
  emotion?: Emotion;
  capture?: boolean;
}

export const PoseModel: FC<PoseModelProps> = ({ modelUrl, capture, poseUrl, modelRef, scale = 1, emotion }) => {
  const { scene } = useLoader(GLTFLoader, modelUrl);
  const { nodes } = useGraph(scene);
  const pose = useLoader(GLTFLoader, poseUrl);
  const { nodes: sourceNodes } = useGraph(pose.scene);

  const gl = useThree((state) => state.gl)

  useEffect(() => {
    if (capture) {
      console.log('capture', capture);

      const link = document?.createElement('a')
      link.setAttribute('download', 'canvas.png')
      link.setAttribute('href', gl.domElement.toDataURL('image/png').replace('image/png', 'image/octet-stream'))
      link.click();
    }
  }, [gl, capture]);

  mutatePose(nodes, sourceNodes);
  useEmotion(nodes, emotion);

  return <Model modelRef={modelRef} scene={scene} scale={scale} />;
};
