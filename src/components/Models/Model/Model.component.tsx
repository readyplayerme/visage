import React, { FC, Ref, useEffect, useState, useCallback } from 'react';
import { Group, Mesh } from 'three';
import { normaliseMaterialsConfig, triggerCallback } from 'src/services';
import { useGraph, useThree } from '@react-three/fiber';
import { BaseModelProps } from 'src/types';
import { Spawn } from '../../Spawn/Spawn';

interface ModelProps extends BaseModelProps {
  scene: Group;
  modelRef?: Ref<Group>;
  scale?: number;
  onSpawnAnimationFinish?: () => void;
}

const ROTATION_STEP = 0.005;

export const Model: FC<ModelProps> = ({ scene, scale = 1, modelRef, onLoaded, onSpawnAnimationFinish, bloom }) => {
  const { materials } = useGraph(scene);
  const { gl } = useThree();
  const [isTouching, setIsTouching] = useState(false);
  const setTouchingOn = () => setIsTouching(true);
  const setTouchingOff = () => setIsTouching(false);
  const onTouchMove = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (isTouching && event instanceof MouseEvent) {
        // eslint-disable no-param-reassign
        scene.rotation.y += event.movementX * ROTATION_STEP;
      }

      if (isTouching && event instanceof TouchEvent) {
        // eslint-disable no-param-reassign
        scene.rotation.y += event.touches[0].clientX * ROTATION_STEP;
      }
    },
    [isTouching]
  );

  normaliseMaterialsConfig(materials, bloom);
  scene.traverse((object) => {
    const node = object;

    if ((node as Mesh).isMesh) {
      node.castShadow = true;
    }

    if (node.type === 'SkinnedMesh') {
      node.receiveShadow = true;
    }
  });

  useEffect(() => triggerCallback(onLoaded), [scene, materials, onLoaded]);

  useEffect(() => {
    gl.domElement.addEventListener('mousedown', setTouchingOn);
    gl.domElement.addEventListener('touchstart', setTouchingOn);
    gl.domElement.addEventListener('mouseup', setTouchingOff);
    gl.domElement.addEventListener('touchend', setTouchingOff);
    gl.domElement.addEventListener('touchcancel', setTouchingOff);

    gl.domElement.addEventListener('mousemove', onTouchMove);
    gl.domElement.addEventListener('touchmove', onTouchMove);

    return () => {
      gl.domElement.removeEventListener('mousedown', setTouchingOn);
      gl.domElement.removeEventListener('touchstart', setTouchingOn);
      gl.domElement.removeEventListener('mouseup', setTouchingOff);
      gl.domElement.removeEventListener('touchend', setTouchingOff);
      gl.domElement.removeEventListener('touchcancel', setTouchingOff);

      gl.domElement.removeEventListener('mousemove', onTouchMove);
      gl.domElement.removeEventListener('touchmove', onTouchMove);
    };
  });

  return (
    <group ref={modelRef} dispose={null} rotation={[0, 0, 0]}>
      <primitive object={scene} scale={scale} />
      <Spawn avatar={scene} onSpawnFinish={onSpawnAnimationFinish} />
    </group>
  );
};
