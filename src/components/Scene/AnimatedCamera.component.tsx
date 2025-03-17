import { FC, useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { AnimationMixer, Object3D } from 'three';

type AnimatedCameraProps = {
  animatedCameraGlbSrc: string;
};

export const AnimatedCamera: FC<AnimatedCameraProps> = ({ animatedCameraGlbSrc }) => {
  const { camera } = useThree();
  const { scene, animations } = useGLTF(animatedCameraGlbSrc);
  const mixerRef = useRef<AnimationMixer | null>(null);

  useEffect(() => {
    if (animations.length > 0) {
      mixerRef.current = new AnimationMixer(scene);
      animations.forEach((clip) => {
        const action = mixerRef.current!.clipAction(clip);
        action.play();
      });
    }
  }, [scene, animations]);

  useFrame((_, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);

      const animatedCamera = scene.getObjectByName('camera') as Object3D;
      if (animatedCamera) {
        camera.position.copy(animatedCamera.position);
        camera.quaternion.copy(animatedCamera.quaternion);

        camera.rotateZ(Math.PI);
      }
    }
  });

  return null;
};
